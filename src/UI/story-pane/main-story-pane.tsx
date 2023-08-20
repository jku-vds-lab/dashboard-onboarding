import React from "react";
import { FaCheck, FaUndo } from "react-icons/fa";
import { ReactFlowProvider } from "reactflow";
import NodesCanvas from "../nodes-canvas/canvas-index";
import "../assets/css/dashboard.scss";
import SaveAndFetchContent from "./../../onboarding/ts/Content/saveAndFetchContent"; // should be moved close to story pane
import {
  getDashboardInfoInEditor,
  resetDashboardChanges,
  saveDashboardChanges,
} from "../../onboarding/ts/dashboardInfoCard";
import {
  getFilterInfoInEditor,
  resetFilterChanges,
  saveFilterChanges,
} from "../../onboarding/ts/filterInfoCards";
import mediaIcon from "../assets/img/icon-7.png";
import { useEffect, useState } from "react";
import RecordView from "./main-record";
import * as global from "../../onboarding/ts/globalVariables";

// redux starts
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
// redux ends

let globalText = "";

interface Props {
  mainTrigger: number;
  traversal: any;
  setNodes: any;
}

export default function StoryPane(props: Props) {
  const [trigger, setTrigger] = useState(0);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [nodes, setNodes] = useState([]);

  // redux starts
  const nodeFullName = useSelector(
    (state: RootState) => state.nodeModal.fullName
  );
  const nodeBasicName = useSelector(
    (state: RootState) => state.nodeModal.basicName
  );
  // redux  ends

  const visInfo = new SaveAndFetchContent("line", nodeFullName);

  useEffect(() => {
    async function fillTextBox() {
      // console.log("Trying to fill the box", nodeBasicName);
      if (nodeFullName?.length > 0) {
        switch (nodeBasicName) {
          case "dashboard":
            await getDashboardInfoInEditor(1);
            break;
          case "globalFilter":
            getFilterInfoInEditor(1);
            break;
          case "group":
            break;
          default:
            if (nodeFullName) {
              await visInfo.getVisualDescInEditor();
              // await getVisualDescInEditor(nodeFullName);
            }
            break;
        }
      }
    }

    fillTextBox().catch(console.error);
  }, [nodeBasicName, nodeFullName]);

  const saveAnnotationChanges = async () => {
    try {
      const infos = [];
      debugger;
      const list1 = document.getElementById("textBox")! as HTMLTextAreaElement;
      globalText = list1.innerHTML;
      const list = list1.children[0];
      const listElems = list.children;

      for (let i = 0; i < listElems.length; i++) {
        infos.push(listElems[i].innerHTML);
      }

      const currentIdParts = nodeFullName;

      //TODO update visuals with videos, saveInfoVideo(), when editor side is ready and we know when and with what to update

      switch (currentIdParts[0]) {
        case "dashboard":
          await saveDashboardChanges(infos, 1);
          break;
        case "globalFilter":
          await saveFilterChanges(infos, 1);
          break;
        default:
          await visInfo.saveVisualInfo(infos, globalText, currentIdParts, 1);
          break;
      }
    } catch (error) {
      console.log("Error in saveAnnotatiionChanges", error);
    }
  };

  const resetAnnotationChanges = async () => {
    const currentIdParts = nodeFullName;
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
        // await resetVisualChanges(currentIdParts, 1);
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

  useEffect(() => {
    props.setNodes(nodes);
  }, [nodes, props]);

  const buildTraversal = () => {
    setTrigger((trigger) => trigger + 1);
  };

  return (
    <div
      id="canvas-container"
      className="canvas-cont"
      style={{ flexGrow: 1, position: "relative" }}
    >
      <div className="flow">
        <ReactFlowProvider>
          <NodesCanvas
            trigger={trigger}
            traversal={props.traversal}
            setNodesForSave={setNodes}
          />
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
                  <RecordView setShowMediaOptions={setShowMediaOptions} />
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
              <div
                id="textBox"
                className="editable form-control"
                contentEditable="true"
              >
                {/* This is where the text should go */}
              </div>
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

        {/* <OpenAI /> */}
      </div>
    </div>
  );
}
