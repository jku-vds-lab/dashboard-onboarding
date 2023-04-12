import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/dashboard.scss";
import ComponentsProperties from "./component-properties";

export default function SubcomponentsPane() {
  useEffect(() => {
    ComponentsProperties("dndnode", "subcomponentNodes");
  }, []);

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
