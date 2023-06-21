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
import { resetVisualChanges, saveVisualChanges } from "../../onboarding/ts/infoCards";
import { resetDashboardChanges, saveDashboardChanges } from "../../onboarding/ts/dashboardInfoCard";
import { resetFilterChanges, saveFilterChanges } from "../../onboarding/ts/filterInfoCards";
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

  const saveAnnotationChanges = async (e: any) => {
    const infos = [];

    setShowMediaOptions(false);

    const list = (document.getElementById("textBox")! as HTMLTextAreaElement).children[0];
    const listElems = list.children;

    for (let i = 0; i < listElems.length; i++) {
      infos.push(listElems[i].innerHTML);
    }

    const nodeId = e.target.getAttribute("nodeId");
    const currentIdParts = nodeId?.split(" ");

    //TODO update visuals with videos, saveInfoVideo(), when editor side is ready and we know when and with what to update

    switch (currentIdParts[0]) {
      case "dashboard":
        await saveDashboardChanges(infos, 1);
        break;
      case "globalFilter":
        await saveFilterChanges(infos, 1);
        break;
      default:
        await saveVisualChanges(
          infos,
          currentIdParts,
          1
        );
        break;
    }
  };

  const resetAnnotationChanges = async () => {
    const nodeId = document?.getElementById("saveText")?.getAttribute("nodeId");

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

  const addMediaOptions = () => {
    setShowMediaOptions(true);
  };

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
    <div id="canvas-container" className="canvas-cont" style={{ flexGrow: 1 }}>
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
              {showMediaOptions ? (
                <div>
                  <RecordView />
                  <UploadVideo />
                </div>
              ) : (
                <div
                  className="btn btn-secondary btn-xs d-flex justify-content-center align-items-center"
                  onClick={addMediaOptions}
                >
                  <img
                    className="me-2"
                    src={mediaIcon}
                    width="20px"
                    height="20px"
                    alt="Add media icon"
                  />
                  Add media
                </div>
              )}
            </button>
          </h2>
          <div
            id="collapseDesc"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#annotation-box"
          >
            <div className="accordion-body">
              <div id="textBox" className="editable form-control" contentEditable="true"></div>
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
