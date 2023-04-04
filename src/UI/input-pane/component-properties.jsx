import { allVisuals } from "../../onboarding/ts/globalVariables";
import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";

export default function ComponentsProperties(className, visParentId) {
  if (!visParentId.includes("sub")) {
    createNode("dashboard", className + " Dashboard", "Dashboard", visParentId, "Dashboard");
  }
  for (const vis of allVisuals) {
    let visTitle = createNodeTitle(vis.type);
    let visClassName = className + " " + visTitle;
    const itemLength = checkDuplicateComponents(vis.type);
    if (itemLength > 1) {
      visTitle = visTitle + " (" + vis.title + ")";
    }

    let ids = [];
    let titles = [];
    let visName = "";

    ids.push(vis.name);
    titles.push(visTitle);
    visName = vis.name;

    if (visParentId.includes("sub")) {
      let result = getSubComponents(ids, titles, vis.type);
      ids = result?.ids;
      titles = result?.contents;
    }
    ids.forEach((id, idx) => {
      createNode(id, visClassName, titles[idx], visParentId, visTitle);
    });
  }
  if (!visParentId.includes("sub")) {
    createNode("globalFilter", className + " GlobalFilter", "Global Filter", visParentId, "GlobalFilter");
  }

  function createNode(id, visClassName, visTitle, visParentId, visName) {
    if (visParentId.includes("sub")) {
      console.log("Id: ", id);
    }
    const div = document.createElement("div");
    div.id = id;
    div.className = visClassName;
    div.innerHTML = visTitle;
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", function () {
      onDragStart(event, "simple", id, visTitle, visTitle, visName);
    });
    document.getElementById(visParentId)?.appendChild(div);
  }

  function getSubComponents(oldId, oldTitle, type) {
    let ids = [];
    let titles = [];
    switch (type) {
      case "card": case "multiRowCard":
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

  function checkDuplicateComponents(visType) {
    const componentItems = allVisuals.filter(function (visual) {
      return visual.type == visType;
    });
    return componentItems.length;
  }

  function createNodeTitle(title, index = "") {
    let newTitle = title;
    switch (title) {
      case "card": case "multiRowCard":
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

  function onDragStart(event, nodeType, nodeId, nodeData, title, classes) {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.setData("id", nodeId);
    event.dataTransfer.setData("data", nodeData);
    event.dataTransfer.setData("title", title);
    event.dataTransfer.setData("classes", classes);
    event.dataTransfer.effectAllowed = "move";
  }
}
