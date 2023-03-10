import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Onboarding from "../../pages/onboarding";
import "../assets/css/dashboard.scss";

export default function OutputPane() {
  return (
    <div style={{ width: "400px", borderLeft: "double gray" }}>
      <Tabs defaultActiveKey="output" id="" className="mb-3" justify>
        <Tab eventKey="output" title="Output view">
          <div style={{ color: "black" }}>
            <Onboarding />
          </div>
        </Tab>
        <Tab eventKey="story" title="Story text">
          <div className="px-4">Content</div>
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <div className="px-4">Content</div>
        </Tab>
      </Tabs>
    </div>
  );
}
