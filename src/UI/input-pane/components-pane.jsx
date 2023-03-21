import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";
import ComponentsProperties from "./component-properties";

export default function ComponentsPane() {
  useEffect(() => {
    ComponentsProperties("dndnode", "componentNodes");
  }, []);

  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>Components</Accordion.Header>
      <Accordion.Body>
        <aside id="componentNodes">
          <div className="description">
            You can drag these nodes to the pane on the right.
          </div>
        </aside>
      </Accordion.Body>
    </Accordion.Item>
  );
}
