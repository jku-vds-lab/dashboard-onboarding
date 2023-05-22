import "./assets/css/dashboard.scss";
import InputPane from "./input-pane/main-input-pane";
import StoryPane from "./story-pane/main-story-pane";
import OutputPane from "./output-pane/main-output-pane";
import { RecordView } from "./output-pane/main-record";

export default function MainLayout() {
  return (
    <div
      className="d-board"
      style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}
    >
      {" "}
      <InputPane />
      <StoryPane />
      <OutputPane />
      <RecordView />
    </div>
  );
}
