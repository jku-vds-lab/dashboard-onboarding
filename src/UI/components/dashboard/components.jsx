import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FaPencilAlt } from "react-icons/fa";
import ReactFlow, { ReactFlowProvider } from "reactflow";
import TraversalStrategies from "./traversal-strategies";
import Components from "./components";
import {
  ResizeContent,
  ResizeHandleLeft,
  ResizeHandleRight,
  ResizePanel,
} from "react-hook-resize-panel";
import Onboarding from "../../../pages/onboarding";

import NodesCanvas from "../nodesCanvas/canvas-index";

import "../../assets/css/dashboard.scss";
import { setDivisor } from "../../../onboarding/ts/sizes";
import { allVisuals } from "../../../onboarding/ts/globalVariables";

export default function Componentss() {
  useEffect(() => {
    const cardElements = allVisuals.filter(function (visual) {
      return visual.type == "card";
    });
    const cardElementsLength = cardElements.length;
    let index = 0;
    for (const vis of allVisuals) {
      let visTitle = createNodeTitle(vis.type);
      if (vis.type == "card") {
        if (cardElementsLength > 1) {
          index = index + 1;
          visTitle = visTitle + index;
        }
      }

      createComponentNode({
        id: vis.name,
        classes: `dndnode`,
        content: `${visTitle}`,
        parentId: "componentNodes",
      });
    }
  }, []);

  function createComponentNode(attributes) {
    const div = document.createElement("div");
    div.id = attributes.id;
    div.className = attributes.classes + " " + attributes.content;
    div.innerHTML = attributes.content;
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", function () {
      onDragStart(
        event,
        "simple",
        attributes.id,
        attributes.content,
        attributes.content
      );
    });

    document.getElementById(attributes.parentId)?.appendChild(div);
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
        newTitle = "Bar";
        break;
      case "lineChart":
        newTitle = "Line";
        break;
      default:
        newTitle = title;
    }
    newTitle = newTitle + index;
    return newTitle;
  }

  const onDragStart = (event, nodeType, nodeId, nodeData, title) => {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.setData("id", nodeId);
    event.dataTransfer.setData("data", nodeData);
    event.dataTransfer.setData("title", title);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>Components</Accordion.Header>
      <Accordion.Body>
        <aside id="componentNodes">
          <div className="description">
            You can drag these nodes to the pane on the right.
          </div>
          <div
            className="dndnode node-group"
            onDragStart={(event) => onDragStart(event, "group", "group")}
            draggable
          >
            Group
          </div>
        </aside>
      </Accordion.Body>
    </Accordion.Item>
  );
}
