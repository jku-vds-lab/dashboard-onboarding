import React from "react";
import {
  FaArrowAltCircleUp,
  FaCheck,
  FaPencilAlt,
  FaPeopleArrows,
  FaPlus,
  FaUndo,
} from "react-icons/fa";
import { ReactFlowProvider } from "reactflow";
import NodesCanvas from "../nodes-canvas/canvas-index";
import "../assets/css/dashboard.scss";
import { editedTexts } from "../../onboarding/ts/globalVariables";
import { resetVisualChanges } from "../../onboarding/ts/infoCards";
import { resetDashboardChanges } from "../../onboarding/ts/dashboardInfoCard";
import { resetFilterChanges } from "../../onboarding/ts/filterInfoCards";
import mediaIcon from "../assets/img/icon-7.png";
import OpenAI from "./main-open-ai";
import { useEffect, useState } from "react";
import RecordView from "./main-record";
import UploadVideo from "./main-upload-video";

interface Props {
  mainTrigger: number;
  traversal: any;
}

export default function StoryPane(props: Props) {
  const [trigger, setTrigger] = useState(0);
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  const saveAnnotationChanges = (e: any) => {
    console.log(e);
    const value = (document.getElementById("textBox")! as HTMLTextAreaElement)
      .value;
    const nodeId = e.target.getAttribute("nodeId");
    debugger;
    const currentIdParts = nodeId?.split(" ");
    const info = value.replaceAll(" \n", "<br>");
    const currentNewInfos = info.split("\n");

    let editedElem = null;
    if (currentIdParts.length > 2) {
      editedElem = editedTexts.find(
        (edited) =>
          edited.idParts[0] === currentIdParts[0] &&
          edited.idParts[2] === currentIdParts[2]
      );
    } else {
      editedElem = editedTexts.find(
        (edited) => edited.idParts[0] === currentIdParts[0]
      );
    }

    if (editedElem) {
      editedElem.newInfos = currentNewInfos;
    } else {
      editedTexts.push({
        newInfos: currentNewInfos,
        idParts: currentIdParts,
        count: 1,
      });
    }
  };

  const resetAnnotationChanges = async () => {
    let nodeId = document?.getElementById("textBox")?.getAttribute("nodeId");
    if (!nodeId) {
      nodeId = document?.getElementById("saveText")?.getAttribute("nodeId");
    }

    const currentIdParts = nodeId?.split(" ");
    if (!currentIdParts) {
      return;
    }
    switch (currentIdParts[0]) {
      case "dashboard":
        await resetDashboardChanges(1);
        break;
      case "globalFilter":
        await resetFilterChanges(1);
        break;
      default:
        await resetVisualChanges(currentIdParts, 1);
        break;
    }
  };

  const addMediaOptions = () =>{
    setShowMediaOptions(true);
  }

  useEffect(() => {
    if (props.mainTrigger) {
      console.log("q", props.traversal);
      buildTraversal();
    }
  }, [props.mainTrigger, props.traversal]);

  const buildTraversal = () => {
    setTrigger((trigger) => trigger + 1);
  };

  return (
    <div id="canvas-container" className="canvas-cont" style={{ flexGrow: 1, position: "relative" }}>
      <div className="flow">
        <ReactFlowProvider>
          <NodesCanvas trigger={trigger} traversal={props.traversal} />
        </ReactFlowProvider>
      </div>
      <div id="annotation-box" className="accordion node-desc">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseDesc"
              aria-expanded="true"
              aria-controls="collapseDesc"
            >
              Component description
              { showMediaOptions? 
                <div>
                  <RecordView />
                  <UploadVideo />
                </div>
              :
              <div className="btn btn-secondary btn-xs d-flex justify-content-center align-items-center" onClick={addMediaOptions}>
                <img
                className="me-2"
                src={mediaIcon}
                width="20px"
                height="20px"
                alt="Add media icon"
                />
                Add media
              </div>
              }
            </button>
          </h2>
          <div
            id="collapseDesc"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#annotation-box"
          >
            <div className="accordion-body">
              <textarea
                id="textBox"
                className="form-control"
                rows={4}
                // onChange={saveAnnotationChanges}
              />
              <div className="controls">
                <div
                  className="btn btn-secondary btn-sm me-auto"
                  onClick={resetAnnotationChanges}
                >
                  <FaUndo />
                </div>
                <div className="btn btn-secondary btn-sm me-auto ms-2">
                  <FaCheck id="saveText" onClick={saveAnnotationChanges} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <OpenAI />
      </div>
    </div>
  );
}
