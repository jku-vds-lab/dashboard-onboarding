import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";
import { allVisuals } from "../../onboarding/ts/globalVariables";

export default function SubcomponentsPane() {
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
      switch (vis.type) {
        case "card":
          createComponentNode({
            id: vis.name + " insight",
            classes: `dndnode`,
            content: `${visTitle} insight`,
            function: "",
            parentId: "subcomponentNodes",
          });
          break;
        case "slicer":
          createComponentNode({
            id: vis.name + " interaction",
            classes: `dndnode`,
            content: `${visTitle} interaction`,
            function: "",
            parentId: "subcomponentNodes",
          });
          break;
        default:
          createComponentNode({
            id: vis.name + " interaction",
            classes: `dndnode`,
            content: `${visTitle} interaction`,
            function: "",
            parentId: "subcomponentNodes",
          });
          createComponentNode({
            id: vis.name + " insight",
            classes: `dndnode`,
            content: `${visTitle} insight`,
            function: "",
            parentId: "subcomponentNodes",
          });
      }
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
    <Accordion.Item eventKey="2">
      <Accordion.Header>Subcomponents</Accordion.Header>
      <Accordion.Body>
        <aside id="subcomponentNodes">
          <div className="description">
            You can drag these nodes to the pane on the right.
          </div>
        </aside>
      </Accordion.Body>
    </Accordion.Item>
  );
}
