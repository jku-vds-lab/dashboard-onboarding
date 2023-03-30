import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ReactFlowProvider } from "reactflow";
import NodesCanvas from "../nodes-canvas/canvas-index";
import "../assets/css/dashboard.scss";
import * as global from "../../onboarding/ts/globalVariables";
import { replacer } from "../../componentGraph/ComponentGraph";
import { saveFilterChanges, resetFilterChanges } from "../../onboarding/ts/editFilters";
import { saveDashboardChanges, resetDashboardChanges } from "../../onboarding/ts/dashboardInfoCard";
import { saveVisualChanges, resetVisualChanges } from "../../onboarding/ts/infoCards";
import { showInOutputView, showExplanation } from "../nodes-canvas/canvas-index";

export default function StoryPane() {
  const saveAnnotationChanges = async () => {
    let newInfo = document.getElementById("textBox").value;
    newInfo = newInfo.replaceAll("\r\n", "<br>");
    newInfo = newInfo.split("\n\n");

    const idParts = getIdParts();

    await setChangedSettings(newInfo, idParts);

    await refreshEditorInfo(idParts);

    localStorage.setItem('settings', JSON.stringify(global.settings, replacer));
  };

  async function setChangedSettings(newInfo, idParts){
    switch(idParts[0]){
      case "dashboard":
        saveDashboardChanges(newInfo);
        break;
      case "globalFilter":
        await saveFilterChanges(newInfo);
        break;
      default:
        await saveVisualChanges(newInfo, idParts);
        break;
    }
  }

  const resetAnnotationChanges = async () => {
    const idParts = getIdParts();

    await resetSettings(idParts);
    localStorage.setItem('settings', JSON.stringify(global.settings, replacer));

    await refreshEditorInfo(idParts);
  };

  function getIdParts(){
    const selectedNode = document.querySelector(".react-flow__nodes .selected");
    if(!selectedNode){
      return;
    }
    const nodeId = selectedNode.getAttribute("data-id");
    const idParts = nodeId.split(" ");
    return idParts;
  }

  async function resetSettings(idParts){
    switch(idParts[0]){
      case "dashboard":
        resetDashboardChanges();
        break;
      case "globalFilter":
        await resetFilterChanges();
        break;
      default:
        await resetVisualChanges(idParts);
        break;
    }
  }

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
          className="btn btn-secondary btn-sm mr-4"
          onClick={resetAnnotationChanges}
        >
          Reset
        </div>
        <div
          className="btn btn-secondary btn-sm"
          onClick={saveAnnotationChanges}
        >
          Save changes
        </div>
      </div>
    </div>
  );
}
