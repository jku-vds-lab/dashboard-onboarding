import { editedTexts } from "../../onboarding/ts/globalVariables";
import { createTraversalOfNodes } from "../../onboarding/ts/traversal";
import { groupType } from "../../onboarding/ts/traversal";
import { saveVisualChanges } from "../../onboarding/ts/infoCards";
import { saveDashboardChanges } from "../../onboarding/ts/dashboardInfoCard";
import { saveFilterChanges } from "../../onboarding/ts/filterInfoCards";
import "../assets/css/flow.scss";
import { IGroupNode } from "./nodes/groupNode";
import { IDefaultNode } from "./nodes/defaultNode";

export class TraversalOrder {
  private defaultNodes: IDefaultNode[] = [];
  private groupNodes: IGroupNode[] = [];
  private groupId: number = 100;

  constructor() {
    this.defaultNodes = [];
    this.groupNodes = [];
    this.groupId = 99; // new ids for new possible groups
  }

  // nodes which are not in a group but at a same horizontal position, should be treated as a group, only one, then the sequence
  // setGroupNodesAndElementsCount(storyNodes: any[]) {
  //   this.groupNodes = storyNodes.filter((sNode) => sNode.type == "group");
  //   this.groupNodes.forEach((gNode) => {
  //     this.groupElementsCount.push({
  //       id: gNode.id,
  //       count: 0,
  //       type: "",
  //       nodes: [],
  //     });
  //   });
  //   this.defaultNodes.forEach((sNode) => {
  //     if (sNode.pGrp) {
  //       this.groupElementsCount.map((gElem) => {
  //         if (gElem.id == sNode.pGrp.id) {
  //           gElem.count++;
  //           gElem.type = sNode.pGrpCat;
  //           gElem.nodes.push(sNode);
  //         }
  //       });
  //     }
  //   });
  // }

  // setGrpCnt() {
  //   this.defaultNodes.map((sNode) => {
  //     if (sNode.pGrp) {
  //       let elem = this.groupElementsCount.find(
  //         (gElem) => gElem.id == sNode.pGrp.id
  //       );
  //       sNode.pGrpCnt = elem.count;
  //     }
  //   });
  // }

  // setProb() {
  //   this.defaultNodes.forEach((sNode) => {
  //     if (sNode.pGrp) {
  //       if (sNode.pGrpCat == groupType.all) {
  //         sNode.probability = 1;
  //       } else {
  //         sNode.probability = 1 / sNode.pGrpCnt;
  //       }
  //     }
  //   });
  // }

  setRank() {
    // sort simple nodes by y- position
    // if they are of the same y-position, check if they are in the same group, assign rank based on x position
    // here the rank needs to be set (and assigned in group, if necessary)
    try {
      this.defaultNodes = this.defaultNodes.sort(this.compare);
      this.defaultNodes.forEach((sNode, index) => {
        sNode.rank = index + 1;
      });
      console.log(this.defaultNodes);
    } catch (error) {
      console.log("Error", error);
    }
  }

  compareAndRank(elem1: IDefaultNode, elem2: IDefaultNode) {
    // -1: elem1 then elem2
    // 1: elem2 then elem1
    // 0: elem1 = elem 2
    // simpleNodes with parents have position absolute, while others don't

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

  compare(elem1: IDefaultNode, elem2: IDefaultNode) {
    // -1: elem1 then elem2
    // 1: elem2 then elem1
    // 0: elem1 = elem 2
    // simpleNodes with parents have position absolute, while others don't
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

  // updateRank() {
  //   this.defaultNodes.forEach((sNode) => {
  //     if (sNode.pGrp) {
  //       if (sNode.pGrpCat == groupType.all) {
  //         sNode.probability = 1;
  //       } else {
  //         sNode.probability = 1 / sNode.pGrpCnt;
  //       }
  //     }
  //   });
  // }

  updateProb() {
    // Get the information from what was clicked by the user
    // based on that, set the probabilities of others accordingly
    // old nodes can simply be discarded
    this.defaultNodes.forEach((dNode: IDefaultNode) => {
      if (dNode.parentNode) {
        if (dNode.groupCategory == groupType.all) {
          dNode.probability = 1;
        } else {
          const count = dNode.group?.nodes.length ?? 1;
          dNode.probability = 1 / count;
        }
      }
    });
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

      // this.setGroupNodesAndElementsCount(storyNodes);
      // this.setGrpCnt();
      // this.setProb();
      this.setRank();
      await createTraversalOfNodes(this.defaultNodes, this.groupNodes);
      for (const edited of editedTexts) {
        switch (edited.idParts[0]) {
          case "dashboard":
            await saveDashboardChanges(edited.newInfos, edited.count);
            break;
          case "globalFilter":
            await saveFilterChanges(edited.newInfos, edited.count);
            break;
          default:
            await saveVisualChanges(
              edited.newInfos,
              edited.idParts,
              edited.count
            );
            break;
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

export default function Traversal(props: any) {
  const tOrder = new TraversalOrder();

  return (
    <div
      id="traversal"
      className="btn btn-outline-info me-auto"
      onClick={() => tOrder.onClick(props)}
    >
      Save Traversal
    </div>
  );
}
