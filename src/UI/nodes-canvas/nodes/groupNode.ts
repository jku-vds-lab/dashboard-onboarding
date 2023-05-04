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
        type: "group",
        traverse: "All",
      },
      className: "dndnode node-group",
      style: { width: width, height: height },
      zIndex: -1,
    };

    return this.groupNode;
  }
}
