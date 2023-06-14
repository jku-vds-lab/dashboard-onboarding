import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import { basicTraversalStrategy, depthFirstTraversalStrategy, martiniGlassTraversalStrategy } from "../../onboarding/ts/traversalStrategies";
import { setProvenanceTraversalStrategy } from "../../Provenance/traversal_prov";
import * as global from "../../onboarding/ts/globalVariables";

export default function TraversalPane(props) {
  const [checked] = React.useState(true);

  function createCustomTrav(){
    const trav = global.settings.traversalStrategy;
    props.setTrav(trav);
    props.buildTraversal();
  }

  async function createMartiniGlassTrav(){
    const trav = await martiniGlassTraversalStrategy();
    props.setTrav(trav);
    props.buildTraversal();
  }

  async function createDepthFirstTrav(){
    const trav = await depthFirstTraversalStrategy();
    props.setTrav(trav);
    props.buildTraversal();
  }

  async function createProvenanceTrav(){
    const trav = await setProvenanceTraversalStrategy();
    props.setTrav(trav);
    props.buildTraversal();
  }

  return (
    <Accordion defaultActiveKey={["0"]}>
      <Accordion.Item eventKey="0">
        <Accordion.Button className="basic">Traversal strategies</Accordion.Button>
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
               <Form.Check
                type="radio"
                name="traversal"
                id="provenance"
                label="Provenance"
                className="check-button"
                onClick={createProvenanceTrav}
              />
            </div>
          </Form>
        </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  );
}
