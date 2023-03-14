import { allVisuals } from "../../onboarding/ts/globalVariables";
import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";

export default function ComponentsProperties(className, parentId) {
  for (const vis of allVisuals) {
    let visTitle = createNodeTitle(vis.type);
    const itemLength = checkDuplicateComponents(vis.type);
    if (itemLength > 1) {
      visTitle = visTitle + " (" + vis.title + ")";
    }

    let ids = [];
    let contents = [];
    let visName = "";
    let visClassName = "";

    ids.push(vis.name);
    contents.push(visTitle);
    visClassName = className + " " + visTitle;
    visName = vis.name;
    debugger;

    if (parentId.includes("sub")) {
      debugger;
      let result = getSubComponents(ids, contents, vis.type);
      ids = result?.ids;
      contents = result?.contents;
    }
    ids.forEach((id, idx) => {
      createNode(id, visClassName, contents[idx], parentId, visName, visTitle);
    });
  }

  function createNode(id, visClassName, content, parentId, visName, visTitle) {
    const div = document.createElement("div");
    div.id = id;
    div.className = visClassName;
    div.innerHTML = content;
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", function () {
      onDragStart(event, "simple", visName, visTitle, visTitle);
    });
    document.getElementById(parentId)?.appendChild(div);
  }

  function getSubComponents(oldId, oldContent, type) {
    let ids = [];
    let contents = [];
    switch (type) {
      case "card":
        ids.push(oldId[0] + " Insight");
        contents.push(oldContent[0] + " Insight");
        break;
      case "slicer":
        ids.push(oldId[0] + " Interaction");
        contents.push(oldContent[0] + " Interaction");
        break;
      default:
        ids.push(oldId[0] + " Insight");
        contents.push(oldContent[0] + " Insight");
        ids.push(oldId[0] + " Interaction");
        contents.push(oldContent[0] + " Interaction");
    }
    return {
      ids: ids,
      contents: contents,
    };
  }

  function checkDuplicateComponents(visType) {
    const componentItems = allVisuals.filter(function (visual) {
      return visual.type == visType;
    });
    return componentItems.length;
  }

  function createNodeTitle(title, index = "") {
    let newTitle = title;
    switch (title) {
      case "card":
        newTitle = "KPI";
        break;
      case "slicer":
        newTitle = "Filter";
        break;
      case "lineClusteredColumnComboChart":
        newTitle = "Column";
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

  function onDragStart(event, nodeType, nodeId, nodeData, title) {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.setData("id", nodeId);
    event.dataTransfer.setData("data", nodeData);
    event.dataTransfer.setData("title", title);
    event.dataTransfer.effectAllowed = "move";
  }
}
