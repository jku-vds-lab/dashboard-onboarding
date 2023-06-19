import "./assets/css/dashboard.scss";
import InputPane from "./input-pane/main-input-pane";
import StoryPane from "./story-pane/main-story-pane";
import OutputPane from "./output-pane/main-output-pane";
import { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';

export default function MainLayout() {
  const [trigger, setTrigger] = useState(0);
  const [traversal, setTrav] = useState("");

  const buildTraversal = () => {
    setTrigger((trigger) => trigger + 1);
  };

  return (
      <div style={{width: "100%", height: "100vh", position: "relative", overflow: "hidden"}}>
        <div className="toolbar control-toolbar">
          <Dropdown className="custom-dropdown">
            <Dropdown.Toggle>
              Traversal Strategies
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">
                Custom
              </Dropdown.Item>
              <Dropdown.Item href="#">
                Depth First
              </Dropdown.Item>
              <Dropdown.Item href="#">
                Martini Glass
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
    <div
      className="d-board"
      style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}
    >
      {" "}

      <InputPane buildTraversal={buildTraversal} setTrav={setTrav} />
      <StoryPane mainTrigger={trigger} traversal={traversal}/>
      <OutputPane />
    </div>
      </div>
  );
}
