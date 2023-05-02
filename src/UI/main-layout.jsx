import "./assets/css/dashboard.scss";
import InputPane from "./input-pane/main-input-pane";
import StoryPane from "./story-pane/main-story-pane";
import OutputPane from "./output-pane/main-output-pane";
import { useState } from 'react';

export default function MainLayout() {
  const [trigger, setTrigger] = useState(0);
  const [traversal, setTrav] = useState("");

  const buildTraversal = () => {
    setTrigger((trigger) => trigger + 1);
  }

  return (
    <div
      className="d-board"
      style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}
    >
      {" "}
      <InputPane buildTraversal= {buildTraversal} setTrav={setTrav}/>
      <StoryPane mainTrigger={trigger} traversal={traversal}/>
      <OutputPane />
    </div>
  );
}
