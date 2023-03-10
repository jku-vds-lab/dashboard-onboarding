import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ReactFlowProvider } from "reactflow";
import NodesCanvas from "../nodes-canvas/canvas-index";
import "../assets/css/dashboard.scss";

export default function StoryPane() {
  const saveAnnotationChanges = (e) => {
    e.preventDefault();
  };

  return (
    <div id="canvas-container" className="canvas-cont" style={{ flexGrow: 1 }}>
      <div className="flow">
        <ReactFlowProvider>
          <NodesCanvas />
        </ReactFlowProvider>
      </div>
      <div id="annotation-box" className="text-end">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon">
              <FaPencilAlt />
            </span>
          </div>
          <textarea id="textBox" className="form-control" rows="4" />
        </div>
        <div
          className="btn btn-secondary btn-sm me-auto"
          onClick={saveAnnotationChanges}
        >
          Save changes
        </div>
      </div>
    </div>
  );
}
