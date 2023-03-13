import { useState, useRef, useCallback, MouseEvent } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  useReactFlow,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import "../assets/css/flow.scss";

// Node types
import BoxNode from "./nodeTypes/boxNode";
import SimpleNode from "./nodeTypes/simpleNode";
import GroupNode from "./nodeTypes/groupNode";

import { ContextMenu } from "./context-menu";

import * as helpers from "../../onboarding/ts/helperFunctions";
import { getVisualInfos } from "../../onboarding/ts/listOfVisuals";

const initialNodes = [];

const nodeTypes = { boxNode: BoxNode, simple: SimpleNode, group: GroupNode };

// let id = 0;
// const getId = () => `dndnode_${id++}`;

function NodesCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeData, setNodeData] = useState(null);
  const { getIntersectingNodes } = useReactFlow();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);

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
    const visualData = helpers.getDataWithId(nodeId);
    if (!visualData) {
      return;
    }
    const visualInfos = await getVisualInfos(visualData);
    let info = visualInfos.generalInfos.join("\r\n");
    info = info.replaceAll("<br>", "\r\n");
    document.getElementById("textBox").value = info;
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      // debugger;
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

      console.log("Old position of ", id, "position", position);
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

  /**
   * Called, when the node is clicked – do something
   * @type {(function(): void)|*}
   */
  const onNodeClick = useCallback((event, el) => {
    /* if(el.selected) {
                 setNodes((nds) =>
                     nds.map((n) => {
                         if (n.id === el.id) {
                             n.selected = false
                         }
                         return n;
                     }));
             }*/
  }, []);

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

  const onNodeDragStop = (event, node) => {
    if (node) {
      getIntersectingNodes(node).forEach((iNode) => {
        if (iNode.type === "group") {
          const reactFlowBounds =
            reactFlowWrapper.current.getBoundingClientRect();
          console.log("Reactflowbounds", reactFlowBounds);
          // const position = reactFlowInstance.project({
          //   x:
          //     event.clientX -
          //     iNode.position.x -
          //     reactFlowBounds.left -
          //     node.width,
          //   y:
          //     event.clientY -
          //     iNode.position.y -
          //     reactFlowBounds.top -
          //     node.height,
          // });

          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          setNodes((nodes) =>
            nodes.map((n) => {
              if (n.id === node.id) {
                // it's important that you create a new object here
                // in order to notify react flow about the change
                n.parentNode = iNode.id;
                n.position = position;

                console.log("Node position", position.x, position.y);
              }
              console.log("All positions", n.position);
              return n;
            })
          );
        } else {
          setNodes((nodes) =>
            nodes.map((n) => {
              if (n.id === node.id) {
                n.parentNode = "";
              }
              return n;
            })
          );
        }
      });
    }
  };

  const onLoad = useCallback(() => {
    //n-button options
  }, []);

  const onNodeMouseEnter = (e, node) => {
    if (node.type === "group") {
    }
    setNodeData(node);
  };

  const onNodeContextMenu = useCallback((e) => {
    e.preventDefault();
    debugger;
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - reactFlowBounds.left,
      y: e.clientY - reactFlowBounds.top,
    });
    setIsOpen(true);
  }, []);

  const deleteNode = () => {
    if (nodeData.type === "group") {
      //delete children nodes
      setNodes((nodes) => nodes.filter((n) => n.parentNode !== nodeData.id));
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    } else {
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    }
    setIsOpen(false);
  };

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          // edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          // onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onClick={onClick}
          onNodeDragStart={onNodeDragStart} // this was onNodeDrag
          onLoad={onLoad}
          onNodeContextMenu={onNodeContextMenu}
          snapToGrid
          fitView
        >
          <Controls />
          <ContextMenu
            isOpen={isOpen}
            position={position}
            onMouseLeave={() => setIsOpen(false)}
            actions={[{ label: "Delete", effect: deleteNode }]}
          ></ContextMenu>
        </ReactFlow>
      </div>
    </div>
  );
}

export default NodesCanvas;
