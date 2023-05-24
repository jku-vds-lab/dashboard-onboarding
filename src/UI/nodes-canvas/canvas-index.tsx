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
import { TraversalElement, findTraversalVisual } from "../../onboarding/ts/traversal";

// import ICustomNode from "./nodeTypes/ICustomNode";
import { ContextMenu } from "./context-menu";

import Traversal from "./traversal";

import { getVisualInfoInEditor } from "../../onboarding/ts/infoCards";
import { getDashboardInfoInEditor } from "../../onboarding/ts/dashboardInfoCard";
import { getFilterInfoInEditor } from "../../onboarding/ts/filterInfoCards";

import GroupNode from "./nodes/groupNode";
import GroupNodeType from "./nodes/groupNodeType";
import DefaultNode from "./nodes/defaultNode";

const nodeTypes = { group: GroupNodeType };

interface Props{
  trigger:number
  traversal:any
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
  const [groupId] = useState({ id: 0 });

  function createIntitialNodes(){
    const initialNodes: Node[] = [];
    for(const { index, elem } of global.settings.traversalStrategy.map((elem:TraversalElement, index:number) => ({ index, elem }))){
      const visTitle = getTitle(elem);
      const visType = getType(visTitle);
      const newNode = defaultNode().getNode(
        event,
        visType,
        getID(elem),
        "default",
        getPositionForWholeTrav(position, index),
        visTitle
      );
      initialNodes.push(newNode);
    } 
    return initialNodes;
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

  useEffect(() => {
    if (props.trigger) {
      console.log("q", props.traversal)
      buildTraversal(props.traversal);
    }
  }, [props.trigger]);

  function buildTraversal(traversal: any){
    setNodes([]);

    const position = {
        x: 0,
        y: 50,
    };

    for(const { index, elem } of traversal.map((elem:TraversalElement, index:number) => ({ index, elem }))){
        const visTitle = getTitle(elem);
        const visType = getType(visTitle);
        const newNode = defaultNode().getNode(
          event,
          visType,
          getID(elem),
          "default",
          getPositionForWholeTrav(position, index),
          visTitle
        );
        setNodes((nds) => nds.concat(newNode));
    } 
}

function getPositionForWholeTrav(position:any, index:number){
  const offset = index * 35; 
  const pos = {
    x: position.x,
    y: position.y + offset,
  }
  return pos;
}

function getID(elem:TraversalElement){
  let id = elem.element.id;
  if(elem.categories.length === 1 && elem.categories[0] === "insight"){
      id += " Insight";
  }else if(elem.categories.length === 1 && elem.categories[0] === "interaction"){
      id += " Interaction";
  }

  return id; 
}

function getType(title:string){
  let type = title;
  if(title === "Global Filters"){
    type = "GlobalFilter";
  }
  return type;
}

function getTitle(elem:TraversalElement){
    let visTitle = "";
    switch(elem.element.id){
        case "dashboard":
            visTitle = "Dashboard";
            break;
        case "globalFilter":
            visTitle = "Global Filters";
            break;
        default:
            const vis = findTraversalVisual(elem.element.id);
            visTitle = createNodeTitle(vis.type);
            const itemLength = checkDuplicateComponents(vis.type);
            if (itemLength > 1) {
                visTitle = visTitle + " (" + vis.title + ")";
            }
    }
    if(elem.categories.length === 1 && elem.categories[0] === "insight"){
      visTitle += " Insight";
    }else if(elem.categories.length === 1 && elem.categories[0] === "interaction"){
      visTitle += " Interaction";
    }

    return visTitle;

    function checkDuplicateComponents(visType:string) {
        const componentItems = global.allVisuals.filter(function (visual) {
          return visual.type == visType;
        });
        return componentItems.length;
      }

    function createNodeTitle(title:string, index = "") {
    let newTitle = title;
    switch (title) {
        case "card":
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
