import { useEffect, useState, useRef, useCallback, CSSProperties } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  useReactFlow,
  ReactFlowInstance,
  OnSelectionChangeParams,
  useEdgesState,
  applyEdgeChanges,
  addEdge,
  Panel,
  getIncomers,
  getConnectedEdges,
} from "reactflow";
import { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import "../assets/css/flow.scss";
import * as global from "../../onboarding/ts/globalVariables";
import {
  TraversalElement,
  findTraversalVisual,
  groupType,
} from "../../onboarding/ts/traversal";

import { ContextMenu } from "./context-menu";

import GroupNode from "./nodes/groupNode";
import GroupNodeType from "./nodes/groupNodeType";
import DefaultNode from "./nodes/defaultNode";
import React from "react";
import { TraversalOrder } from "./traversal";

// redux starts
import { useDispatch } from "react-redux";
import { increment } from "../redux/nodeModalities";
import { NodePath } from "@babel/traverse";
// redux ends

const nodeTypes = { group: GroupNodeType };

interface Props {
  trigger: number;
  traversal: any;
  setNodesForSave: any;
  setEdgesForSave: any;
}
interface MousePosition {
  x: number;
  y: number;
}
export default function NodesCanvas(props: Props) {
  // redux starts
  const dispatch = useDispatch();
  // redux  ends

  const defaultNode = useCallback(() => {
    return new DefaultNode();
  }, []);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAddGroupClicked, setIsAddGroupClicked] = useState(false);

  // const [setReactFlowInstance] = useState<ReactFlowInstance>();
  const reactFlowInstance = useReactFlow();
  const { getIntersectingNodes } = useReactFlow();
  const [nodeData, setNodeData] = useState<Node>();
  const [isOpen, setIsOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLInputElement>(null); // this could be the reason why we run into the initial wrong position issue
  const [selectedNodes, setSelectedNodes] = useNodesState<null>([]);
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({
    x: 0,
    y: 0,
  });

  const onInit = (reactFlowInstance: ReactFlowInstance) => {
    reactFlowInstance.zoomTo(2);
    reactFlowInstance.fitView();
  };

  const handleMouseClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
    setIsOpen(true);
  };

  function createIntitialNodes() {
    const initialNodes: Node[] = [];
    try {
      const createdNodes = createNodes(global.settings.traversalStrategy);
      if (createdNodes) {
        for (const node of createdNodes) {
          initialNodes.push(node);
        }
      }
    } catch (error) {
      console.log("Error in create initial nodes", error);
    }

    return initialNodes;
  }

  function createInitialEdges(): Edge<any>[] {
    const edges: Edge[] = [];

    try {
      if (nodes === undefined) {
        return edges;
      }
      nodes.forEach((node, index) => {
        if (index < nodes.length && index > 0) {
          edges.push({
            id: `e${index}`,
            source: index == 0 ? "null" : nodes[index - 1].id,
            sourceHandle: index == 0 ? null : nodes[index - 1].id,
            target: node.id,
            targetHandle: node.id,
            type: "default",
          });
        }
      });
    } catch (error) {
      console.log("Error in create initial nodes", error);
    }
    return edges;
  }

  const createNodes = useCallback(
    (traversal: TraversalElement[]) => {
      const createdNodes: Node[] = [];
      let prevNode;
      try {
        for (const elem of traversal) {
          if (!elem.element) {
            console.log("returning because elem is undefined");
            return;
          }
          if (elem.element.id.includes("group")) {
            const nodesWithinGroup: Node[] = [];
            const visuals = elem.element.visuals;

            for (let i = 0; i < visuals.length; i++) {
              for (let j = 0; j < visuals[i].length; j++) {
                const visTitle = getTitle(visuals[i][j]);
                if (!visTitle) {
                  return;
                }
                const visType = getType(visTitle);
                const newNode = defaultNode().getNode(
                  event,
                  visType,
                  getID(visuals[i][j]),
                  "default",
                  getPositionWithinGroup(i, j),
                  visTitle
                );

                nodesWithinGroup.push(newNode);
                createdNodes.push(newNode);
              }
            }

            const groupNodeObj = new GroupNode({
              nodes: nodesWithinGroup,
              id: "group " + elem.count,
              position: { x: 0, y: 0 },
              data: null,
            });

            const groupNode = groupNodeObj.getGroupNode(
              false,
              getPositionForWholeTrav(prevNode),
              elem.element.type
            );
            createdNodes.push(groupNode);
            prevNode = groupNode;

            nodesWithinGroup.forEach((node) => {
              node.parentNode = groupNode?.id;
              node.extent = "parent";
              node.draggable = true;
            });
          } else {
            const visTitle = getTitle(elem);
            if (!visTitle) {
              return;
            }
            const visType = getType(visTitle);
            const newNode = defaultNode().getNode(
              event,
              visType,
              getID(elem),
              "default",
              getPositionForWholeTrav(prevNode),
              visTitle
            );
            createdNodes.push(newNode);
            prevNode = newNode;
          }
        }
      } catch (error) {
        console.log("Error in create Nodes", error);
      }

      return createdNodes;
    },
    [defaultNode]
  );
  const initialNodes: Node[] = createIntitialNodes();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(createInitialEdges());
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const [edgeCount, setEdgeCount] = useState(edges.length);

  const getPosition = useCallback(
    (event: any) => {
      const reactFlowBounds =
        reactFlowWrapper?.current?.getBoundingClientRect();

      const left = reactFlowBounds ? reactFlowBounds.left : 0;
      const top = reactFlowBounds ? reactFlowBounds.top : 0;

      const position = reactFlowInstance?.project({
        x: event.clientX - left,
        y: event.clientY - top,
      });
      return position;
    },
    [reactFlowInstance]
  );

  const getCount = useCallback(
    (id: string) => {
      let count = 1;
      let sameNodes;
      let index = 1;

      if (id.split(" ").length > 1) {
        sameNodes = nodes.filter(
          (node) => node.id.split(" ")[0] + " " + node.id.split(" ")[1] === id
        );
        index = 2;
      } else {
        sameNodes = nodes.filter(
          (node) =>
            node.id.split(" ").length < 4 && node.id.split(" ")[0] === id
        );
      }

      if (sameNodes.length > 0) {
        const max = Math.max(
          ...sameNodes.map((node) => parseInt(node.id.split(" ")[index]))
        );
        count += max;
      }

      return count;
    },
    [nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      let id = event.dataTransfer.getData("id");
      const type = event.dataTransfer.getData("nodeType");
      const visType = event.dataTransfer.getData("visType");
      const title = event.dataTransfer.getData("title");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      id += " " + getCount(id);

      const position = getPosition(event);

      const newNode = defaultNode().getNode(
        event,
        visType,
        id,
        type,
        position,
        title
      );

      setNodes((nds) => nds.concat(newNode));
    },
    [getCount, getPosition, defaultNode, setNodes]
  );

  const onNodeClick = useCallback(
    (event: any, clickedNode: Node) => {
      try {
        setNodes((nodes: Node[]) => {
          return nodes.map((node: Node) => {
            if (node.id == clickedNode.id) {
              console.log("This node is selected", node);
              return {
                ...node,
                style: {
                  ...node.style,
                  boxShadow: "0px 0px 2px 2px #ffffff", // adjust color, blur, and spread as desired
                },
              };
            } else {
              return {
                ...node,
                style: {
                  ...node.style,
                  boxShadow: "0px 0px 0px 0px ", // adjust color, blur, and spread as desired
                },
              };
            }
          });
        });
        const container = document.getElementById("canvas-container");
        event.target.classList.contains("react-flow__pane")
          ? container?.classList.remove("show")
          : container?.classList.add("show");

        const fullNameArray = defaultNode().getFullNodeNameArray(event);
        const basicName = defaultNode().getBasicName(event);
        if (fullNameArray && basicName) {
          dispatch(increment([basicName, fullNameArray]));
        }
      } catch (error) {
        console.log("Error on nodeclick", error);
      }
    },
    [defaultNode, dispatch, setNodes]
  );

  const onNodeMouseEnter = (e: any, node: Node) => {
    if (node.type === "group") {
    }
    setNodeData(node);
  };

  const getMousePositionFromReactFlow = useCallback((event: any) => {
    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();

    const left = reactFlowBounds ? reactFlowBounds.left : 0;
    const top = reactFlowBounds ? reactFlowBounds.top : 0;
    const { clientX, clientY } = event;
    const position = {
      x: clientX - left,
      y: clientY - top,
    };
    return position;
  }, []);

  const onNodeContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setMousePosition(getMousePositionFromReactFlow(event));
      setIsOpen(true);
    },
    [getMousePositionFromReactFlow]
  );
  const onSelectionContextMenu = useCallback(
    (event, sNodes: Node[]) => {
      event.preventDefault();
      setMousePosition(getMousePositionFromReactFlow(event));
      setIsOpen(true);
      setSelectedNodes(sNodes);
    },
    [setSelectedNodes, getMousePositionFromReactFlow]
  );

  const buildTraversal = useCallback(
    (traversal: any) => {
      setNodes([]);

      const createdNodes = createNodes(traversal);
      if (createdNodes) {
        for (const node of createdNodes) {
          setNodes((nds) => nds.concat(node));
        }
      }
    },
    [createNodes, setNodes]
  );
  const onSelectionChangeFunction = (params: OnSelectionChangeParams) => {
    setSelectedNodes(params.nodes);
  };
  const deleteNode = useCallback(() => {
    if (nodeData?.type === "group") {
      setNodes((nodes) => nodes.filter((n) => n.parentNode !== nodeData.id));
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    } else if (nodeData?.type === "default" && selectedNodes.length <= 1) {
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
      edges.forEach((edge: Edge) => {
        if (edge.source == nodeData.id) {
          edge.sourceHandle = null;
        }
        if (edge.target == nodeData.id) {
          edge.targetHandle = null;
        }
      });
      setEdges((edges) => edges.filter((e) => e.source !== nodeData.id));
      setEdges((edges) => edges.filter((e) => e.target !== nodeData.id));
    } else if (selectedNodes.length > 1) {
      const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));
      setNodes((nodes) => nodes.filter((n) => !selectedNodeIds.has(n.id)));

      setEdges((edges) => edges.filter((e) => !selectedNodeIds.has(e.source)));
      setEdges((edges) => edges.filter((e) => !selectedNodeIds.has(e.target)));
    }
    setIsOpen(false);
  }, [nodeData, selectedNodes, setNodes, edges, setEdges]);

  const addGroup = useCallback(() => {
    try {
      if (isAddGroupClicked) {
        return;
      }
      setIsAddGroupClicked(true);

      setTimeout(() => {
        setIsAddGroupClicked(false);
      }, 300);

      let noGroup = false;
      selectedNodes.forEach((sNode) => {
        if (sNode.type == "group") {
          noGroup = true;
        }
        if (sNode.parentNode) {
          noGroup = true;
        }
      });

      if (noGroup) {
        console.log("Returning because this is a noGroup");
        return;
      }

      const count = getCount("group");

      const groupNodeObj = new GroupNode({
        nodes: selectedNodes,
        id: "group " + count,
        position: { x: 0, y: 0 },
        data: null,
      });

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      selectedNodes.forEach((node: Node) => {
        console.log("node ", node.position.x, node.position.y);
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

      // const position = reactFlowInstance.project({
      //   x: minX,
      //   y: minY,
      // });
      console.log("calculated post, ", minX, minY);
      const groupNode = groupNodeObj.getGroupNode(
        true,
        { x: minX, y: minY },
        groupType.all
      );

      console.log(
        "Groupnode post, ",
        groupNode.position.x,
        groupNode.position.y
      );
      setNodes((nds) => nds.concat(groupNode));

      if (!groupNode) {
        console.log("No group node found");
        return;
      }

      nodes.map((node) => {
        selectedNodes.forEach((sNode) => {
          try {
            if (node.id == sNode.id) {
              node.parentNode = groupNode?.id;
              node.extent = "parent";
              node.position = {
                x: sNode.position.x - groupNode.position.x,
                y: sNode.position.y - groupNode.position.y,
              };
              node.draggable = true;
              return node;
            }
          } catch (error) {
            console.log("Error in selecting nodes: ", error);
          }
        });
      });
    } catch (error) {
      console.log("Error", error);
    }
  }, [getCount, isAddGroupClicked, nodes, selectedNodes, setNodes]);

  useEffect(() => {
    if (props.trigger) {
      buildTraversal(props.traversal);
    }
  }, [buildTraversal, props.traversal, props.trigger]);

  useEffect(() => {
    props.setNodesForSave(nodes);
    props.setEdgesForSave(edges);
    const tOrder = new TraversalOrder(edges, nodes);
    tOrder.createTraversal();
  }, [nodes, props, edges]);

  function getPositionForWholeTrav(prevNode: any) {
    let pos = {
      x: 0,
      y: 0,
    };

    if (prevNode) {
      const offset = 5;
      let prevNodeHeight = 0;
      prevNodeHeight = parseInt(String(prevNode.style?.height!), 10);
      pos = {
        x: prevNode.position.x,
        y: prevNode.position.y + prevNodeHeight + offset,
      };
    }
    return pos;
  }

  function getPositionWithinGroup(xIndex: number, yIndex: number) {
    let xOffset = 10;
    let yOffset = 40;
    xOffset = xOffset + xIndex * 110;
    yOffset = yOffset + yIndex * 35;
    const pos = {
      x: xOffset,
      y: yOffset,
    };
    return pos;
  }

  function getID(elem: TraversalElement) {
    let id = elem.element.id;

    if (elem.categories.length === 1 && elem.categories[0] === "insight") {
      id += " Insight";
    } else if (
      elem.categories.length === 1 &&
      elem.categories[0] === "interaction"
    ) {
      id += " Interaction";
    }

    id += " " + elem.count;

    return id;
  }

  function getType(title: string) {
    let type = title;
    if (title === "Global Filters") {
      type = "GlobalFilter";
    } else if (title === "Introduction") {
      type = "WelcomeCard";
    }
    return type;
  }

  function getTitle(elem: TraversalElement) {
    let visTitle = "";
    switch (elem.element.id) {
      case "welcomeCard":
        visTitle = "Introduction";
        break;
      case "dashboard":
        visTitle = "Dashboard";
        break;
      case "globalFilter":
        visTitle = "Global Filters";
        break;

      default:
        const vis = findTraversalVisual(elem.element.id);
        if (!vis) {
          return;
        }
        visTitle = createNodeTitle(vis?.type);
        const itemLength = checkDuplicateComponents(vis?.type);
        if (itemLength > 1) {
          visTitle = visTitle + " (" + vis?.title + ")";
        }
    }
    if (elem.categories.length === 1 && elem.categories[0] === "insight") {
      visTitle += " Insight";
    } else if (
      elem.categories.length === 1 &&
      elem.categories[0] === "interaction"
    ) {
      visTitle += " Interaction";
    }

    return visTitle;

    function checkDuplicateComponents(visType: string) {
      const componentItems = global.allVisuals.filter(function (visual) {
        return visual.type == visType;
      });
      return componentItems.length;
    }

    function createNodeTitle(title: string, index = "") {
      let newTitle = title;
      switch (title) {
        case "card":
        case "multiRowCard":
          newTitle = "KPI";
          break;
        case "slicer":
          newTitle = "Filter";
          break;
        case "lineClusteredColumnComboChart":
          newTitle = "Combo Chart";
          break;
        case "clusteredBarChart":
          newTitle = "Bar Chart";
          break;
        case "clusteredColumnChart":
          newTitle = "Column Chart";
          break;
        case "pivotTable":
          newTitle = "Matrix";
          break;
        case "tableEx":
          newTitle = "Table";
          break;
        case "lineChart":
          newTitle = "Line Chart";
          break;
        default:
          newTitle = title;
      }
      newTitle = newTitle + index;
      return newTitle;
    }
  }

  // Handle multiple connects here
  const onConnect = useCallback(
    (params) => {
      console.log("Params", params);

      // setEdges((edges: Edge<any>[]) => {
      //   return edges.map((edge: Edge) => {
      //     if (edge.source == params.source) {
      //       if (edge.target) {
      //         //update target handles of the source edge
      //         return {
      //           ...edge,
      //           // targetHandle: [edge.target, params.target]
      //         };
      //       }
      //     }
      //     return edge;
      //   });
      // });
      const newEdge = {
        id: `e${edgeCount + 1}`,
        source: params.source,
        sourceHandle: params.source,
        target: params.target,
        type: "default",
      };
      setEdgeCount(edgeCount + 1);
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [edgeCount, setEdges]
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          onInit={onInit}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          onDragOver={onDragOver}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeContextMenu={onNodeContextMenu}
          onSelectionContextMenu={onSelectionContextMenu}
          onSelectionChange={onSelectionChangeFunction}
          onConnect={onConnect}
          snapToGrid
          fitView
        >
          <Controls />
          <ContextMenu
            isOpen={isOpen}
            onClick={handleMouseClick}
            position={mousePosition}
            onMouseLeave={() => setIsOpen(false)}
            actions={[
              { label: "Delete", effect: deleteNode },
              { label: "Group", effect: addGroup },
            ]}
          ></ContextMenu>
        </ReactFlow>
      </div>
    </div>
  );
}
