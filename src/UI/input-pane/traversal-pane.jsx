import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";

export default function TraversalPane() {
  const [checked, setChecked] = React.useState(true);
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>Traversal strategies</Accordion.Header>
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
  );
}
