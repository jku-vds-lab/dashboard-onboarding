import Dropdown from "react-bootstrap/Dropdown";
import icon from "../icon-1.svg";
import icon1 from "./../../assets/img/arrow-down.png";
export default function GroupNodeType(nodeData: any) {
  function updateLabel(event: any) {
    const label = event.target.innerText;
    event.target.closest(".dropdown").nextElementSibling.innerText = label;

    nodeData.data.traverse = label;
  }
  function updateGroup() {}

  return (
    <div className={`node node-group`} onClick={updateGroup}>
      <div className={`header`}>
        <Dropdown>
          <Dropdown.Toggle variant="" className="n-button options">
            <img
              className="icon options"
              src={icon1}
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
        <div className="label">{nodeData.data.traverse}</div>
      </div>
    </div>
  );
}
