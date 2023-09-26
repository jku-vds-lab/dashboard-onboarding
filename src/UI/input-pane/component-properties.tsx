import { allVisuals, componentGraph } from "../../onboarding/ts/globalVariables";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { increment } from "../redux/nodeModalities";
import SaveAndFetchContent from "../../onboarding/ts/Content/saveAndFetchContent";

export interface InputNode {
  mainComponent: any;
  subComponents?: any[];
  key: string;
}

interface Props {
  visual: string;
}

export default function Components(props: Props) {
  const inputNodes: InputNode[] = [];
  const className = "dndnode";
  const visParentId = "componentNodes";
  let inputNode: InputNode;

  // redux starts
  const dispatch = useDispatch();
  // redux  ends
  const expertiseLevel = useSelector((state: RootState) => state.expertise);

  switch (props.visual) {
    case "dashboard":
      inputNode = {
        mainComponent: createNode(
          "dashboard",
          className + " Dashboard",
          "Dashboard",
          "General",
          visParentId,
          "Dashboard"
        ),
        key: "dashboard",
      };
      inputNodes.push(inputNode);
      break;
    case "globalFilters":
      if(componentGraph.dashboard.globalFilter.filters.length !== 0){
        inputNode = {
          mainComponent: createNode(
            "globalFilter",
            className + " GlobalFilter",
            "Global Filters",
            "General",
            visParentId,
            "GlobalFilter"
          ),
          key: "globalFilter",
        };
        inputNodes.push(inputNode);
  
        inputNode = {
          mainComponent: createNode(
            "globalFilter Interaction",
            className + " GlobalFilter",
            "Global Filters Interaction",
            "Interaction",
            visParentId,
            "GlobalFilter"
          ),
          key: "globalFilter",
        };
        inputNodes.push(inputNode);
      }
      break;
    default:
      const vis = allVisuals.find((vis) => vis.name === props.visual);

      if (!vis) {
        return;
      }

      let visTitle = createNodeTitle(vis.type);
      const visClassName = className + " " + visTitle;
      const mainId = vis.name;

      const itemLength = checkDuplicateComponents(vis.type);
      if (itemLength > 1) {
        visTitle = visTitle + " (" + vis.title + ")";
      }

      inputNode = {
        mainComponent: createNode(
          mainId,
          visClassName,
          visTitle,
          "General",
          visParentId,
          visTitle
        ),
        key: mainId,
      };
      inputNodes.push(inputNode);

      const result = getSubComponents(mainId, visTitle, vis.type);
      const subIds = result?.ids;
      const subtitles = result?.contents;
      const displayTitles = result?.displayTitles;

      subIds.forEach((id, idx) => {
        inputNode = {
          mainComponent: createNode(
            id,
            visClassName,
            subtitles[idx],
            displayTitles[idx],
            visParentId,
            subtitles[idx]
          ),
          key: mainId,
        };
        inputNodes.push(inputNode);
      });
  }

  function getSubComponents(oldId: string, oldTitle: string, type: string) {
    const ids = [];
    const titles = [];
    const displayTitles = [];
    switch (type) {
      case "card":
      case "multiRowCard":
        break;
      case "slicer":
        ids.push(oldId + " Interaction");
        titles.push(oldTitle + " Interaction");
        displayTitles.push("Interaction");
        break;
      default:
        ids.push(oldId + " Insight");
        titles.push(oldTitle + " Insight");
        displayTitles.push("Insight");
        ids.push(oldId + " Interaction");
        titles.push(oldTitle + " Interaction");
        displayTitles.push("Interaction");
    }
    return {
      ids: ids,
      contents: titles,
      displayTitles: displayTitles,
    };
  }

  function checkDuplicateComponents(visType: string) {
    const componentItems = allVisuals.filter(function (visual) {
      return visual.type == visType;
    });
    return componentItems.length;
  }

  function createNodeTitle(title: string, index = "") {
    let newTitle = title;
    switch (title) {
      case "card":
        newTitle = "KPI";
        break;
      case "slicer":
        newTitle = "Filter";
        break;
      case "lineClusteredColumnComboChart":
        newTitle = "Combo Chart";
        break;
      case "clusteredBarChart":
        newTitle = "Bar Chart";
        break;
      case "clusteredColumnChart":
        newTitle = "Column Chart";
        break;
      case "lineChart":
        newTitle = "Line Chart";
        break;
      case "pivotTable":
        newTitle = "Matrix";
        break;
      case "tableEx":
        newTitle = "Table";
        break;
      default:
        newTitle = title;
    }
    newTitle = newTitle + index;
    return newTitle;
  }

  function onDragStart(
    event: any,
    nodeType: string,
    nodeId: string,
    visType: string,
    title: string
  ) {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.setData("id", nodeId);
    event.dataTransfer.setData("visType", visType); // data is the title and the type of the node for the story editor
    event.dataTransfer.setData("title", title);
    event.dataTransfer.effectAllowed = "move";
  }

  async function onClick(
    event: any,
    nodeType: string,
    nodeId: string,
    visClassName: string,
    visTitle: string,
    visDisplayTitle: string,
    visParentId: string,
    visType: string
  ) {
    try {
      let nodeFullName: string[] = [];
      if (nodeId) {
        nodeFullName = nodeId.split(" ");
      }
      nodeFullName.push("1");

      if (visType) {
        const splitVisType = visType.split(" ")[0];
        if (splitVisType.length > 0) {
          nodeFullName.push(splitVisType);
        }
      }
      const visInfo = new SaveAndFetchContent(nodeFullName);
      await visInfo.getVisualDescInEditor(expertiseLevel);
    } catch (error) {
      console.log("Error on click at comonents", error);
    }
  }

  function createNode(
    id: string,
    visClassName: string,
    visTitle: string,
    visDisplayTitle: string,
    visParentId: string,
    visType: string
  ) {
    const myDiv = (
      <div
        id={id + className}
        className={visClassName}
        onDragStart={(event) =>
          onDragStart(event, "default", id, visType, visTitle)
        }
        draggable
        onClick={(event) =>
          onClick(
            event,
            "default",
            id,
            visClassName,
            visTitle,
            visDisplayTitle,
            visParentId,
            visType
          )
        }
      >
        {visDisplayTitle}
      </div>
    );

    return myDiv;
  }

  return (
    <div>
      {inputNodes.map((node) => (
        <div key={node.mainComponent.id} className="individual-item">
          {node.mainComponent}
        </div>
      ))}
    </div>
  );
}
