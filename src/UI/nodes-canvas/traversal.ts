import { createTraversalOfNodes } from "../../onboarding/ts/traversal";
import "../assets/css/flow.scss";
import { IGroupNode } from "./nodes/groupNode";
import { IDefaultNode } from "./nodes/defaultNode";
import { Edge } from "reactflow";

export class TraversalOrder {
  private defaultNodes: IDefaultNode[] = [];
  private groupNodes: IGroupNode[] = [];
  private allNodes: (IDefaultNode | IGroupNode)[] = [];
  private groupId: number = 100;
  private edges: Edge[] = [];
  private stories: (IDefaultNode | IGroupNode | any)[][];
  constructor(edges: Edge[], allNodes: (IDefaultNode | IGroupNode)[]) {
    this.edges = edges;
    this.defaultNodes = [];
    this.groupNodes = [];
    this.allNodes = allNodes;
    this.groupId = 99; // new ids for new possible groups
    this.stories = [];
  }

  findNextEdge(currentNodeId: string) {
    return this.edges.find((edge) => edge.source === currentNodeId);
  }

  getNodeById(nodeId: string) {
    return this.allNodes.find((node) => node.id === nodeId);
  }

  buildStory(startEdge: Edge) {
    let story: any = [];
    try {
      story = [this.getNodeById(startEdge.target)]; // Add the starting node
      let currentTarget = startEdge.target;

      while (currentTarget) {
        const nextEdge = this.findNextEdge(currentTarget);
        if (!nextEdge) break;
        story.push(this.getNodeById(nextEdge.target));
        currentTarget = nextEdge.target;
      }
    } catch (error) {
      console.log("Error in building a story", error);
    }

    return story;
  }

  buildStories(allNodes: (IDefaultNode | IGroupNode)[], edges: Edge[]) {
    try {
      debugger;
      this.allNodes = allNodes;
      this.edges = edges;
      this.edges.forEach((edge) => {
        if (edge.source === "") {
          const story = this.buildStory(edge);
          this.stories.push(story);
        }
      });

      // Handle stand-alone nodes (edges with both source and target as null)
      this.edges.forEach((edge: Edge) => {
        if (edge.source === "" && edge.target === "") {
          this.stories.push([this.getNodeById(edge.target)]);
        }
      });
      console.log("Stories", this.stories);
    } catch (error) {
      console.log("Error in building stories", error);
    }
  }

  // separate nodes that are within and without a group
  // createTraversal(nodes: any) {
  createTraversal() {
    try {
      debugger;
      // const storyNodes = nodes;

      // if (storyNodes.length > 0) {
      //   this.defaultNodes = storyNodes.filter((sNode: any) => {
      //     if (sNode.type == "default") {
      //       if (!sNode.parentNode) {
      //         return sNode;
      //       }
      //     }
      //   });
      //   this.groupNodes = storyNodes.filter(
      //     (sNode: any) => sNode.type == "group"
      //   );
      // }

      // this.setRank();
      // this.buildStories();
      createTraversalOfNodes(this.allNodes);
      this.defaultNodes = [];
      this.groupNodes = [];
      this.allNodes = [];
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

// export default function Traversal(props: any) {
//   const tOrder = new TraversalOrder();

//   return (
//     <div
//       id="traversal"
//       className="btn btn-secondary btn-dark ms-2"
//       onClick={() => tOrder.onClick(props)}
//     >
//       Save your story
//     </div>
//   );
// }
