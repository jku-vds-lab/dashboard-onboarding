import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import {
  basicTraversalStrategy,
  depthFirstTraversalStrategy,
  martiniGlassTraversalStrategy,
  similarVisTraversalStrategy,
} from "../../onboarding/ts/traversalStrategies";
import * as global from "../../onboarding/ts/globalVariables";
import Dropdown from "react-bootstrap/Dropdown";

export default function TraversalPane(props: any) {
  const [checked] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState("");

  function createCustomTrav(option: string) {
    setSelectedOption(option);
    const trav = global.settings.traversalStrategy;
    props.setTrav(trav);
    props.buildTraversal();
  }

  async function createMartiniGlassTrav(option: string) {
    setSelectedOption(option);
    const trav = martiniGlassTraversalStrategy();
    props.setTrav(trav);
    props.buildTraversal();
  }

  async function createDepthFirstTrav(option: string) {
    setSelectedOption(option);

    const trav = depthFirstTraversalStrategy();
    props.setTrav(trav);
    props.buildTraversal();
  }
  async function createSimilarVisStrategy(option: string) {
    setSelectedOption(option);

    const trav = await similarVisTraversalStrategy();
    props.setTrav(trav);
    props.buildTraversal();
  }

  // async function createProvenanceTrav() {
  //   const trav = await setProvenanceTraversalStrategy();
  //   props.setTrav(trav);
  //   props.buildTraversal();
  // }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginLeft: "10px", marginRight: "10px" }}>
        Choose a story{" "}
      </span>

      <Dropdown className="custom-dropdown">
        <Dropdown.Toggle>
          {selectedOption ? selectedOption : "Pick a story..."}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            selected
            id="custom"
            className="check-button"
            onClick={() => createCustomTrav("Custom")}
          >
            Custom
          </Dropdown.Item>
          <Dropdown.Item
            id="depth-first"
            onClick={() => createDepthFirstTrav("Depth First")}
          >
            Depth First
          </Dropdown.Item>
          <Dropdown.Item
            id="depth-first"
            onClick={() => createSimilarVisStrategy("Similar Vis")}
          >
            Similar Vis
          </Dropdown.Item>
          <Dropdown.Item
            id="martiniGlass"
            onClick={() => createMartiniGlassTrav("Martini Glass")}
          >
            Martini Glass
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
