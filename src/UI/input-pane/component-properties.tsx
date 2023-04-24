import { allVisuals } from "../../onboarding/ts/globalVariables";
import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";

//visParentId: components, subcomponents
// classname: dndnode
export interface InputNode {
  mainNode: any;
  subNodes?: any[];
}

export default function ComponentsProperties() {
  const inputNodes: InputNode[] = [];
  const className = "dndnode";
  const visParentId = "componentNodes";

  let inputNode: InputNode = {
    mainNode: createNode(
      "dashboard",
      className + " Dashboard",
      "Dashboard",
      visParentId,
      "Dashboard"
    ),
  };
  inputNodes.push(inputNode);

  for (const vis of allVisuals) {
    let visTitle = createNodeTitle(vis.type);
    const visClassName = className + " " + visTitle;
    const itemLength = checkDuplicateComponents(vis.type);
    if (itemLength > 1) {
      visTitle = visTitle + " (" + vis.title + ")";
    }

    let visName = "";

    const mainId = vis.name;
    const title = visTitle;
    visName = vis.name;

    const result = getSubComponents(mainId, title, vis.type);
    const subIds = result?.ids;
    const subtitles = result?.contents;

    inputNode = {
      mainNode: createNode(
        mainId,
        visClassName,
        visTitle,
        visParentId,
        visTitle
      ),
      subNodes: [],
    };

    subIds.forEach((id, idx) => {
      inputNode.subNodes?.push(
        createNode(id, visClassName, subtitles[idx], mainId, subtitles[idx])
      );
    });
    inputNodes.push(inputNode);
  }

  // if (!visParentId.includes("sub")) {
  //   createNode("globalFilter", className + " GlobalFilter", "Global Filters", visParentId, "GlobalFilter");
  // }

  function getSubComponents(oldId: string, oldTitle: string, type: string) {
    const ids = [];
    const titles = [];
    switch (type) {
      case "card":
        ids.push(oldId[0] + " Insight");
        titles.push(oldTitle[0] + " Insight");
        break;
      case "slicer":
        ids.push(oldId[0] + " Interaction");
        titles.push(oldTitle[0] + " Interaction");
        break;
      default:
        ids.push(oldId[0] + " Insight");
        titles.push(oldTitle[0] + " Insight");
        ids.push(oldId[0] + " Interaction");
        titles.push(oldTitle[0] + " Interaction");
    }
    return {
      ids: ids,
      contents: titles,
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
    visParentId: string,
    visType: string
  ) {
    // const div = document.createElement("div");
    // div.id = id;
    // div.className = visClassName;
    // div.innerHTML = visTitle;
    // div.setAttribute("draggable", "true");
    // div.addEventListener("dragstart", function () {
    //   onDragStart(event, "simple", id, visType, visTitle);
    // });
    // document.getElementById(visParentId)?.appendChild(div);

    const myDiv = (
      <div id={id} className={visClassName} draggable>
        {visTitle}
      </div>
    );
    return myDiv;
  }

  console.log("Input nodes", inputNode);

  const myelement = (
    <table>
      <tr>
        <th>Name</th>
      </tr>
      <tr>
        <td>John</td>
      </tr>
      <tr>
        <td>Elsa</td>
      </tr>
    </table>
  );
  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>{inputNode.mainNode}</Accordion.Header>
      {inputNode.subNodes?.map((sNode) => (
        <Accordion.Body key={sNode.id}>{sNode}</Accordion.Body>
      ))}
    </Accordion.Item>
  );
}
