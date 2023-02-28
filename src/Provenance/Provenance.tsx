import { Provenance, initProvenance, NodeID } from "@visdesignlab/trrack";
import { IAppState } from "./interfaces";
import { ActionReturnType } from "@visdesignlab/trrack/dist/Types/Action";
import { ProvVisCreator } from "@visdesignlab/trrack-vis";
// import { ProvVisCreator } from "@trrack/vis-react";
import { makeDeepCopy, toCamelCaseString } from "./utils";
import Global_Filter from "../componentGraph/Global_Filter";
import { saveComponentGraph } from "../componentGraph/ComponentGraph";
import { getComponentGraph } from "../componentGraph/ComponentGraph";
import Visualization from "../componentGraph/Visualization";
import { visuals } from "../componentGraph/ComponentGraph";
import Filter from "../componentGraph/Filter";

let reset_interactive_attributes: boolean = true

export interface IAction {
  event: (
    onDashboardClick: () => Promise<{
      newState: IAppState;
      label: string;
      updateProv: boolean;
      eventType: string;
      bookmark: any;
      graph: any;
    }>
  ) => void;
}
/**
 * The function hides the buttons (undo/redo) of the provenance graph
 */
function hideButtons(){
  const buttons: any = document.getElementById("undoRedoDiv");
  buttons.hidden = true;
  const div: any = document.getElementById("provDiv");
  div.hidden = false;
}

let importedGraph: any = null;

interface IAppProvenance {
  provenance: Provenance<IAppState, string, void>;
  actions: IAction;
}

const stack: Array<string> = ["none", "none"];
const prevState: Array<string> = ["none"];
const lastKnownLabel: Array<string> = ['none'];

/**
 * DESCRIPTION
 * @param newState: any
 */
function moveStack(newState: any){
  //console.log("moveStack ", newState)
  stack[1] = stack[0];
  stack[0] = newState;
}

/**
 * Initializes trrack and trrack-vis provenance
 * @param defaultState Initial state of the dashboard
 */

