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
      story = [this.getNodeById(startEdge.source)]; // Add the starting node
      let currentTarget = startEdge.source;

      while (currentTarget) {
        const nextEdge = this.findNextEdge(currentTarget);
        if (!nextEdge) break;
        currentTarget = nextEdge.target;
        const node = this.getNodeById(nextEdge.target);
        if (node != undefined) {
          story.push(node);
        }
      }
    } catch (error) {
      console.log("Error in building a story", error);
    }

    return story;
  }

  buildStories() {
    try {
      this.edges.forEach((edge) => {
        if (edge.sourceHandle == null) {
          const story = this.buildStory(edge);
          this.stories.push(story);
        }
      });

      console.log("----------------------------------");
      console.log("Nodes", this.allNodes);
      console.log("Edges", this.edges);
      console.log("Stories", this.stories);
      console.log("----------------------------------");
    } catch (error) {
      console.log("Error in building stories", error);
    }
  }

  createTraversal() {
    try {
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
      this.buildStories();
      createTraversalOfNodes(this.allNodes);
      this.defaultNodes = [];
      this.groupNodes = [];
      this.allNodes = [];
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}
