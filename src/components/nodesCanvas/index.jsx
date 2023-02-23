import {useState, useRef, useCallback} from "react";

import ReactFlow, {
    useNodesState, useEdgesState, Controls, updateEdge, addEdge, ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";
import "../../assets/css/flow.scss";

// Node types
import BoxNode from "./nodeTypes/boxNode";
import SimpleNode from "./nodeTypes/simpleNode";
//Custom edge
import Path from "./path";

import Sidebar from '../dashboard/index';

const initialNodes = [
    {
        id: "node-1",
        type: "simple",
        position: {x: 0, y: 70},
        data: {title: "Dashboard", type: "dashboard"},
    },
    {
        id: "node-2",
        type: "simple",
        targetPosition: "top",
        position: {x: 120, y: 70},
        data: {title: "Line Chart", type: "line-chart"},
    },
    {
        id: 'node-3',
        data: { label: 'OR' },
        position: { x: 240, y: 0 },
        className: 'node-group',
    },
    {
        id: "node-4",
        type: "simple",
        targetPosition: "top",
        position: {x: 30, y: 40},
        data: {title: "Bar chart", type: "bar-chart"},
        parentNode: 'node-3',
    },
    {
        id: "node-5",
        type: "simple",
        targetPosition: "top",
        position: {x: 140, y: 40},
        data: {title: "Bar chart", type: "bar-chart"},
        parentNode: 'node-3',
    },
    {
        id: "node-6",
        type: "simple",
        targetPosition: "top",
        position: {x: 30, y: 110},
        data: {title: "Dashboard", type: "dashboard"},
        parentNode: 'node-3',
    },
    {
        id: "node-7",
        type: "simple",
        targetPosition: "top",
        position: {x: 140, y: 110},
        data: {title: "Line chart", type: "line-chart"},
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
    },
    {
        id: "edge-4",
        source: "node-1",
        target: "node-4",
        sourceHandle: "output-2",
        targetHandle: "input-1",
        deletable: true,
        label: "storyline 2",
        labelStyle: {fill: "white"},
        labelBgStyle: {fill: "#2b2b2b"},
    },*/
];


// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {boxNode: BoxNode, simple: SimpleNode};
const edgeTypes = {
    path: Path,
};
let id = 0;
const getId = () => `dndnode_${id++}`;

function NodesCanvas() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    /**
     * Called after end of edge gets dragged to another source or target
     * @type {function(*=, *=): void}
     */
    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => {

            //TODO: create a method to return nodeTarget, inputHandle, sourcetarget, outputHandle

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
        () => {
        },
        [],
    );


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


    return (
        <div className="dndflow">
        <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            snapToGrid
            fitView
        >
            <Controls />
        </ReactFlow>
        </div>
        </ReactFlowProvider>
        </div>
    );
}

export default NodesCanvas;
