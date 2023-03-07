import React, {useEffect} from "react";
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {FaPencilAlt} from "react-icons/fa";
import ReactFlow, {ReactFlowProvider} from "reactflow";
import {
    ResizeContent, ResizeHandleLeft,
    ResizeHandleRight,
    ResizePanel,
} from "react-hook-resize-panel";
import Onboarding from "../../../pages/onboarding";


import NodesCanvas from "../nodesCanvas";

import "../../assets/css/dashboard.scss";
import { setDivisor } from "../../../onboarding/ts/sizes";
import { allVisuals } from "../../../onboarding/ts/globalVariables";

const Dashboard = () => {
    useEffect(() => {
        const cardElements = allVisuals.filter(function (visual) {
            return visual.type == "card";
        });
        const cardElementsLength = cardElements.length;
        let index = 0;
        for(const vis of allVisuals){
            let visTitle = createNodeTitle(vis.type);
            if(vis.type == 'card') {
                if (cardElementsLength > 1) {
                index = index + 1;
                visTitle = visTitle + index;
                }
            }

            createComponentNode({ id: vis.name, classes: `dndnode`, content: `${visTitle}`, parentId: "componentNodes" });
            switch(vis.type){
                case "card":
                    createComponentNode({ id: vis.name + " insight", classes: `dndnode`, content: `${visTitle} insight`, function: "", parentId: "subcomponentNodes" });
                    break;
                case "slicer":
                    createComponentNode({ id: vis.name + " interaction", classes: `dndnode`, content: `${visTitle} interaction`, function: "", parentId: "subcomponentNodes" });
                    break;
                default:
                    createComponentNode({ id: vis.name + " interaction", classes: `dndnode`, content: `${visTitle} interaction`, function: "", parentId: "subcomponentNodes" });
                    createComponentNode({ id: vis.name + " insight", classes: `dndnode`, content: `${visTitle} insight`, function: "", parentId: "subcomponentNodes" });
            }
        }
    }, []);

    // TODO #1
    function createIndex(allVisuals) {
        const cardElements = allVisuals.filter(function (visual) {
            return visual.type == "card";
        });
        const cardElementsLength = cardElements.length;
    }

    function createNodeTitle(title, index='') {
        let newTitle = title;
        switch(title){
            case "card":
                newTitle = 'KPI';
                break;
            case "slicer":
                newTitle = 'Filter';
                break;
            case "lineClusteredColumnComboChart":
                newTitle = 'Column';
                break;
            case "clusteredBarChart":
                    newTitle = 'Bar';
                    break;
            case "lineChart":
                    newTitle = 'Line';
                    break;
            default:
                newTitle = title;

        }
        newTitle = newTitle + index;
        return  newTitle;
    }

    function createComponentNode(attributes){
        const div = document.createElement('div');
        div.id = attributes.id;
        div.className = attributes.classes + ' ' + attributes.content;
        div.innerHTML = attributes.content;
        div.setAttribute("draggable", "true");
        div.addEventListener("dragstart", function(){
            onDragStart(event, "simple", attributes.id, attributes.content, attributes.content);
        });

        document.getElementById(attributes.parentId)?.appendChild(div);
    }

    const onDragStart = (event, nodeType, nodeId, nodeData, title) => {
        event.dataTransfer.setData('nodeType', nodeType);
        event.dataTransfer.setData('id', nodeId);
        event.dataTransfer.setData('data', nodeData);
        event.dataTransfer.setData('title', title);
        event.dataTransfer.effectAllowed = 'move';
    };
    const saveAnnotationChanges = (e) => {
        e.preventDefault();
    }




    const [checked, setChecked] = React.useState(true);

    setDivisor(3);

    return (
        <div className="d-board" style={{flexFlow: "row nowrap", flexGrow: 1, display: "flex"}}>
            <ResizePanel className="component-cont" initialWidth={250} maxWidth={400} minWidth={250}>
                <ResizeContent>
                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Traversal strategies</Accordion.Header>
                            <Accordion.Body>
                                <Form>
                                    <div key={`default-checkbox`} className="mb-3">
                                        <Form.Check
                                            type="radio"
                                            name="traversal"
                                            id="depth-first"
                                            label="Depth first"
                                            className="check-button"
                                            defaultChecked={checked}
                                            onChange={() => setChecked(!checked)}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="traversal"
                                            id="custom"
                                            label="Custom"
                                            className="check-button"
                                        />

                                    </div>
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Components</Accordion.Header>
                            <Accordion.Body>
                                <aside id="componentNodes">
                                    <div className="description">You can drag these nodes to the pane on the right.
                                    </div>
                                    <div className="dndnode node-group"
                                         onDragStart={(event) => onDragStart(event, 'group', "group")}
                                         draggable>
                                        Group
                                    </div>
                                </aside>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Subcomponents</Accordion.Header>
                            <Accordion.Body>
                                <aside id="subcomponentNodes">
                                    <div className="description">You can drag these nodes to the pane on the right.
                                    </div>
                                </aside>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </ResizeContent>
                <ResizeHandleRight className="resize">
                    <div className="col-resize"/>
                </ResizeHandleRight>
            </ResizePanel>

            <div id="canvas-container" className="canvas-cont" style={{flexGrow: 1}}>
                <div className="flow">
                    <ReactFlowProvider>
                        <NodesCanvas/>
                    </ReactFlowProvider>
                </div>
                <div id="annotation-box" className="text-end">
                    <div className="input-group">
                        <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon">
                      <FaPencilAlt/>
                    </span>
                        </div>
                        <textarea
                            id="textBox"
                            className="form-control"
                            rows="4"/>
                    </div>
                    <div className="btn btn-secondary btn-sm me-auto" onClick={saveAnnotationChanges}>Save changes</div>
                </div>
            </div>

            <div style={{width: "400px", borderLeft: "double gray"}}>
                <Tabs
                    defaultActiveKey="output"
                    id=""
                    className="mb-3"
                    justify>
                    <Tab eventKey="output" title="Output view">
                        <div style={{color: "black"}}>
                            <Onboarding/>
                        </div>
                    </Tab>
                    <Tab eventKey="story" title="Story text">
                        <div className="px-4">
                            Content
                        </div>
                    </Tab>
                    <Tab eventKey="settings" title="Settings">
                        <div className="px-4">
                            Content
                        </div>
                    </Tab>
                </Tabs>
            </div>
            <div/>
        </div>
    );
};

export default Dashboard;
