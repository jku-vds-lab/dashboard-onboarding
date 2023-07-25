import { createTraversalOfNodes } from "../../onboarding/ts/traversal";
import "../assets/css/flow.scss";
import { IGroupNode } from "./nodes/groupNode";
import { IDefaultNode } from "./nodes/defaultNode";

export class TraversalOrder {
  private defaultNodes: IDefaultNode[] = [];
  private groupNodes: IGroupNode[] = [];
  private allNodes: (IDefaultNode | IGroupNode)[] = [];
  private groupId: number = 100;

  constructor() {
    this.defaultNodes = [];
    this.groupNodes = [];
    this.allNodes = [];
    this.groupId = 99; // new ids for new possible groups
  }
  setRank() {
    // sort simple nodes by y- position
    // if they are of the same y-position, check if they are in the same group, assign rank based on x position
    // here the rank needs to be set (and assigned in group, if necessary)
    try {
      this.defaultNodes = this.defaultNodes.sort(this.compare);
      this.defaultNodes.forEach((sNode, index) => {
        sNode.rank = index + 1;
      });

      this.allNodes.push(...this.defaultNodes);
      this.allNodes.push(...this.groupNodes);
      this.allNodes = this.allNodes.sort(this.compare);
      console.log(this.defaultNodes);
    } catch (error) {
      console.log("Error", error);
    }
  }

  compareAndRank(elem1: IDefaultNode, elem2: IDefaultNode) {
    // -1: elem1 then elem2
    // 1: elem2 then elem1
    // 0: elem1 = elem 2
    // const groupNodeObj = new GroupNode({
    //   nodes: selectedNodes,
    //   id: "group " + groupId.id++,
    //   position: { x: 0, y: 0 },
    //   data: null,
    // });
    try {
      const xPos1 = elem1.positionAbsolute
        ? elem1.positionAbsolute.x
        : elem1.position.x;
      const xPos2 = elem2.positionAbsolute
        ? elem2.positionAbsolute.x
        : elem2.position.x;
      const yPos1 = elem1.positionAbsolute
        ? elem1.positionAbsolute.y
        : elem1.position.y;
      const yPos2 = elem2.positionAbsolute
        ? elem2.positionAbsolute.y
        : elem2.position.y;

      if (yPos1 == yPos2) {
        // also has to be the global minima
        // const groupNode: IGroupNode = {
        //   nodes: [elem1, elem2],
        //   id: "group " + this.groupId++,
        //   data: {
        //     title: "group node",
        //     type: "group",
        //     traverse: groupType.onlyOne,
        //   },
        //   position: { x: xPos1, y: yPos1 },
        // };
        // this.groupNodes.push(groupNode);
        return xPos1 - xPos2;
      } else {
        return yPos1 - yPos2;
      }
    } catch (error) {
      console.log("Error", error);
    }
    return 0;
  }

  compare(elem1: IDefaultNode | IGroupNode, elem2: IDefaultNode | IGroupNode) {
    // -1: elem1 then elem2
    // 1: elem2 then elem1
    try {
      const yPos1 = elem1.positionAbsolute
        ? elem1.positionAbsolute.y
        : elem1.position.y;
      const yPos2 = elem2.positionAbsolute
        ? elem2.positionAbsolute.y
        : elem2.position.y;

      if (yPos1 < yPos2) {
        return -1;
      } else if (yPos1 > yPos2) {
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log("Error", error);
    }
    return 0;
  }

  // separate nodes that are within and without a group
  async onClick(props: any) {
    try {
      const storyNodes = props.nodes;
      
      if (storyNodes.length > 0) {
        this.defaultNodes = storyNodes.filter((sNode: any) => {
          if (sNode.type == "default") {
            if (!sNode.parentNode) {
              return sNode;
            }
          }
        });
        this.groupNodes = storyNodes.filter(
          (sNode: any) => sNode.type == "group"
        );
      }

      this.setRank();
      await createTraversalOfNodes(this.allNodes);
      this.defaultNodes = [];
      this.groupNodes = [];
      this.allNodes = [];
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

export default function Traversal(props: any) {
  const tOrder = new TraversalOrder();

  return (
    <div id="traversal"
      className="btn btn-secondary btn-dark ms-2"
      onClick={() => tOrder.onClick(props)}>
      Save Traversal
    </div>
  );
}
