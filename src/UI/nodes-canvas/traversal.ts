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
    let edges: Edge[] = [];
    try {
      edges = this.edges.filter((edge) => edge.source === currentNodeId);
    } catch (error) {
      console.log("Error in finding edges", error);
    }
    return edges;
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
        const nextEdges = this.findNextEdge(currentTarget);
        if (nextEdges.length == 0) {
          break;
        }
        nextEdges.forEach((nextEdge: Edge) => {
          // this would actually be the group node because the branching happens here
          currentTarget = nextEdge.target;
          const node = this.getNodeById(nextEdge.target);
          if (node != undefined) {
            story.push(node);
          }
        });
      }
    } catch (error) {
      console.log("Error in building a story", error);
    }

    return story;
  }

  buildStories() {
    try {
      // start a story from every edge which has no sourceHandle
      this.edges.forEach((edge) => {
        if (edge.sourceHandle == null) {
          const story = this.buildStory(edge);
          this.stories.push(story);
        }
      });

      // handle branching

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
