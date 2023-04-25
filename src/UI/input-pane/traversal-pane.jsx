import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";

export default function TraversalPane() {
  const [checked, setChecked] = React.useState(true);
  return (
    <Accordion defaultActiveKey={["0"]} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Button className="basic">
          Traversal strategies
        </Accordion.Button>
        <Accordion.Body>
          <Form>
            <div key={`default-checkbox`} className="mb-3">
              <Form.Check
                type="radio"
                name="traversal"
                id="depth-first"
                label="Depth first"
                className="check-button"
                defaultChecked={checked}
                onChange={() => setChecked(!checked)}
              />
              <Form.Check
                type="radio"
                name="traversal"
                id="custom"
                label="Custom"
                className="check-button"
              />
            </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
