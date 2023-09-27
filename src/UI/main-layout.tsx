import "./assets/css/dashboard.scss";
import InputPane from "./input-pane/main-input-pane";
import StoryPane from "./story-pane/main-story-pane";
import OutputPane from "./output-pane/main-output-pane";
import { useState } from "react";
import TraversalPane from "./input-pane/traversal-pane";
import { Link } from "react-router-dom";
import Traversal from "./nodes-canvas/traversal";

export default function MainLayout() {
  const [trigger, setTrigger] = useState(0);
  const [traversal, setTrav] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const buildTraversal = () => {
    setTrigger((trigger) => trigger + 1);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="toolbar control-toolbar">
        <TraversalPane buildTraversal={buildTraversal} setTrav={setTrav} />
        <div>
          <Traversal nodes={nodes} edges={edges} />
          <Link to="/">
            <div className="btn btn-secondary btn-dark ms-2">
              Publish Onboarding
            </div>
          </Link>
        </div>
      </div>
      <div
        className="d-board"
        style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}
      >
        {" "}
        <InputPane />
        <StoryPane
          mainTrigger={trigger}
          traversal={traversal}
          setNodes={setNodes}
          setEdges={setEdges}
        />
        <OutputPane />
      </div>
    </div>
  );
}
