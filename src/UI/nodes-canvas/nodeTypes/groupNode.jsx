import Dropdown from "react-bootstrap/Dropdown";
import { useNodeId } from "reactflow";
import icon from "../icon-1.svg";

export default function GroupNode(groupData) {
  const nodeId = useNodeId();

  function updateLabel(event) {
    console.log(groupData);
    event.target.closest(".dropdown").nextElementSibling.innerText =
      event.target.innerText;

    groupData.data.callback(event.target.innerText, groupData.id);
  }
  function updateGroup(e) {
    try {
      console.log("Group update is called");
    } catch (error) {
      console.log(error);
    }
  }
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
}