import "./assets/css/dashboard.scss";
import { setDivisor } from "../onboarding/ts/sizes";
import InputPane from "./input-pane/main-input-pane";
import StoryPane from "./story-pane/main-story-pane";
import OutputPane from "./output-pane/main-output-pane";

export default function MainLayout() {
  setDivisor(3);

  return (
    <div
      className="d-board"
      style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}
    >
      {" "}
      <InputPane />
      <StoryPane />
      <OutputPane />
    </div>
  );
}
