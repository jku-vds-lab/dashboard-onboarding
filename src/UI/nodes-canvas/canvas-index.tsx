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
import GroupNode from "./nodeTypes/groupNode";

export default function NodesCanvas() {
  const groupNodeObj = new GroupNode({
    id: "",
    nodes: [],
    data: null,
    position: { x: 0, y: 0 },
  });
  const nodeTypes = { group: groupNodeObj.groupNodeType };
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

  const getNodeBgColor = (type: string) => {
    let color = "";
    switch (type) {
      case "Dashboard":
        color = "#4e91e9";
        break;
      case "Line":
        color = "#d95f02";
        break;
      case "Bar":
        color = "#1b9e77";
        break;
      case "Filter":
        color = "#e7298a";
        break;
      case "KPI":
        color = "#7570b3";
        break;
      case "GlobalFilter":
        color = "#e25757";
        break;
      case "Column":
        color = "#66a61e";
        break;
      default:
        color = "#595959";
        break;
    }

    return color;
  };

  // const groupStyle = useCallback(() => {
  //   const gStyle: CSSProperties = {
  //     mygroup: {
  //       height: "100%",
  //       padding: "10px",
  //     },
  //     header: {
  //       display: "flex",

  //       justifyContent: "center",
  //       alignItems: "left",
  //       cursor: "-moz-grab",
  //       width: "100px",
  //       borderRadius: "4px",
  //       boxShadow: "0 0 4px #1a1717",
  //       fontSize: "10px",
  //     },
  //   };
  //   return gStyle;
  // }, []);

  const defaultStyle = useCallback(() => {
    const nodeStyle: CSSProperties = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "-moz-grab",
      width: "100px",
      height: "30px",
      borderRadius: "4px",
      boxShadow: "0 0 4px #1a1717",
      fontSize: "10px",
    };
    return nodeStyle;
  }, []);

  const getBasicName = useCallback((event: any, name?: string) => {
    let basicName: string = "";
    const nameArray = getFullNodeNameArray(event, name);
    if (nameArray?.length > 0) {
      basicName = nameArray[0];
    }
    return basicName;
  }, []);

  const onClick = useCallback(
    async (event) => {
      // here we need to update the reactFlowWrapper and Instance

      const container = document.getElementById("canvas-container");
      event.target.classList.contains("react-flow__pane")
        ? container?.classList.remove("show")
        : container?.classList.add("show");

      const fullNameArray = getFullNodeNameArray(event);
      const basicName = getBasicName(event);

      console.log("fullName Array", fullNameArray);
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
          await getVisualInfoInEditor(fullNameArray, 1);
          break;
      }
    },
    [getBasicName]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  function getFullNodeNameArray(event: any, name?: string) {
    let nodeName = "";
    let nameArray: string[] = [];
    if (name) {
      nodeName = name;
    } else {
      nodeName = event.target.getAttribute("data-id");
    }
    document?.getElementById("textBox")?.setAttribute("nodeId", nodeName);

    nameArray = nodeName?.split(" ");
    return nameArray;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds =
        reactFlowWrapper?.current?.getBoundingClientRect();
      const id = event.dataTransfer.getData("id");
      const type = event.dataTransfer.getData("nodeType");
      const visType = event.dataTransfer.getData("visType");
      const title = event.dataTransfer.getData("title");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const left = reactFlowBounds ? reactFlowBounds.left : 0;
      const top = reactFlowBounds ? reactFlowBounds.top : 0;

      const position = reactFlowInstance?.project({
        x: event.clientX - left,
        y: event.clientY - top,
      });

      const basicName = getBasicName(event, visType);
      const nodeStyle = defaultStyle();
      nodeStyle.backgroundColor = getNodeBgColor(basicName);
      console.log("here is the basic name", basicName);

      const newNode: Node = {
        id,
        type,
        position,
        data: {
          label: title,
          type: visType,
        },
        style: nodeStyle,
        selectable: true,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [getBasicName, reactFlowInstance, setNodes, defaultStyle]
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

  // we need this function to update node position
  function UpdateNodeButton(nodeId: string) {
    const updateNodeInternals = useUpdateNodeInternals();
    updateNodeInternals(nodeId);
  }

  const onNodeDragStop = (event: any, node: Node) => {
    console.log("Node pos", node.position);

    if (node.type == "group") {
      nodes.forEach((sNode) => {
        if (sNode.parentNode == node.id) {
          // UpdateNodeButton(sNode.id);
          // here we need to update the node position
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
    (e, sNodes: Node[]) => {
      // but this is not any. this is React.Dispatch<React.SetStateAction<Node<SimpleNodeDiv | GroupNodeDiv, string | undefined>[]>>
      e.preventDefault();
      const reactFlowBounds =
        reactFlowWrapper?.current?.getBoundingClientRect();
      const xBound = reactFlowBounds ? reactFlowBounds.left : 0;
      const yBound = reactFlowBounds ? reactFlowBounds.top : 0;

      setPosition({
        x: e.clientX - xBound,
        y: e.clientY - yBound,
      });

      setSelectedNodes(sNodes);
      setIsOpen(true);
    },
    [setSelectedNodes]
  );

  const onNodeContextMenu = useCallback((e) => {
    e.preventDefault();
    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
    const xBound = reactFlowBounds ? reactFlowBounds.left : 0;
    const yBound = reactFlowBounds ? reactFlowBounds.top : 0;
    setPosition({
      x: e.clientX - xBound,
      y: e.clientY - yBound,
    });
    setIsOpen(true);
  }, []);

  const deleteNode = () => {
    if (nodeData?.type === "group") {
      setNodes((nodes) => nodes.filter((n) => n.parentNode !== nodeData.id));
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    } else if (nodeData?.type === "default") {
      setNodes((nodes) => nodes.filter((n) => n.id !== nodeData.id));
    }
    setIsOpen(false);
  };

  const getLabelInfo = useCallback(
    (traverse: string, id: string) => {
      console.log(traverse);
      setNodes((nds: Node[]) =>
        nds.map((node: Node) => {
          if (node.id === id) {
            node.data = {
              ...node.data,
              traverse: traverse,
            };
          }

          return node;
        })
      );
    },
    [setNodes]
  );

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

      const gNodeObj = new GroupNode({
        nodes: selectedNodes,
        id: "group " + groupId.id++,
        position: { x: 0, y: 0 },
        data: null,
      });
      const groupNode = gNodeObj.getGroupNode();
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
