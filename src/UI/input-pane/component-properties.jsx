import { allVisuals } from "../../onboarding/ts/globalVariables";
import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";

export default function ComponentsProperties(className, parentId) {
  for (const vis of allVisuals) {
    // improve the logic here
    let visTitle = createNodeTitle(vis.type);
    let index = 0;
    const itemLength = checkDuplicateComponents(vis.type);
    if (itemLength > 1) {
      index = index + 1;
      visTitle = visTitle + index;
    }

    const div = document.createElement("div");
    div.id = vis.name;
    div.className = className + " " + visTitle;
    div.innerHTML = visTitle;
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", function () {
      onDragStart(event, "simple", vis.name, visTitle, visTitle);
    });
    document.getElementById(parentId)?.appendChild(div);
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
