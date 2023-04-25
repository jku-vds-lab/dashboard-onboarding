import Components from "./component-properties";
import { Accordion } from "react-bootstrap";

import "../assets/css/dashboard.scss";
export default function ComponentPane() {
  return (
    <Accordion defaultActiveKey={["0"]} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Button className="basic">Components</Accordion.Button>
        <Accordion.Body>
          <Components />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
