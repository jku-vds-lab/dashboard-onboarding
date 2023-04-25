import TraversalPane from "./traversal-pane";
import ComponentPane from "./component-pane";

import {
  ResizeContent,
  ResizeHandleRight,
  ResizePanel,
} from "react-hook-resize-panel";
import "../assets/css/dashboard.scss";

export default function InputPane() {
  return (
    <ResizePanel
      className="component-cont"
      initialWidth={250}
      maxWidth={400}
      minWidth={250}
    >
      <ResizeContent>
        <TraversalPane />
        <ComponentPane />
      </ResizeContent>
      <ResizeHandleRight className="resize">
        <div className="col-resize" />
      </ResizeHandleRight>
    </ResizePanel>
  );
}
