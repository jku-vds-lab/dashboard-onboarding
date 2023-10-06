import {
  createTraversalOfNodes,
  groupType,
} from "../../onboarding/ts/traversal";
import "../assets/css/flow.scss";
import { IGroupNode } from "./nodes/groupNode";
import { IDefaultNode } from "./nodes/defaultNode";
import { Edge } from "reactflow";
import Graph from "graphology";

export class TraversalOrder {
  private graph = new Graph();
  private entryNodes: string[] = [];
  private defaultNodes: IDefaultNode[] = [];
  private groupNodes: IGroupNode[] = [];
  private allNodes: (IDefaultNode | IGroupNode)[] = [];
  private groupId: number = 100;
  private edges: Edge[] = [];
  private stories: (IDefaultNode | IGroupNode)[][];
  constructor(edges: Edge[], allNodes: (IDefaultNode | IGroupNode)[]) {
    this.edges = edges;
    this.defaultNodes = [];
    this.groupNodes = [];
    this.allNodes = allNodes;
    this.groupId = 99; // new ids for new possible groups
    this.stories = [];
  }

  getNodeById(nodeId: string) {
    return this.allNodes.find((node) => node.id === nodeId);
  }

  buildStory(
    startNodeId: string,
    visitedNodes: Set<string> = new Set()
  ): (IDefaultNode | IGroupNode)[] {
    const story: (IDefaultNode | IGroupNode)[] = [];
    try {
      let currentNode: string | null = startNodeId;
      const startNode = this.getNodeById(currentNode);
      if (!startNode) {
        return story;
      }
      visitedNodes.add(startNodeId);
      story.push(startNode);

      while (currentNode) {
        let nextNeighbour = null;
        this.graph.forEachOutNeighbor(currentNode, (neighbour: string) => {
          nextNeighbour = neighbour;
          if (this.graph.outDegree(currentNode) == 0) {
            nextNeighbour = null;
            return story;
          } else if (this.graph.outDegree(currentNode) == 1) {
            const nextNode = this.getNodeById(neighbour);
            if (nextNode) {
              story.push(nextNode);
            }
          } else if (currentNode) {
            story.push(...this.createGroupNode(currentNode, visitedNodes));
          }
        });
        currentNode = nextNeighbour;
      }

      return story;
    } catch (error) {
      console.log("Error in building a story", error);
      return [];
    }
  }

  createGroupNode(nodeId: string, visitedNodes: Set<string>): IGroupNode[] {
    const groupNodes: IGroupNode[] = [
      {
        id: `group_${nodeId}`,
        type: "group",
        nodes: [],
        position: { x: 0, y: 0 },
        data: {
          title: "group node",
          type: "group",
          traverse: groupType.onlyOne,
        },
      },
    ];
    this.graph.forEachOutNeighbor(nodeId, (neighbour: string) => {
      const groupNode = {
        id: `group_${neighbour}`,
        type: "group",
        nodes: [],
        position: { x: 0, y: 0 },
        data: {
          title: "group node",
          type: "group",
          traverse: groupType.all,
        },
      };
      groupNodes.push(groupNode);

      if (!visitedNodes.has(nodeId)) {
        const branchStory = this.buildStory(neighbour, visitedNodes);
        // groupNode.nodes.push(...branchStory);
      }
    });

    return groupNodes;
  }

  followSingleNode(
    nodeId: string,
    visitedNodes: Set<string>
  ): IDefaultNode | IGroupNode | null {
    const nextNode = this.getNodeById(nodeId);

    if (nextNode && !visitedNodes.has(nextNode.id)) {
      visitedNodes.add(nextNode.id);
      return nextNode;
    }
    return null;
  }

  buildStories() {
    try {
      this.entryNodes.forEach((nodeId: string) => {
        console.log("Story for ", nodeId);
        const story = this.buildStory(nodeId);
        console.log("--> ", story);
        this.stories.push(story);
      });
    } catch (error) {
      console.log("Error in building stories", error);
    }
  }

  convertToGraph() {
    this.allNodes.forEach((node: IDefaultNode | IGroupNode) => {
      this.graph.addNode(node.id);
    });

    this.edges.forEach((edge: Edge) => {
      this.graph.addEdge(edge.source, edge.target);
    });
  }

  findStartingStoryNodes() {
    this.graph.forEachNode((nodeId) => {
      if (this.graph.inDegree(nodeId) == 0) {
        this.entryNodes.push(nodeId);
      }
    });
  }

  createTraversal() {
    try {
      this.convertToGraph();
      this.findStartingStoryNodes();
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
