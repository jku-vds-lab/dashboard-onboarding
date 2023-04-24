import { useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";

function KeyValueAccordion({ data }) {
  debugger;
  const [activeKey, setActiveKey] = useState(null);

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );

    return (
      <button type="button" onClick={decoratedOnClick}>
        {children}
      </button>
    );
  }

  const handleClick = (key) => {
    if (activeKey === key) {
      setActiveKey(null);
    } else {
      setActiveKey(key);
    }
  };

  const renderAccordionItems = () => {
    return (
      <Card border="light" style={{ width: "10rem" }}>
        <Card.Header>
          <CustomToggle eventKey="0">{data.mainComponent}</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>hi</Card.Body>
          {/* {data.subComponents?.map((subComp, index) => (
            <Card.Body key={data.key}>{subComp}</Card.Body>
          ))} */}
        </Accordion.Collapse>
      </Card>
    );
  };

  return (
    <Accordion>
      <Accordion.Item eventKey="1">{renderAccordionItems()}</Accordion.Item>
    </Accordion>
  );
}

export default KeyValueAccordion;
