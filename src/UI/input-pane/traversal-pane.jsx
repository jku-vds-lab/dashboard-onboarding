import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import { basicTraversalStrategy, depthFirstTraversalStrategy, martiniGlassTraversalStrategy } from "../../onboarding/ts/traversalStrategies";
import * as global from "../../onboarding/ts/globalVariables";

export default function TraversalPane() {
  const [checked] = React.useState(true);

  function createCustomTrav(){
    const trav = global.settings.traversalStrategy;
    console.log(trav);
  }

  async function createMartiniGlassTrav(){
    const trav = await martiniGlassTraversalStrategy();
    console.log(trav);
  }

  async function createDepthFirstTrav(){
    const trav = await depthFirstTraversalStrategy(); 
    console.log(trav);
  }

  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>Traversal strategies</Accordion.Header>
      <Accordion.Body>
        <Form>
          <div key={`default-checkbox`} className="mb-3">
            <Form.Check
                type="radio"
                name="traversal"
                id="custom"
                label="Custom"
                className="check-button"
                defaultChecked={checked}
                onClick={createCustomTrav}
            />
            <Form.Check
              type="radio"
              name="traversal"
              id="depth-first"
              label="Depth First"
              className="check-button"
              onClick={createDepthFirstTrav}
            />
            <Form.Check
              type="radio"
              name="traversal"
              id="martiniGlass"
              label="Martini Glass"
              className="check-button"
              onClick={createMartiniGlassTrav}
            />
          </div>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
}
