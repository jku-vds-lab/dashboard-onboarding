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
    this.graph = new Graph();
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
        let nextNode = null;
        this.graph.forEachOutNeighbor(currentNode, (neighbour: string) => {
          nextNode = neighbour;
          if (this.graph.outDegree(currentNode) == 0) {
            nextNode = null;
            return story;
          } else if (this.graph.outDegree(currentNode) == 1) {
            const nextNode = this.getNodeById(neighbour);
            if (nextNode) {
              story.push(nextNode);
            }
          } else if (currentNode) {
            const groupNode = this.createGroupNode(currentNode, visitedNodes);
            if (groupNode && !visitedNodes.has(groupNode.id)) {
              story.push(groupNode);
              visitedNodes.add(groupNode.id);
            }
          }
        });
        visitedNodes.add(currentNode);
        currentNode = nextNode;
      }

      return story;
    } catch (error) {
      console.log("Error in building a story", error);
      return [];
    }
  }

  createGroupNode(
    nodeId: string,
    visitedNodes: Set<string>,
    mainGNode?: IGroupNode
  ): IGroupNode {
    if (!mainGNode) {
      mainGNode = {
        id: `group_${nodeId}`,
        type: "group",
        nodes: [],
        position: { x: 0, y: 0 },
        data: {
          title: "group node",
          type: "group",
          traverse: groupType.onlyOne,
        },
        groupNode: [],
      };
    }

    this.graph.forEachOutNeighbor(nodeId, (neighbour: string) => {
      const gNode: IGroupNode = {
        id: `group_${neighbour}`,
        type: "group",
        nodes: [],
        position: { x: 0, y: 0 },
        data: {
          title: "group node",
          type: "group",
          traverse: groupType.all,
        },
        groupNode: [],
      };

      if (!visitedNodes.has(neighbour)) {
        const branchStory = this.buildStory(neighbour, visitedNodes);
        gNode.nodes.push(...branchStory);
      } else {
        console.log("Already visited ", neighbour);
      }

      if (mainGNode && mainGNode.groupNode) {
        mainGNode.groupNode.push(gNode);
      } else {
        console.error("mainGNode or mainGNode.groupNode is undefined!");
      }
    });

    return mainGNode;
  }

  buildStories() {
    try {
      this.entryNodes.forEach((nodeId: string) => {
        console.log("------------------------");
        const story = this.buildStory(nodeId);
        console.log("Story for ", nodeId, story);
        console.log("************************");
        this.stories.push(story);
      });
    } catch (error) {
      console.log("Error in building stories", error);
    }
  }

  // ghost node is being added for no reason
  convertToGraph() {
    try {
      this.allNodes.forEach((node: IDefaultNode | IGroupNode) => {
        this.graph.addNode(node.id);
      });

      this.edges.forEach((edge: Edge) => {
        this.graph.addEdge(edge.source, edge.target);
      });
    } catch (error) {
      console.log("Error while converting to graph", error);
    }
  }

  findStartingStoryNodes() {
    // check that the node is also not in a group
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
