import { createTraversalOfNodes } from "../../onboarding/ts/traversal";
import "../assets/css/flow.scss";
import { IGroupNode } from "./nodes/groupNode";
import { IDefaultNode } from "./nodes/defaultNode";
import { Edge } from "reactflow";
import { easeBack } from "d3";

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

  createGroupNode(
    nodeId: string,
    nextEdges: Edge[],
    visitedNodes: Set<string>
  ): IGroupNode {
    const groupNode: IGroupNode = {
      id: `group_${nodeId}`,
      type: "group",
      nodes: [],
      position: { x: 0, y: 0 },
      data: {},
    };

    nextEdges.forEach((nextEdge: Edge) => {
      if (!visitedNodes.has(nextEdge.target)) {
        const branchStory: (IDefaultNode | IGroupNode)[] = this.buildStory(
          nextEdge,
          visitedNodes
        );
        groupNode.nodes.push(...branchStory);
      }
    });

    return groupNode;
  }

  followSingleEdge(edge: Edge, visitedNodes: Set<string>): IDefaultNode | null {
    const nextNode = this.getNodeById(edge.target);

    if (nextNode && !visitedNodes.has(nextNode.id)) {
      visitedNodes.add(nextNode.id);
      return nextNode;
    }
    return null;
  }
  buildStory(
    startEdge: Edge,
    visitedNodes: Set<string> = new Set()
  ): (IDefaultNode | IGroupNode)[] {
    const story: (IDefaultNode | IGroupNode)[] = [];
    try {
      debugger;
      let currentTarget = startEdge.source;
      if (!visitedNodes.has(currentTarget)) {
        const startNode = this.getNodeById(currentTarget);
        if (!startNode) {
          return story;
        }
        visitedNodes.add(startNode.id);
        story.push(startNode);
      } else {
        currentTarget = startEdge.target;
      }

      while (currentTarget) {
        const nextEdges = this.findNextEdge(currentTarget);
        if (nextEdges.length == 0) {
          break;
        } else if (nextEdges.length > 1) {
          story.push(
            this.createGroupNode(currentTarget, nextEdges, visitedNodes)
          );
          break;
        } else {
          const nextNode = this.followSingleEdge(nextEdges[0], visitedNodes);
          if (nextNode) {
            story.push(nextNode);
            currentTarget = nextNode.id;
          } else {
            break;
          }
        }
      }
      return story;
    } catch (error) {
      console.log("Error in building a story", error);
      return [];
    }
  }

  buildStories() {
    try {
      const startStoryEdges: Edge[] = [];
      // figure out how many stories there will be
      // basically check for breaks
      this.edges.forEach((edge: Edge, index: number) => {
        if (index == 0) {
          startStoryEdges.push(edge);
        } else if (index < this.edges.length - 1) {
          if (edge.target != this.edges[index + 1].source) {
            startStoryEdges.push(this.edges[index + 1]);
          }
        }
      });

      startStoryEdges.forEach((edge) => {
        const story = this.buildStory(edge);
        this.stories.push(story);
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
