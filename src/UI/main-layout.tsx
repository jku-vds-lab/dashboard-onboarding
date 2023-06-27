import "./assets/css/dashboard.scss";
import InputPane from "./input-pane/main-input-pane";
import StoryPane from "./story-pane/main-story-pane";
import OutputPane from "./output-pane/main-output-pane";
import { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import TraversalPane from "./input-pane/traversal-pane";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import icon_1 from "./assets/img/icon-8.png";

export default function MainLayout() {
  const [trigger, setTrigger] = useState(0);
  const [traversal, setTrav] = useState("");

  const buildTraversal = () => {
    setTrigger((trigger) => trigger + 1);
  };

  return (
      <div style={{width: "100%", height: "100vh", position: "relative", overflow: "hidden"}}>
        <div  className="toolbar control-toolbar">
          <TraversalPane buildTraversal={buildTraversal} setTrav={setTrav} />
          <div>
            <OverlayTrigger trigger="hover" placement="right" overlay={
              <Tooltip >
                Record
              </Tooltip>
            }>
              <div className="btn btn-secondary btn-dark ms-2">
                <img className="icon options" style={{verticalAlign: "text-bottom"}}
                     src={icon_1}
                     width="18px"
                     height="18px" alt="Component icon" />
              </div>
            </OverlayTrigger>

            <div id="traversal"
                 className="btn btn-secondary btn-dark ms-2">
              Save Traversal
            </div>
          </div>
        </div>
    <div
      className="d-board"
      style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}
    >
      {" "}

      <InputPane/>
      <StoryPane mainTrigger={trigger} traversal={traversal}/>
      <OutputPane />
    </div>
      </div>
  );
}
