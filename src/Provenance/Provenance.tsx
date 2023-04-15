import { Provenance, initProvenance, NodeID } from "@visdesignlab/trrack";
import { IAppState } from "./interfaces";
import { ActionReturnType } from "@visdesignlab/trrack/dist/Types/Action";
import { ProvVisCreator } from "@visdesignlab/trrack-vis";
// import { ProvVisCreator } from "@trrack/vis-react";
import { makeDeepCopy, toCamelCaseString } from "./utils";
import Global_Filter from "../componentGraph/Global_Filter";
import {
  replacer,
  reviver,
  saveComponentGraph,
} from "../componentGraph/ComponentGraph";
import { getComponentGraph } from "../componentGraph/ComponentGraph";
import Visualization from "../componentGraph/Visualization";
import { visuals } from "../componentGraph/ComponentGraph";
import Filter from "../componentGraph/Filter";
import { replace } from "lodash";

let restoring = false;

let reset_interactive_attributes: boolean = true;

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
function hideButtons() {
  const buttons: any = document.getElementById("undoRedoDiv");
  buttons.hidden = true;
  const div: any = document.getElementById("provDiv");
  div.hidden = false;
}

let importedGraph: any = null;


async function updateGraph(provenance:any, currentNode:any) {

  const componentGraph = makeDeepCopy(getComponentGraph());
  const oldComponentGraph = makeDeepCopy(componentGraph);
      const newGlobalFilters = new Global_Filter();
      newGlobalFilters.setGlobalFilter();
      componentGraph.dashboard.global_filter = newGlobalFilters;
      const currentNodeState = provenance.getState(currentNode);
      console.log('54 ', currentNodeState)
      const vis_array = [];
      // const oldComponentGraph = getComponentGraph();
      for (const vis of visuals) {
        const visualization = new Visualization();
        await visualization.setVisualData(vis);
        vis_array.push(visualization);
      }
      componentGraph.dashboard.visualizations = vis_array;
      for (const vis in currentNodeState) {
        const visualizationTitle = vis;
        const visualizationState = currentNodeState[visualizationTitle];

        if (
          visualizationState["selected"] == null ||
          visualizationState["type"] === "card"
        ) {
          continue;
        } else {
          for (const vis in componentGraph.dashboard.visualizations) {
            if (
              toCamelCaseString(
                componentGraph.dashboard.visualizations[vis]["title"]["text"]
              ) === visualizationTitle
            ) {
              for (const selectedAttribute in visualizationState["selected"]) {
                componentGraph.dashboard.visualizations[
                  vis
                ].interactions.interactionChartsFiltering = [];
                if (reset_interactive_attributes) {
                  componentGraph.dashboard.visualizations[
                    vis
                  ].interactions.interactionAttributes = [];
                }
                componentGraph.dashboard.visualizations[
                  vis
                ].interactions.interactionAttributes.push(selectedAttribute); //['interactionAttributes']
                reset_interactive_attributes = false;
                for (const visual in componentGraph.dashboard.visualizations) {
                  if (
                    oldComponentGraph.dashboard.visualizations[visual].data
                      .data !==
                    componentGraph.dashboard.visualizations[visual].data.data
                  ) {
                    componentGraph.dashboard.visualizations[
                      vis
                    ].interactions.interactionChartsFiltering.push(
                      componentGraph.dashboard.visualizations[visual].id
                    );
                    const filter = new Filter();
                    filter.attribute = selectedAttribute;
                    filter.operation = "Equal";
                    filter.values =
                      visualizationState["selected"][selectedAttribute];
                    componentGraph.dashboard.visualizations[
                      visual
                    ].filters.filters.push(filter);
                  }
                }
                componentGraph.dashboard.visualizations[
                  vis
                ].interactions.description =
                  componentGraph.dashboard.visualizations[
                    vis
                  ].interactions.getInteractionDescription();
              }
            }
          }
        }
      }
      saveComponentGraph(componentGraph);
      console.log("COMP", componentGraph);
      return componentGraph
}

interface IAppProvenance {
  provenance: Provenance<IAppState, string, void>;
  actions: IAction;
}

const stack: Array<string> = ["none", "none"];
const prevState: Array<string> = ["none"];
const lastKnownLabel: Array<string> = ["none"];

/**
 * DESCRIPTION
 * @param newState: any
 */