export function setupProvenance(defaultState: IAppState): IAppProvenance {
  const provenance = initProvenance<IAppState, string, void>(
    defaultState as IAppState
  );

  provenance.done();

  const nodeBookmarkMap = {}
  const graphMap = {}
  /**
   * DESCRIPTION
  */
  async function applyBookmark(bookmark_: any){
    const {bookmark, report} = bookmark_
    moveStack('_appliedBookmark')
    const s = await report.bookmarksManager.applyState(bookmark)
  }
  /**
   * DESCRIPTION
   */
  function provVisUpdate() {
    ProvVisCreator(
      document.getElementById("provDiv")!,
      provenance,
      (newNode: NodeID) => {
        //console.log('New node ', newNode)
        const {node, bookmark} = nodeBookmarkMap[newNode]
        provenance.goToNode(node.id);
        //console.log('captured state', nodeBookmarkMap[newNode].bookmark.bookmark)
        applyBookmark(bookmark);
        console.log('RESTORED GRAPH', graphMap[newNode].graph)
        saveComponentGraph(graphMap[newNode].graph)
        //In case the state doesn't change and the observers arent called, updating the ProvVis here.
        provVisUpdate();

      },
      false, undefined, undefined, {height: 200000},
    );
  }

  provVisUpdate();

  const event = async (
    onDashboardClick: () => Promise<{
      newState: IAppState;
      label: string;
      updateProv: boolean;
      eventType: string;
      bookmark: any;
      graph: any;
    }>
  ) => {
    const { newState, label, updateProv, eventType, bookmark, graph } = await onDashboardClick();
    // if the stack contains two events rendered, it means user randonly clicks on the dashboard and there is no need to save these states.
    let usedLabel: string = label
    //console.log("event ", eventType)
    hideButtons();
    const stateAsString: string = JSON.stringify(newState)
    const oneNotRendered: boolean = stack[0] !== "rendered" || stack[1] !== "rendered"
    const dataChanged: boolean = (eventType == "rendered" && stack[0] != 'dataSelected' && stateAsString !== prevState[0])
    const renderedAfterSelection: boolean = (eventType == "rendered" && stack[0] == 'dataSelected')
    if(label != 'null' && label != 'none'){
      lastKnownLabel[0] = label
    }
    else{
      if(dataChanged){
        //('dataChanged ', eventType, stack)
        usedLabel = 'Reset Selection'
      } else {
      usedLabel = lastKnownLabel[0]
      }
    }
    //console.log("stack before ", stack)
    if (updateProv && (dataChanged || renderedAfterSelection) && stack[0] != '_appliedBookmark' && eventType !== 'loaded') {
      //console.log('STATE LABEL::: ' + usedLabel)

      provenance.apply(
        {
          apply: () =>
            ({
              state: newState as IAppState,
              label: usedLabel,
              stateSaveMode: "Complete",
              actionType: "Regular",
              eventType: "",
              meta: {},
            } as ActionReturnType<IAppState, string>),
        },
        usedLabel
      );

      const currentNode = provenance.current
      nodeBookmarkMap[currentNode.id] = {node: currentNode, bookmark: bookmark}
      const componentGraph = getComponentGraph();
      const newGlobalFilters = new Global_Filter();
      newGlobalFilters.setGlobalFilter();
      componentGraph.dashboard.global_filter = newGlobalFilters;
      const currentNodeState = provenance.getState(currentNode)
      const vis_array = []
      const oldComponentGraph = getComponentGraph();
      for (const vis of visuals){
        const visualization = new Visualization()
        await visualization.setVisualData(vis)
        vis_array.push(visualization)
      }
      componentGraph.dashboard.visualizations = vis_array
      for (const vis in currentNodeState){
        const visualizationTitle = vis
        const visualizationState = currentNodeState[visualizationTitle]

        if (visualizationState['selected'] == null || visualizationState['type'] === 'card'){
          continue
        }
        else{
          for (const vis in componentGraph.dashboard.visualizations){
            if (toCamelCaseString(componentGraph.dashboard.visualizations[vis]['title']['text']) === visualizationTitle){

              for (const selectedAttribute in visualizationState['selected']){
                componentGraph.dashboard.visualizations[vis].interactions.interactionChartsFiltering = [];
                if (reset_interactive_attributes){
                  componentGraph.dashboard.visualizations[vis].interactions.interactionAttributes = []
                }
                componentGraph.dashboard.visualizations[vis].interactions.interactionAttributes.push(selectedAttribute) //['interactionAttributes']
                reset_interactive_attributes = false
                for (const visual in componentGraph.dashboard.visualizations){
                  if(oldComponentGraph.dashboard.visualizations[visual].data.data !== componentGraph.dashboard.visualizations[visual].data.data){
                    componentGraph.dashboard.visualizations[vis].interactions.interactionChartsFiltering.push(componentGraph.dashboard.visualizations[visual].id)
                    const filter = new Filter()
                    filter.attribute = selectedAttribute;
                    filter.operation = "Equal";
                    filter.values = visualizationState['selected'][selectedAttribute];
                    componentGraph.dashboard.visualizations[visual].filters.filters.push(filter)
                  }
                }
                componentGraph.dashboard.visualizations[vis].interactions.description = componentGraph.dashboard.visualizations[vis].interactions.getInteractionDescription();
              }
            }
          }

        }
      }
      saveComponentGraph(componentGraph);
      console.log('COMP', componentGraph)

      graphMap[currentNode.id] = {node: currentNode, graph: makeDeepCopy(componentGraph)}
      console.log(
        "Provenance Data",
        JSON.parse(provenance.exportProvenanceGraph())
      );

    } else if (eventType == 'loaded'){
      const currentNode = provenance.current
      nodeBookmarkMap[currentNode.id] = {node: currentNode, bookmark: bookmark}
      importedGraph = graph
      graphMap[currentNode.id] = {node: currentNode, graph: makeDeepCopy(importedGraph)}
    }

    moveStack(eventType);
    prevState[0] = stateAsString;

  };
  return {
    provenance,
    actions: {
      event,
    },
  };
}