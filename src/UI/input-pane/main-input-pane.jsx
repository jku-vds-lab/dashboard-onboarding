import Accordion from "react-bootstrap/Accordion";
import TraversalPane from "./traversal-pane";
import Components from "./component-properties";

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
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <TraversalPane />
          <Accordion.Item eventKey="0">
            <Accordion.Header>Components</Accordion.Header>
            <Accordion.Body>
              <Components />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </ResizeContent>
      <ResizeHandleRight className="resize">
        <div className="col-resize" />
      </ResizeHandleRight>
    </ResizePanel>
  );
}
