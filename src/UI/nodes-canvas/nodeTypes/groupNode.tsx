import Dropdown from "react-bootstrap/Dropdown";
// import { ReactFlow, useNodeId, useNodesState } from "reactflow";
import icon from "../icon-1.svg";
import { Node } from "reactflow";
export interface IGroupNodeElements extends Node {
  nodes: Node[];
  id: string;
}
export default class GroupNode {
  private groupNode: IGroupNodeElements;

  constructor(gNode: IGroupNodeElements) {
    this.groupNode = gNode;
  }

  getGroupNode() {
    let minX = 10000;
    let minY = 10000;
    let maxX = 0;
    let maxY = 0;
    let nodeWidth = 0;
    let nodeHeight = 0;
    this.groupNode.nodes.forEach((node: Node) => {
      if (node.position.x < minX) {
        minX = node.position.x;
      }
      if (node.position.x > maxX) {
        maxX = node.position.x;
      }
      if (node.position.y < minY) {
        minY = node.position.y;
      }
      if (node.position.y > maxY) {
        maxY = node.position.y;
      }
      nodeWidth = node.width as number;
      nodeHeight = node.height as number;
    });
    let width = 0;
    let height = 0;
    const offset = 40;
    const minHeight = 70 + nodeHeight;
    const minWidth = nodeWidth + offset;

    width = maxX - minX + minWidth;
    height = maxY - minY + minHeight;
    if (height < 0) {
      height = -height;
    }

    const position = { x: minX - offset, y: minY - offset };

    this.groupNode = {
      ...this.groupNode,
      type: "group",
      position,
      data: {
        title: "group node",
        // callback: getLabelInfo,
        type: "group",
        traverse: "All", //getLabelInfo();
      },
      className: "dndnode node-group",
      style: { width: width, height: height },
      zIndex: -1,
    };

    return this.groupNode;
  }

  static updateLabel(event: any) {
    event.target.closest(".dropdown").nextElementSibling.innerText =
      event.target.innerText;

    // node.data.callback(event.target.innerText, nodeId);
  }

  static updateGroup() {}

  static groupNodeType() {
    return (
      <div className={`node node-group`} onClick={GroupNode.updateGroup}>
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
              <Dropdown.Item eventKey="1" onClick={GroupNode.updateLabel}>
                At least one
              </Dropdown.Item>
              <Dropdown.Item eventKey="2" onClick={GroupNode.updateLabel}>
                Only one
              </Dropdown.Item>
              <Dropdown.Item eventKey="3" onClick={GroupNode.updateLabel}>
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="label">All</div>
        </div>
      </div>
    );
  }
}

// return (
//   <div className={`node node-group`} onClick={this.updateGroup}>
//     <div className={`header`}>
//       <Dropdown>
//         <Dropdown.Toggle variant="" className="n-button options">
//           <img
//             className="icon options"
//             src={icon}
//             alt="connect icon"
//             width="10px"
//             height="10px"
//           />
//         </Dropdown.Toggle>

//         <Dropdown.Menu>
//           <Dropdown.Item eventKey="1" onClick={this.updateLabel}>
//             At least one
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="2" onClick={this.updateLabel}>
//             Only one
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="3" onClick={this.updateLabel}>
//             All
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//       <div className="label">All</div>
//     </div>
//   </div>
// );
