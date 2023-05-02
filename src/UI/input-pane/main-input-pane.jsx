import Accordion from "react-bootstrap/Accordion";
import TraversalPane from "./traversal-pane";
import ComponentsPane from "./components-pane";
import SubcomponentsPane from "./subcomponents-pane";
import {
  ResizeContent,
  ResizeHandleRight,
  ResizePanel,
} from "react-hook-resize-panel";
import "../assets/css/dashboard.scss";

export default function InputPane(props) {

  return (
    <ResizePanel
      className="component-cont"
      initialWidth={250}
      maxWidth={400}
      minWidth={250}
    >
      <ResizeContent>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <TraversalPane buildTraversal={() => props.buildTraversal()} setTrav={props.setTrav}/>
          <ComponentsPane />
          <SubcomponentsPane />
        </Accordion>
      </ResizeContent>
      <ResizeHandleRight className="resize">
        <div className="col-resize" />
      </ResizeHandleRight>
    </ResizePanel>
  );
}
