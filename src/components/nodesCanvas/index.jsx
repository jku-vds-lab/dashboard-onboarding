import {useCallback, useState} from "react";

import ReactFlow, {
    useNodesState, useEdgesState, Controls, updateEdge, addEdge
} from "reactflow";

import "reactflow/dist/style.css";
import "../../assets/css/flow.scss";

// Node types
import BoxNode from "./nodeTypes/boxNode";
//Custom edge
import Path from "./path";

const initialNodes = [
    {
        id: "node-1",
        type: "boxNode",
        position: {x: 0, y: 0},
        data: {title: "Dashboard", type: "dashboard"},
    },
    {
        id: "node-2",
        type: "output",
        targetPosition: "top",
        position: {x: 0, y: 200},
        data: {label: "Component"},
    },
    {
        id: "node-3",
        type: "boxNode",
        targetPosition: "top",
        position: {x: 300, y: 0},
        data: {title: "Line Chart", type: "line-chart"},
    },
    {
        id: "node-4",
        type: "boxNode",
        targetPosition: "top",
        position: {x: 300, y: 200},
        data: {title: "Bar chart", type: "bar-chart"},
    },

];

const initialEdges = [
    {
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
    },
];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {boxNode: BoxNode};
const edgeTypes = {
    path: Path,
};

function NodesCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            snapToGrid
            fitView
        />
    );
}

export default NodesCanvas;
