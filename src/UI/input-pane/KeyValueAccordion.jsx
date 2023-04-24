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
    return data?.map((d, index) => (
      <Accordion.Body key={index}>{d}</Accordion.Body>
    ));
  };

  return renderAccordionItems();
}

export default KeyValueAccordion;
