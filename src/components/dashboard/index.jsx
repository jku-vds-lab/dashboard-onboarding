import React, { useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import {
  ResizeContent, ResizeHandleLeft,
  ResizeHandleRight,
  ResizePanel,
} from "react-hook-resize-panel";


import NodesCanvas from "../nodesCanvas";

import "../../assets/css/dashboard.scss";

const Dashboard = () => {
  useEffect(() => {
  }, []);

  return (
      <div className="dashboard" style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}>
        <ResizePanel className="component-cont" initialWidth={300} maxWidth={400}>
          <ResizeContent>
              <Accordion>
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
                                  />
                                  <Form.Check
                                      type="radio"
                                      name="traversal"
                                      id="custom"
                                      label="Custom"
                                  />

                              </div>
                          </Form>
                      </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                      <Accordion.Header>Components</Accordion.Header>
                      <Accordion.Body>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                          aliquip ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                          culpa qui officia deserunt mollit anim id est laborum.
                      </Accordion.Body>
                  </Accordion.Item>
              </Accordion>

          </ResizeContent>
          <ResizeHandleRight className="resize">
            <div className="col-resize"/>
          </ResizeHandleRight>
        </ResizePanel>

        <div style={{ flexGrow: 1}}>
          <div className="flow">
            <NodesCanvas />
          </div>
        </div>

        <ResizePanel initialWidth={400} maxWidth={600}>
          <ResizeHandleLeft className="resize">
            <div className="col-resize" />
          </ResizeHandleLeft>
          <ResizeContent>
            <div className="inner">
            </div>
          </ResizeContent>
        </ResizePanel>
        <div />
      </div>
  );
};

export default Dashboard;
