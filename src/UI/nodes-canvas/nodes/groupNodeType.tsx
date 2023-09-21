import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
// import icon from "../icon-1.svg";
// import icon1 from "./../../assets/img/arrow-down.png";
import icon from "../../assets/img/icon-12.svg";
export default function GroupNodeType(nodeData: any) {
  const [label, setLabel] = useState(nodeData.data.traverse);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function updateLabel(event: any) {
    const newLabel = event.target.innerText;
    setLabel(newLabel);
    nodeData.data.traverse = newLabel;
  }

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }
  function updateGroup() {}

  return (
    <div className={`node node-group`} onClick={toggleDropdown}>
      <div className={`header`}>
        <div className="header-label">Traversal: {nodeData.data.traverse}</div>
        <Dropdown show={isDropdownOpen}>
          <Dropdown.Toggle variant="" className="n-button options">
            <img
              className="icon options"
              src={icon}
              alt="connect icon"
              width="10px"
              height="10px"
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="1" onClick={updateLabel}>
              At least one
            </Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={updateLabel}>
              Only one
            </Dropdown.Item>
            <Dropdown.Item eventKey="3" onClick={updateLabel}>
              All
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/* <div className="label">{nodeData.data.traverse}</div> */}
      </div>
    </div>
  );
}
