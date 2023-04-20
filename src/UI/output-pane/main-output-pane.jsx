import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Onboarding from "../../pages/onboarding";
import "../assets/css/dashboard.scss";
import {
  ResizeContent,
  ResizeHandleLeft,
  ResizePanel,
} from "react-hook-resize-panel";
import OutputView from "../../pages/outputView";
import { reloadOnboarding } from "../../onboarding/ts/onboarding";

export default function OutputPane() {
  return (
    <ResizePanel
      className="output-menu"
      initialWidth={400}
      maxWidth={800}
      minWidth={400}
    >
      <ResizeHandleLeft className="resize" onClick ={reloadOnboarding}>
        <div className="col-resize" />
      </ResizeHandleLeft>
      <ResizeContent>
        <Tabs defaultActiveKey="output" id="" justify>
          <Tab eventKey="output" title="Output view">
            <div id="outputView" style={{ color: "black", backgroundColor: "white"}}>
              <OutputView />
            </div>
          </Tab>
          <Tab eventKey="story" title="Story text">
            <div className="px-4">Content</div>
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <div className="px-4">Content</div>
          </Tab>
        </Tabs>
      </ResizeContent>
    </ResizePanel>
  );
}