function moveStack(newState: any) {
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

  const nodeBookmarkMap = {};
  const bookmarksCopies = {};
  const graphMap = {};
  const compGraphs = {};

  function updateBookmarkMap(id: any, node:any, bookmark:any){
    console.log('bookmark', id, bookmark, node)
    nodeBookmarkMap[id] = {
      node: node,
      bookmark: bookmark,
    };
    bookmarksCopies[id] = {
      bookmark: bookmark.bookmark
    }
    console.log(bookmarksCopies)
    localStorage.setItem('oldBookmarks', JSON.stringify(bookmarksCopies))
  }
  /**
   * DESCRIPTION
   */
  async function applyBookmark(bookmark_: any) {
    const { bookmark, report } = bookmark_;
    moveStack("_appliedBookmark");
    console.log('97, ', bookmark, bookmark_)
    const s = await report.bookmarksManager.applyState(bookmark);
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
        console.log('108 ', nodeBookmarkMap, newNode, nodeBookmarkMap[newNode])
        const { node, bookmark } = nodeBookmarkMap[newNode];
        provenance.goToNode(node.id);
        //console.log('captured state', nodeBookmarkMap[newNode].bookmark.bookmark)
        applyBookmark(bookmark);
        console.log("RESTORED GRAPH", graphMap[newNode].graph);
        saveComponentGraph(graphMap[newNode].graph);
        
        //In case the state doesn't change and the observers arent called, updating the ProvVis here.
        provVisUpdate();
        localStorage.setItem(
          "ProvenanceGraph",
          JSON.stringify(provenance.exportProvenanceGraph(), replacer)
        );
      },
      false,
      undefined,
      undefined,
      { height: 200000 }
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
    const odc = await onDashboardClick();
    const { newState, label, updateProv, bookmark, graph } = odc;
    const {eventType} = odc;
    // if the stack contains two events rendered, it means user randonly clicks on the dashboard and there is no need to save these states.
    let usedLabel: string = label;

    hideButtons();
    const stateAsString: string = JSON.stringify(newState, replacer);
    const oneNotRendered: boolean =
      stack[0] !== "rendered" || stack[1] !== "rendered";
    const dataChanged: boolean =
      eventType == "rendered" &&
      stack[0] != "dataSelected" &&
      stateAsString !== prevState[0];
    const renderedAfterSelection: boolean =
      eventType == "rendered" && stack[0] == "dataSelected";
    // const gf: string = JSON.stringify(
    //   getComponentGraph().dashboard.global_filter
    // );
    if (label != "null" && label != "none") {
      lastKnownLabel[0] = label;
    } else {
      if (dataChanged) {
        if(restoring){
          usedLabel = "Page Reloaded"
          restoring = false
        } else {
          usedLabel = "Data Changed";
        }
        
        // await new Promise(r => setTimeout(r, 2000));
        // console.log(gf, prevGlobalFilters[0])
        // if (gf !== prevGlobalFilters[0]){
        //   usedLabel = 'Changed global filter'
        //   console.log('Global filters as string', gf)

        // }
      } else {
        usedLabel = lastKnownLabel[0];
      }
    }
    //console.log("stack before ", stack)
    if (
      updateProv &&
      (dataChanged || renderedAfterSelection) &&
      stack[0] != "_appliedBookmark" &&
      eventType !== "loaded"
    ) {
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

      const currentNode = provenance.current;
      // nodeBookmarkMap[currentNode.id] = {
      //   node: currentNode,
      //   bookmark: bookmark,
      // };
      updateBookmarkMap(currentNode.id, currentNode, bookmark)
      
      await updateGraph(provenance, currentNode)
      const componentGraph = getComponentGraph();

      graphMap[currentNode.id] = {
        node: currentNode,
        graph: makeDeepCopy(componentGraph),
      };
      compGraphs[currentNode.id] = makeDeepCopy(componentGraph)
      localStorage.setItem('compGraphs', JSON.stringify(compGraphs, replacer))
      localStorage.setItem(
        "ProvenanceGraph",
        JSON.stringify(provenance.exportProvenanceGraph(), replacer)
      );
    } else if (eventType == "loaded") {
      if (localStorage.getItem("ProvenanceGraph")) {
        const oldComp: any = JSON.parse(localStorage.getItem("compGraphs")!, reviver)
        restoring = true; 
        let oldBookmarks: any;
        if (localStorage.getItem('oldBookmarks') == null){
          oldBookmarks = {}
        } else {
          oldBookmarks = JSON.parse(localStorage.getItem('oldBookmarks')!)
        }
        console.log('Oldbookmarks ', oldBookmarks)
        const mapping: Record<string, string> = {};
        const visitedNodes: Array<string> = [];
        const rootNodeId = provenance.current.id;
        console.log("Root id ", rootNodeId);
        const graph = JSON.parse(JSON.parse(
          localStorage.getItem("ProvenanceGraph")!,
          reviver
        ));

        
        const oldCurrent = graph['current']
        let oldCurrentBookmark = null;

        const visit = (node: any, parentNode: any) => {
          console.log('Visit', node, parent)
          if (node["id"] in visitedNodes) {
            return null;
          }
          let currentNode: any;
          if (node["label"] == "Root") {
            visitedNodes.push(node["id"]);
            mapping[node["id"]] = rootNodeId;
            provenance.goToNode(rootNodeId);
            currentNode = rootNodeId;
            const provenance_current_id = provenance.current.id
            const provenance_current = provenance.current
            updateBookmarkMap(currentNode, provenance.current, bookmark)
            
                graphMap[provenance_current_id] = {
                node: provenance_current,
                graph: makeDeepCopy(oldComp[node["id"]]),
              };

              compGraphs[rootNodeId] = makeDeepCopy(oldComp[node["id"]])
              localStorage.setItem('compGraphs', JSON.stringify(compGraphs, replacer))
        
            
            if (node["id"] == oldCurrent){
              console.log("Found old current")
              oldCurrentBookmark = bookmark
            }
          } else {
            provenance.goToNode(parentNode);
            provenance.apply(
              {
                apply: () =>
                  ({
                    state: node["state"] as IAppState,
                    label: node["label"],
                    stateSaveMode: "Complete",
                    actionType: "Regular",
                    eventType: "",
                    meta: {},
                  } as ActionReturnType<IAppState, string>),
              },
              node["label"]
            );
            currentNode = provenance.current.id
            mapping[node["id"]] = currentNode
            const oldBm = {...bookmark}
            
            oldBm['bookmark'] = oldBookmarks[node["id"]]['bookmark']
            console.log('oldBM', node["id"], oldBookmarks, oldBookmarks[node["id"]['bookmark']], oldBm)
            updateBookmarkMap(currentNode, provenance.current, oldBm)
            const provenance_current = provenance.current
           
              graphMap[currentNode] = {
                node: provenance_current,
                graph: makeDeepCopy(oldComp[node["id"]]),
              };
              compGraphs[currentNode] = makeDeepCopy(oldComp[node["id"]])
              localStorage.setItem('compGraphs', JSON.stringify(compGraphs, replacer))
           

            // graphMap[currentNode] = {
            //   node: provenance.current,
            //   graph: makeDeepCopy(getComponentGraph()),
            // };
            visitedNodes.push(node["id"])
            if (node["id"] == oldCurrent){
              console.log("Found old current")
              oldCurrentBookmark = oldBm
            }
          }

          for(let i = 0; i < node['children'].length; i++){
              const childId = node['children'][i]
              visit(graph['nodes'][childId], currentNode)
          }

        };
        console.log('Loaded graph')
        console.log(graph)
        console.log(typeof graph)
        console.log(graph["nodes"])
        console.log('Reading root', graph["root"])
        // console.log(graph['nodes'][graph['root']])
        visit(graph['nodes'][graph['root']], null)
        console.log("Old current bookmark", oldCurrentBookmark)
        applyBookmark(oldCurrentBookmark)
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', mapping[oldCurrent], oldCurrent)
        provenance.goToNode(mapping[oldCurrent])
        const res = () => {
          console.log("Not restoring anymore")
          restoring = false
        }
        new Promise(r => setTimeout(r, 3000)).then(res);
        
      } else {
        // build a tree from the root (as before)


        await new Promise(r => setTimeout(r, 3000))
        importedGraph = getComponentGraph();
        const currentNode = provenance.current;
        const rootNode = provenance.root;
        await updateGraph(provenance, currentNode.id)
        updateBookmarkMap(currentNode.id, currentNode, bookmark)
        graphMap[currentNode.id] = {
          node: currentNode,
          graph: makeDeepCopy(importedGraph),
        };
        compGraphs[currentNode.id] = makeDeepCopy(importedGraph)

        updateBookmarkMap(rootNode.id, currentNode, bookmark)
        graphMap[rootNode.id] = {
          node: currentNode,
          graph: makeDeepCopy(importedGraph),
        };
        compGraphs[rootNode.id] = makeDeepCopy(importedGraph)
        saveComponentGraph(importedGraph);
        localStorage.setItem('compGraphs', JSON.stringify(compGraphs, replacer))
      }
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
