import { useState, useRef, useCallback } from "react";
import ReactFlow, { useNodesState, Controls, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import "../assets/css/flow.scss";

import SimpleNode from "./nodeTypes/simpleNode";
import GroupNode from "./nodeTypes/groupNode";

import { ContextMenu } from "./context-menu";

import * as helpers from "../../onboarding/ts/helperFunctions";
import { getVisualInfos } from "../../onboarding/ts/listOfVisuals";
import Traversal from "./traversal";

const initialNodes = [];

const nodeTypes = { simple: SimpleNode, group: GroupNode };

export default function NodesCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { getIntersectingNodes } = useReactFlow();
  const [nodeData, setNodeData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [selectedNodes, setSelectedNodes] = useNodesState(initialNodes);
  const [groupId] = useState({ id: 0 });

  const onClick = useCallback(async (event) => {
    let container = document.getElementById("canvas-container");
    event.target.classList.contains("react-flow__pane")
      ? container.classList.remove("show")
      : container.classList.add("show");

    let nodeId;
    if (event.target.classList.contains("title")) {
      nodeId =
        event.target.parentNode.parentNode.parentNode.getAttribute("data-id");
    } else if (event.target.classList.contains("header")) {
      nodeId = event.target.parentNode.parentNode.getAttribute("data-id");
    } else {
      nodeId = event.target.parentNode.getAttribute("data-id");
    }

    const idParts = nodeId?.split(" ");
    let visualData = null;
    if (!idParts) {
      return;
    }

    if (idParts.length > 0) {
      visualData = helpers?.getDataWithId(idParts[0]);
    }

    if (!visualData) {
      return;
    }
    const visualInfos = await getVisualInfos(visualData);

    let info;
    if (idParts.length > 1 && idParts[1] == "Insight") {
      info = visualInfos.insightInfos.join("\r\n");
    } else if (idParts.length > 1 && idParts[1] == "Interaction") {
      info = visualInfos.interactionInfos.join("\r\n");
    } else {
      info = visualInfos.generalInfos.join("\r\n");
    }
    info = info.replaceAll("<br>", "\r\n");
    document.getElementById("textBox").value = info;
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const id = event.dataTransfer.getData("id");
      const type = event.dataTransfer.getData("nodeType");
      const data = event.dataTransfer.getData("data");
      const title = event.dataTransfer.getData("title");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id,
        type,
        position,
        data: {
          title: title,
          type: data,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeDragStart = useCallback((event, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);

    getIntersectingNodes(node).forEach((iNode) => {
      if (iNode.type === "group") {
        node.parentNode = "node-3";
      }
    });

    //check if the node is dropped to the group
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? "highlight" : "",
      }))
    );
  }, []);

  const onNodeMouseEnter = (e, node) => {
    if (node.type === "group") {
    }
    setNodeData(node);
  };

  const onSelectionContextMenu = useCallback(
    (e, sNodes) => {
      e.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - reactFlowBounds.left,
        y: e.clientY - reactFlowBounds.top,
      });

      setSelectedNodes(sNodes);
      setIsOpen(true);
    },
    [setSelectedNodes]
  );

  const onNodeContextMenu = useCallback((e) => {
    e.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - reactFlowBounds.left,
      y: e.clientY - reactFlowBounds.top,
    });
    setIsOpen(true);
  }, []);

  const deleteNode = () => {
    if (nodeData.type === "group") {
      setNodes((nodes) => nodes.filter((n) => n.parentNode !== nodeData.id));
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    } else {
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    }
    setIsOpen(false);
  };

  const createGroupNode = useCallback(() => {
    let groupNode = null;
    try {
      let minX = 10000;
      let minY = 10000;
      let maxX = 0;
      let maxY = 0;
      let nodeWidth = 0;
      let nodeHeight = 0;
      selectedNodes.forEach((node) => {
        if (node.position.x < minX) {
          minX = node.position.x;
        }
        if (node.position.x > maxX) {
          maxX = node.position.x;
        }
        if (node.position.y < minY) {
          minY = node.position.y;
        }
        if (node.position.y > maxY) {
          maxY = node.position.y;
        }
        nodeWidth = node.width;
        nodeHeight = node.height;
      });
      let width = 0;
      let height = 0;
      let offset = 40;
      let minHeight = 70 + nodeHeight;
      let minWidth = nodeWidth + offset;

      width = maxX - minX + minWidth;
      height = maxY - minY + minHeight;
      if (height < 0) {
        height = -height;
      }

      const position = { x: minX - offset, y: minY - offset };
      groupNode = {
        id: "group" + groupId.id++,
        type: "group",
        position,
        data: {
          title: "group node",
          type: "group",
        },
        className: "dndnode node-group",
        style: { width: width, height: height },
        zIndex: -1,
      };

      setNodes((nds) => nds.concat(groupNode));
    } catch (error) {
      console.log("Error", error);
    }
    return groupNode;
  }, [groupId, selectedNodes, setNodes]);

  const addGroup = useCallback(() => {
    try {
      let groupNode = createGroupNode();

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
  }, [createGroupNode, nodes, selectedNodes]);

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          onInit={setReactFlowInstance}
          nodes={nodes}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onClick={onClick}
          onDragOver={onDragOver}
          onNodesChange={onNodesChange}
          onNodeDragStart={onNodeDragStart}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeContextMenu={onNodeContextMenu}
          onSelectionContextMenu={onSelectionContextMenu}
          snapToGrid
          fitView
        >
          <Controls />
          <ContextMenu
            isOpen={isOpen}
            position={position}
            onMouseLeave={() => setIsOpen(false)}
            actions={[
              { label: "Delete", effect: deleteNode },
              { label: "Group", effect: addGroup },
            ]}
          ></ContextMenu>
        </ReactFlow>
        <Traversal nodes={nodes} />
      </div>
    </div>
  );
}
