import { Position } from "reactflow";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import icon from "../icon-1.svg";

const GroupNode = ({ data }) => {
  function updateLabel(e) {
    e.target.closest(".dropdown").nextElementSibling.innerText =
      e.target.innerText;
  }
  function updateGroup(e) {}
  return (
    <div className={`node node-group`} onClick={updateGroup}>
      <div className={`header`}>
        <Dropdown>
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
        <div className="label">All</div>
      </div>
    </div>
  );
};

export default GroupNode;
