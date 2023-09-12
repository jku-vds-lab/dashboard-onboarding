import { allVisuals } from "../../onboarding/ts/globalVariables";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";

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
      inputNode = {
        mainComponent: createNode(
          "globalFilter",
          className + " GlobalFilter",
          "GlobalFilters",
          "General",
          visParentId,
          "GlobalFilter"
        ),
        key: "globalFilter",
      };
      inputNodes.push(inputNode);

      inputNode = {
        mainComponent: createNode(
          "globalFilter",
          className + " GlobalFilter",
          "GlobalFilters",
          "Interaction",
          visParentId,
          "GlobalFilter"
        ),
        key: "globalFilter",
      };
      inputNodes.push(inputNode);
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
        ids.push(oldId + " Insight");
        titles.push(oldTitle + " Insight");
        displayTitles.push("Insight");
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
        newTitle = "Column Chart";
        break;
      case "clusteredBarChart":
        newTitle = "Bar Chart";
        break;
      case "lineChart":
        newTitle = "Line Chart";
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
      >
        {visDisplayTitle}
      </div>
    );

    return myDiv;
  }

  return (
    <div>
      {inputNodes.map((node) => (
        <div key={node.mainComponent.id}>{node.mainComponent}</div>
      ))}
    </div>
  );
}
