import { Node } from "reactflow";
export interface IGroupNode extends Node {
  nodes: Node[];
  id: string;
}
export default class GroupNode {
  private groupNode: IGroupNode;

  constructor(gNode: IGroupNode) {
    this.groupNode = gNode;
  }

  getGroupNode(setPos: boolean, position: any, groupType: any) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let nodeWidth = 0;
    let nodeHeight = 0;
    this.groupNode.nodes.forEach((node: Node) => {
      if (node.position.x < minX) {
        minX = node.position.x;
      }
      if (node.position.y < minY) {
        minY = node.position.y;
      }
      if (node.position.x > maxX) {
        maxX = node.position.x;
      }
      if (node.position.y > maxY) {
        maxY = node.position.y;
      }
    });

    nodeWidth = parseInt(String(this.groupNode.nodes[0].style?.width!), 10);
    nodeHeight = parseInt(String(this.groupNode.nodes[0].style?.height!), 10);
    let width = 0;
    let height = 0;
    const xOffset = 20;
    const yOffsetTop = 40;
    const yOffsetBottom = 10;
    const minHeight = yOffsetTop + yOffsetBottom + nodeHeight;
    const minWidth = nodeWidth + xOffset;

    width = maxX - minX + minWidth;
    height = maxY - minY + minHeight;
    // if (height < 0) {
    //   height = -height;
    // }

    if (setPos) {
      position = { x: minX - xOffset / 2, y: minY - yOffsetTop };
    }

    this.groupNode = {
      ...this.groupNode,
      type: "group",
      position,
      data: {
        title: "group node",
        type: "group",
        traverse: groupType,
      },
      className: "dndnode node-group",
      style: { width: width, height: height },
      zIndex: -1,
    };

    return this.groupNode;
  }
}
