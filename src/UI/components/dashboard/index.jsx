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

const Dashboard = () => {
    useEffect(() => {
    }, []);
    const onDragStart = (event, nodeType, nodeData, title) => {
        event.dataTransfer.setData('nodeType', nodeType);
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
                                <aside>
                                    <div className="description">You can drag these nodes to the pane on the right.
                                    </div>
                                    <div className="dndnode dashboard"
                                         onDragStart={(event) => onDragStart(event, 'simple', 'dashboard', 'Dashboard')}
                                         draggable>
                                        Dashboard
                                    </div>
                                    <div className="dndnode bar-chart"
                                         onDragStart={(event) => onDragStart(event, 'simple', 'bar-chart', 'Bar chart')}
                                         draggable>
                                        Bar chart
                                    </div>
                                    <div className="dndnode line-chart"
                                         onDragStart={(event) => onDragStart(event, 'simple', 'line-chart', 'Line chart')}
                                         draggable>
                                        Line chart
                                    </div>
                                    <div className="dndnode node-group"
                                         onDragStart={(event) => onDragStart(event, 'group', )}
                                         draggable>
                                        Group
                                    </div>
                                </aside>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Subcomponents</Accordion.Header>
                            <Accordion.Body>
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
                        <div className="px-4" style={{color: "black"}}>
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
