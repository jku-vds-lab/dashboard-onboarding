import { useState, useRef, useCallback, CSSProperties, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  useReactFlow,
  ReactFlowInstance,
} from "reactflow";
import { Node } from "reactflow";
import "reactflow/dist/style.css";
import "../assets/css/flow.scss";

// import ICustomNode from "./nodeTypes/ICustomNode";
import { ContextMenu } from "./context-menu";

import Traversal from "./traversal";

import { getVisualInfoInEditor } from "../../onboarding/ts/infoCards";
import { getDashboardInfoInEditor } from "../../onboarding/ts/dashboardInfoCard";
import { getFilterInfoInEditor } from "../../onboarding/ts/filterInfoCards";

import { useUpdateNodeInternals } from "reactflow";
import GroupNode from "./nodes/groupNode";
import GroupNodeType from "./nodes/groupNodeType";
import DefaultNode from "./nodes/defaultNode";

const nodeTypes = { group: GroupNodeType };

export default function NodesCanvas() {
  const initialNodes: Node[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [setReactFlowInstance] = useState<ReactFlowInstance>();
  const reactFlowInstance = useReactFlow();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { getIntersectingNodes } = useReactFlow();
  const [nodeData, setNodeData] = useState<Node>();
  const [isOpen, setIsOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLInputElement>(null); // this could be the reason why we run into the initial worng position issue
  const [selectedNodes, setSelectedNodes] = useNodesState<null>([]);
  const [groupId] = useState({ id: 0 });
  const defaultNode = useCallback(() => {
    return new DefaultNode();
  }, []);

  //refactor reactflowbounds
  // then traversal file
  // then the file with traversal logic from onboarding side
  // then create a new feature which supports means

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

      const id = event.dataTransfer.getData("id");
      const type = event.dataTransfer.getData("nodeType");
      const visType = event.dataTransfer.getData("visType");
      const title = event.dataTransfer.getData("title");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

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
    [getPosition, defaultNode, setNodes]
  );

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

  const deleteNode = () => {
    if (nodeData?.type === "group") {
      setNodes((nodes) => nodes.filter((n) => n.parentNode !== nodeData.id));
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    } else if (nodeData?.type === "default") {
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    }
    setIsOpen(false);
  };

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

      const groupNodeObj = new GroupNode({
        nodes: selectedNodes,
        id: "group " + groupId.id++,
        position: { x: 0, y: 0 },
        data: null,
      });
      const groupNode = groupNodeObj.getGroupNode();
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
  }, [groupId.id, nodes, selectedNodes, setNodes]);

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
            position={position}
            onMouseLeave={() => setIsOpen(false)}
            actions={[
              { label: "Delete", effect: deleteNode },
              { label: "Group", effect: addGroup },
            ]}
          ></ContextMenu>
          <Traversal nodes={nodes} />
        </ReactFlow>
      </div>
    </div>
  );
}
