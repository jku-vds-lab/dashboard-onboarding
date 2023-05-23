import { CSSProperties } from "react";
import { Node } from "reactflow";
import { IGroupNode } from "./groupNode";
import { groupType } from "../../../onboarding/ts/traversal";

export interface IDefaultNode extends Node {
  rank?: number;
  probability?: number;
  group?: IGroupNode;
  groupCategory?: groupType;
}
export default class DefaultNode {
  constructor() {}

  getNode(
    event: any,
    visType: string,
    id: string,
    type: string,
    position: any,
    title: string
  ) {
    const basicName = this.getBasicName(event, visType);
    const nodeStyle = this.style();

    nodeStyle.backgroundColor = this.getNodeBgColor(basicName);

    const newNode: Node = {
      id,
      type,
      position,
      data: {
        label: title,
        type: "default",
      },
      style: nodeStyle,
      selectable: true,
    };
    return newNode;
  }

  getNodeBgColor(type: string) {
    let color = "";
    switch (type) {
      case "Dashboard":
        color = "#4e91e9";
        break;
      case "Line":
        color = "#d95f02";
        break;
      case "Bar":
        color = "#1b9e77";
        break;
      case "Filter":
        color = "#e7298a";
        break;
      case "KPI":
        color = "#7570b3";
        break;
      case "GlobalFilter":
        color = "#e25757";
        break;
      case "Column":
        color = "#66a61e";
        break;
      default:
        color = "#595959";
        break;
    }

    return color;
  }

  style() {
    const nodeStyle: CSSProperties = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "-moz-grab",
      width: "100px",
      height: "30px",
      borderRadius: "4px",
      boxShadow: "0 0 4px #1a1717",
      fontSize: "10px",
    };
    return nodeStyle;
  }

  getBasicName(event: any, name?: string) {
    let basicName: string = "";
    const nameArray = this.getFullNodeNameArray(event, name);
    if (nameArray?.length > 0) {
      basicName = nameArray[0];
    }
    return basicName;
  }

  getFullNodeNameArray(event: any, name?: string) {
    let nodeName = "";
    let nameArray: string[] = [];
    if (name) {
      nodeName = name;
    } else {
      nodeName = event.target.getAttribute("data-id");
    }
    document?.getElementById("textBox")?.setAttribute("nodeId", nodeName);

    nameArray = nodeName?.split(" ");
    return nameArray;
  }
}
