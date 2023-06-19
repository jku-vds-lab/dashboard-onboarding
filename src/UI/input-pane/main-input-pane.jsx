import TraversalPane from "./traversal-pane";
import ComponentPane from "./component-pane";

import {
  ResizeContent,
  ResizeHandleRight,
  ResizePanel,
} from "react-hook-resize-panel";
import "../assets/css/dashboard.scss";

export default function InputPane(props) {
    //TODO: Move TraversalPane to the Main Layout to the toolbar

  return (
    <ResizePanel initialWidth={250} maxWidth={400} minWidth={250}>
      <ResizeContent class="component-cont">
        <TraversalPane  buildTraversal={() => props.buildTraversal()} setTrav={props.setTrav}/>
        <ComponentPane />
      </ResizeContent>
      <ResizeHandleRight className="resize">
        <div className="col-resize" />
      </ResizeHandleRight>
    </ResizePanel>
  );
}
