import { allVisuals } from "../../onboarding/ts/globalVariables";
import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";

export interface InputNode {
  mainComponent: any;
  subComponents?: any[];
  key: string;
}

export default function ComponentsProperties() {
  const inputNodes: InputNode[] = [];
  const className = "dndnode";
  const visParentId = "componentNodes";

  let inputNode: InputNode = {
    mainComponent: createNode(
      "dashboard",
      className + " Dashboard",
      "Dashboard",
      visParentId,
      "Dashboard"
    ),
    key: "dashboard",
  };
  inputNodes.push(inputNode);

  inputNode = {
    mainComponent: createNode(
      "globalFilter",
      className + " GlobalFilter",
      "Global Filters",
      visParentId,
      "GlobalFilter"
    ),
    key: "globalFilter",
  };
  inputNodes.push(inputNode);

  for (const vis of allVisuals) {
    let visTitle = createNodeTitle(vis.type);
    const visClassName = className + " " + visTitle;
    const itemLength = checkDuplicateComponents(vis.type);
    if (itemLength > 1) {
      visTitle = visTitle + " (" + vis.title + ")";
    }

    const mainId = vis.name;
    const title = visTitle;

    const result = getSubComponents(mainId, title, vis.type);
    const subIds = result?.ids;
    const subtitles = result?.contents;

    inputNode = {
      mainComponent: createNode(
        mainId,
        visClassName,
        visTitle,
        visParentId,
        visTitle
      ),
      subComponents: [],
      key: mainId,
    };

    subIds.forEach((id, idx) => {
      inputNode.subComponents?.push(
        createNode(id, visClassName, subtitles[idx], mainId, subtitles[idx])
      );
    });
    inputNodes.push(inputNode);
  }

  function getSubComponents(oldId: string, oldTitle: string, type: string) {
    const ids = [];
    const titles = [];
    switch (type) {
      case "card":
        ids.push(oldId + " Insight");
        titles.push(oldTitle + " Insight");
        break;
      case "slicer":
        ids.push(oldId + " Interaction");
        titles.push(oldTitle + " Interaction");
        break;
      default:
        ids.push(oldId + " Insight");
        titles.push(oldTitle + " Insight");
        ids.push(oldId + " Interaction");
        titles.push(oldTitle + " Interaction");
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
    debugger;
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
    const myDiv = (
      <div id={id} className={visClassName} draggable>
        {visTitle}
      </div>
    );

    const dragDiv = document.getElementById(id);
    dragDiv?.addEventListener("dragstart", function () {
      onDragStart(event, "simple", id, visType, visTitle);
    });

    return myDiv;
  }

  return inputNodes.map((iNode) => {
    return (
      <Accordion key={iNode.key}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{iNode.mainComponent}</Accordion.Header>
          {iNode.subComponents?.map((d, index) => (
            <Accordion.Body key={index}>{d}</Accordion.Body>
          ))}
        </Accordion.Item>
      </Accordion>
    );
  });
}
