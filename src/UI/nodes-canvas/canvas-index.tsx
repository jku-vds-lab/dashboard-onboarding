import { useEffect, useState, useRef, useCallback, CSSProperties } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  useReactFlow,
  ReactFlowInstance,
} from "reactflow";
import { Node } from "reactflow";
import "reactflow/dist/style.css";
import "../assets/css/flow.scss";
import * as global from "../../onboarding/ts/globalVariables";
import {
  TraversalElement,
  findTraversalVisual,
  groupType,
} from "../../onboarding/ts/traversal";

// import ICustomNode from "./nodeTypes/ICustomNode";
import { ContextMenu } from "./context-menu";

import Traversal from "./traversal";

import { getVisualInfoInEditor } from "../../onboarding/ts/infoCards";
import { getDashboardInfoInEditor } from "../../onboarding/ts/dashboardInfoCard";
import { getFilterInfoInEditor } from "../../onboarding/ts/filterInfoCards";

import GroupNode from "./nodes/groupNode";
import GroupNodeType from "./nodes/groupNodeType";
import DefaultNode from "./nodes/defaultNode";
import React from "react";

const nodeTypes = { group: GroupNodeType };

interface Props {
  trigger: number;
  traversal: any;
  setNodesForSave: any;
}
interface MousePosition {
  x: number;
  y: number;
}
export default function NodesCanvas(props: Props) {
  const defaultNode = useCallback(() => {
    return new DefaultNode();
  }, []);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const initialNodes: Node[] = createIntitialNodes();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [setReactFlowInstance] = useState<ReactFlowInstance>();
  const reactFlowInstance = useReactFlow();
  const { getIntersectingNodes } = useReactFlow();
  const [nodeData, setNodeData] = useState<Node>();
  const [isOpen, setIsOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLInputElement>(null); // this could be the reason why we run into the initial worng position issue
  const [selectedNodes, setSelectedNodes] = useNodesState<null>([]);
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({
    x: 0,
    y: 0,
  });

  const handleMouseClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("Mouse click is called");
    const { clientX, clientY } = event;

    setMousePosition({ x: clientX, y: clientY });
  };

  function createIntitialNodes() {
    const initialNodes: Node[] = [];
    const createdNodes = createNodes(global.settings.traversalStrategy);
    for (const node of createdNodes) {
      initialNodes.push(node);
    }
    return initialNodes;
  }

  function createNodes(traversal: TraversalElement[]) {
    const createdNodes: Node[] = [];
    let prevNode;

    for (const elem of traversal) {
      if (elem.element.id === "group") {
        const nodesWithinGroup: Node[] = [];
        const visuals = elem.element.visuals;

        for (let i = 0; i < visuals.length; i++) {
          for (let j = 0; j < visuals[i].length; j++) {
            const visTitle = getTitle(visuals[i][j]);
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
    return createdNodes;
  }

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

  const onClick = useCallback(
    async (event) => {
      // here we need to update the reactFlowWrapper and Instance

      const container = document.getElementById("canvas-container");
      event.target.classList.contains("react-flow__pane")
        ? container?.classList.remove("show")
        : container?.classList.add("show");

      const fullNameArray = defaultNode().getFullNodeNameArray(event);
      const basicName = defaultNode().getBasicName(event);
      // at this point, we know what the element was
      // we just need to get it to the save annotation changes

      switch (basicName) {
        case "dashboard":
          getDashboardInfoInEditor(1);
          break;
        case "globalFilter":
          await getFilterInfoInEditor(1);
          break;
        case "group":
          break;
        default:
          if (fullNameArray) {
            await getVisualInfoInEditor(fullNameArray, 1);
          }
          break;
      }
    },
    [defaultNode]
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
    [nodes, getPosition, defaultNode, setNodes]
  );

  function getCount(id: string) {
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
        (node) => node.id.split(" ").length < 4 && node.id.split(" ")[0] === id
      );
    }

    if (sameNodes.length > 0) {
      const max = Math.max(
        ...sameNodes.map((node) => parseInt(node.id.split(" ")[index]))
      );
      count += max;
    }

    return count;
  }

  const onNodeDragStart = useCallback(
    (event, node) => {
      const intersections = getIntersectingNodes(node).map((n) => n.id);

      //check if the node is dropped to the group
      setNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          className: intersections.includes(n.id) ? "highlight" : "",
        }))
      );
      props.setNodesForSave(nodes);
    },
    [getIntersectingNodes, setNodes]
  );

  const onNodeDragStop = (event: any, node: Node) => {
    console.log("Node pos", node.position);

    if (node.type == "group") {
      nodes.forEach((sNode) => {
        if (sNode.parentNode == node.id) {
          console.log(sNode.positionAbsolute); // --> this is not getting updated
        }
      });
    }
  };

  const onNodeMouseEnter = (e: any, node: Node) => {
    if (node.type === "group") {
    }
    setNodeData(node);
  };

  const onSelectionContextMenu = useCallback(
    (event, sNodes: Node[]) => {
      event.preventDefault();

      const position = getPosition(event);
      setPosition({
        x: position.x,
        y: position.y,
      });

      setSelectedNodes(sNodes);
      setIsOpen(true);
    },
    [getPosition, setSelectedNodes]
  );

  const onNodeContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      const position = getPosition(event);
      setPosition({
        x: position.x,
        y: position.y,
      });
      setIsOpen(true);
    },
    [getPosition]
  );

  const deleteNode = useCallback(() => {
    if (nodeData?.type === "group") {
      setNodes((nodes) => nodes.filter((n) => n.parentNode !== nodeData.id));
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    } else if (nodeData?.type === "default") {
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    }
    setIsOpen(false);
  }, [nodes]);

  const addGroup = useCallback(() => {
    try {
      let noGroup = false;

      selectedNodes.forEach((sNode) => {
        if (sNode.type == "group") {
          noGroup = true;
        }
      });

      if (noGroup) {
        return;
      }

      const count = getCount("group");

      const groupNodeObj = new GroupNode({
        nodes: selectedNodes,
        id: "group " + count,
        position: { x: 0, y: 0 },
        data: null,
      });
      const groupNode = groupNodeObj.getGroupNode(
        true,
        { x: 0, y: 0 },
        groupType.all
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

      console.log("Nodes", nodes);
      console.log("Selected Nodes", selectedNodes);
    } catch (error) {
      console.log("Error", error);
    }
  }, [nodes, selectedNodes, setNodes]);

  useEffect(() => {
    if (props.trigger) {
      console.log("q", props.traversal);
      buildTraversal(props.traversal);
    }
  }, [props.trigger]);

  useEffect(() => {
    props.setNodesForSave(nodes);
  }, [nodes]);

  function buildTraversal(traversal: any) {
    setNodes([]);

    const createdNodes = createNodes(traversal);

    for (const node of createdNodes) {
      setNodes((nds) => nds.concat(node));
    }
  }

  function getPositionForWholeTrav(prevNode: any) {
    let pos = {
      x: 0,
      y: 0,
    };

    if (prevNode) {
      const offset = 5;
      const prevNodeHeight = parseInt(String(prevNode.style?.height!), 10);
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
    }
    return type;
  }

  function getTitle(elem: TraversalElement) {
    let visTitle = "";
    switch (elem.element.id) {
      case "dashboard":
        visTitle = "Dashboard";
        break;
      case "globalFilter":
        visTitle = "Global Filters";
        break;

      default:
        const vis = findTraversalVisual(elem.element.id);
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
          newTitle = "Column Chart";
          break;
        case "clusteredBarChart":
          newTitle = "Bar Chart";
          break;
        case "clusteredColumnChart":
          newTitle = "ColumnChart";
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

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          // onInit={setReactFlowInstance}
          nodes={nodes}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onClick={onClick}
          onDragOver={onDragOver}
          onNodesChange={onNodesChange}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeContextMenu={onNodeContextMenu}
          onSelectionContextMenu={onSelectionContextMenu}
          snapToGrid
          fitView
        >
          <Controls />
          <ContextMenu
            isOpen={isOpen}
            onClick={handleMouseClick}
            position={position}
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
