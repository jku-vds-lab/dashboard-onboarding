import ComponentPane from "./component-pane";

import {
  ResizeContent,
  ResizeHandleRight,
  ResizePanel,
} from "react-hook-resize-panel";
import "../assets/css/dashboard.scss";

export default function InputPane() {
  //TODO: Move TraversalPane to the Main Layout to the toolbar

  return (
    <ResizePanel initialWidth={400} maxWidth={500} minWidth={250}>
      <ResizeContent class="component-cont">
        <ComponentPane />
      </ResizeContent>
      <ResizeHandleRight className="resize">
        <div className="col-resize" />
      </ResizeHandleRight>
    </ResizePanel>
  );
}
