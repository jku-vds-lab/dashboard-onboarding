import {useState, useRef, useCallback, MouseEvent} from "react";
import ReactFlow, {
    useNodesState, useEdgesState, Controls, updateEdge, addEdge, ReactFlowProvider, useReactFlow, Background, Node,
    Edge,
} from "reactflow";

import "reactflow/dist/style.css";
import "../../assets/css/flow.scss";

// Node types
import BoxNode from "./nodeTypes/boxNode";
import SimpleNode from "./nodeTypes/simpleNode";
import GroupNode from "./nodeTypes/groupNode";
//Custom edge
import Path from "./path";

import {ContextMenu} from "./context-menu";

import Sidebar from '../dashboard/index';

const initialNodes = [
    {
        id: "node-1",
        type: "simple",
        position: {x: 0, y: 70},
        data: {title: "Dashboard", type: "dashboard"},
        parentNode: '',
        extent: 'parent'
    },
    {
        id: "node-2",
        type: "simple",
        targetPosition: "top",
        position: {x: 120, y: 70},
        data: {title: "Line Chart", type: "line-chart"},
        extent: 'parent',
        parentNode: ''
    },
    {
        id: 'node-3',
        type: 'group',
        data: { label: 'Group' },
        position: { x: 240, y: 0 },
    },
    {
        id: "node-4",
        type: "simple",
        targetPosition: "top",
        position: {x: 30, y: 60},
        data: {title: "Bar chart", type: "bar-chart"},
        extent: 'parent',
        parentNode: 'node-3',
    },
    {
        id: "node-5",
        type: "simple",
        targetPosition: "top",
        position: {x: 140, y: 60},
        data: {title: "Bar chart", type: "bar-chart"},
        extent: 'parent',
        parentNode: 'node-3',
    },
    {
        id: "node-6",
        type: "simple",
        targetPosition: "top",
        position: {x: 30, y: 110},
        data: {title: "Dashboard", type: "dashboard"},
        extent: 'parent',
        parentNode: 'node-3',
    },
    {
        id: "node-7",
        type: "simple",
        targetPosition: "top",
        position: {x: 140, y: 110},
        data: {title: "Line chart", type: "line-chart"},
        extent: 'parent',
        parentNode: 'node-3',
    },

];
/** Create edges between nodes if needed*/
const initialEdges = [
    /*{
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        sourceHandle: "output-4",
        animated: true,
    },
    {
        id: "edge-3",
        source: "node-1",
        target: "node-3",
        sourceHandle: "output-1",
        targetHandle: "input-1",
        type: 'path',
        data: { n_source: "1", n_target: "3", h_output: "1", h_input: "1", color: "#f1ed00", class: "story-1"},
        deletable: true,
    }*/
];


// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {boxNode: BoxNode, simple: SimpleNode, group: GroupNode};
const edgeTypes = {
    path: Path,
};
let id = 0;
const getId = () => `dndnode_${id++}`;

