import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";
import ComponentsProperties from "./component-properties";

export default function ComponentsPane() {
  useEffect(() => {
    ComponentsProperties("dndnode", "componentNodes");
  }, []);

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
