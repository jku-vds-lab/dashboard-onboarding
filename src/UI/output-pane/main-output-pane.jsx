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
import UserLevel from "./userLevel";

export default function OutputPane() {
  return (
    <ResizePanel
      className="output-menu"
      initialWidth={400}
      maxWidth={800}
      minWidth={400}
    >
      <ResizeHandleLeft className="resize" onClick={reloadOnboarding}>
        <div className="col-resize" />
      </ResizeHandleLeft>
      <ResizeContent>
        <div id="outputView">
          <div className="label">Output View</div>
          <div
            id="outputView"
            style={{ color: "black", backgroundColor: "white" }}
          >
            <OutputView />
          </div>
        </div>
        <div id="userLevel">
          <div className="label">User Level</div>
          <div id="userMatrix">
            <UserLevel />
          </div>
        </div>
      </ResizeContent>
    </ResizePanel>
  );
}