function NodesCanvas() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { getIntersectingNodes, deleteElements } = useReactFlow();
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [position, setPosition] = useState({x:0, y:0});
    const [isOpen, setIsOpen] = useState(false);
    /**
     * Called after end of edge gets dragged to another source or target
     * @type {function(*=, *=): void}
     */
    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => {

            //TODO: create a method to return nodeTarget, inputHandle, sourceTarget, outputHandle

            //reset the color
            let nodeTarget = document.querySelector('[data-id="'+oldEdge.target+'"]');
            let inputHandle = nodeTarget.querySelector('[data-handleid="'+oldEdge.targetHandle+'"]');
            inputHandle.classList.add("empty");
            //if the new connection is not empty
            nodeTarget = document.querySelector('[data-id="'+newConnection.target+'"]');
            inputHandle = nodeTarget.querySelector('[data-handleid="'+newConnection.targetHandle+'"]');

            if(inputHandle.classList.contains("empty")){
                //connect
            }

            //get path color
            let nodeSource = document.querySelector('[data-id="'+newConnection.source+'"]');
            let outputHandle = nodeSource.querySelector('[data-handleid="'+newConnection.sourceHandle+'"]');
            inputHandle.classList.remove("empty");
            inputHandle.style.background=outputHandle.style.background;


            setEdges((els) => updateEdge(oldEdge, newConnection, els))},
        []
    );
  /**
     * Called when user starts to drag connection line.
     * We need to assign a color that correspond to the input color, when available.
     * On the very first node the color is assigned randomly.
     * @type {(function(*=): void)|*}
     */
    const onConnectStart = useCallback(
        (params) => {
            //get an available color from the node
            params.target.style.background = "#1ab41e";

        },
        [],
    );

    const onConnectEnd = useCallback(
        (params) => {
            //params.target.style.background = "#1ab41e"

        },
        [],
    );


    /**
     *Called when user connects two nodes
     * @type {function(*=): void}
     */
    const onConnect = useCallback((params) => {

        const nodeSource = document.querySelector('[data-id="'+params.source+'"]');
        const nodeTarget = document.querySelector('[data-id="'+params.target+'"]');
        let outputHandle = nodeSource.querySelector('[data-handleid="'+params.sourceHandle+'"]');
        let inputHandle = nodeTarget.querySelector('[data-handleid="'+params.targetHandle+'"]');
        inputHandle.style.background = outputHandle.style.background;
        setEdges((els) => addEdge(params, els))
        //finding the path to assign the color
        //data-testid="rf__edge-reactflow__edge-node-1output-3-node-4input-3
        //var path = document.querySelector('[data-testid="rf__edge-reactflow__edge-'+params.source+params.sourceHandle+params.target+params.targetHandle+'"]');

    }, []);

    const onClick = useCallback((event) => {

    }, []);



    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('nodeType');
            const data = event.dataTransfer.getData('data');
            const title = event.dataTransfer.getData('title');


            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }


          const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: {
                    title: title,
                    type: data,
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );



    /**
     * Called, when the node is clicked – do something
     * @type {(function(): void)|*}
     */
    const onNodeClick = useCallback(
        (event) => {
            let container = document.getElementById('canvas-container');
            (event.target.classList.contains('react-flow__pane'))?container.classList.remove('show'):container.classList.add('show');

            //when the options button on a group node clicked, set the index of the child nodes to 0,
            // and change the connection type
            if(event.target.classList.contains('options')){

            }

        },
        [],
    );

    const onNodeDrag = useCallback((_: MouseEvent, node: Node) => {
        console.log(node);
        const intersections = getIntersectingNodes(node).map(
            (n) => n.id);
        getIntersectingNodes(node).forEach(function (n){
            console.log(n.type);
            if(n.type === "group"){
                node.parentNode = 'node-3';

            }
        })

        //check if the node is dropped to the group


        setNodes((ns) =>
            ns.map((n) => ({
                ...n,
                className: intersections.includes(n.id) ? 'highlight' : '',
            }))
        );
    }, []);


    /**
     * Called when nodes get deleted. The handles are updated. The narrative trajectory is broken.
     May be we need to highlight the nodes to indicate the broken linkage
     * @type {(function(): void)|*}
     */
    const onNodesDelete = useCallback(
        () => {

        },
        [],
    );
    /**
     * Called when user clicks an edge. The storyline can be rendered in the presentation editor
     * @type {(function())|*}
     */
    const onEdgeClick = useCallback(
        () => {

        },
        [],
    );

    const onLoad = useCallback(
        () => {
            //n-button options

        },
        [],
    );


    const onNodeContextMenu = useCallback(
        (e) => {
            e.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            setPosition({x:e.clientX - reactFlowBounds.left, y:e.clientY- reactFlowBounds.top});
            setIsOpen(true);
        },
        [],
    );

    /*const onNodeContextMenu = useCallback((_: MouseEvent, node: Node) => {
        console.log(node);
        e.preventDefault();
    }, []);
*/

    const deleteNode = () => {
       //TODO: delete the node from canvas
       setIsOpen(false);
    };


    return (
        <div className="dndflow">
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onClick={onClick}
            onNodeDrag={onNodeDrag}
            onLoad={onLoad}
            onNodeContextMenu={onNodeContextMenu}
            snapToGrid
            fitView
        >
            <Controls />
            <ContextMenu isOpen={isOpen} position={position}
                         onMouseLeave={()=>setIsOpen(false)}
            actions={[{label: 'Delete', effect:deleteNode}]}>

            </ContextMenu>
        </ReactFlow>
        </div>

        </div>
    );
}

export default NodesCanvas;
