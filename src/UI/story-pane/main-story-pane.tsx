import React from "react";
import { FaCheck, FaUndo } from "react-icons/fa";
import { ReactFlowProvider } from "reactflow";
import NodesCanvas from "../nodes-canvas/canvas-index";
import "../assets/css/dashboard.scss";
import SaveAndFetchContent from "./../../onboarding/ts/Content/saveAndFetchContent"; // should be moved close to story pane
import mediaIcon from "../assets/img/icon-7.png";
import { useEffect, useState } from "react";
import RecordView from "./main-record";
import * as global from "../../onboarding/ts/globalVariables";

// redux starts
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { startOnboardingAt } from "../../onboarding/ts/onboarding";
// redux ends

interface Props {
  mainTrigger: number;
  traversal: any;
  setNodes: any;
  setEdges: any;
}

export default function StoryPane(props: Props) {
  const [trigger, setTrigger] = useState(0);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  let timer: ReturnType<typeof setTimeout>;

  // redux starts
  const nodeFullName = useSelector(
    (state: RootState) => state.nodeModal.fullName
  );
  const nodeBasicName = useSelector(
    (state: RootState) => state.nodeModal.basicName
  );
  // redux  ends

  // redux starts for expertise level
  const expertiseLevel = useSelector((state: RootState) => state.expertise);
  // redux ends for expertise level

  useEffect(() => {
    async function fillTextBox() {
      if (nodeFullName.includes("group")) {
        console.log("nothing to show in a group");
        return;
      }
      if (nodeFullName?.length > 0) {
        const visInfo = new SaveAndFetchContent(nodeFullName);
        await visInfo.getVisualDescInEditor(expertiseLevel);
      }
    }

    fillTextBox().catch(console.error);
  }, [expertiseLevel, nodeBasicName, nodeFullName]);

  const saveAnnotationChanges = (timeout: number) => {
    try {
      const infos = [];
      const images: string[] = [];
      const textBox = document.getElementById(
        "textBox"
      )! as HTMLTextAreaElement;
      const child = textBox.children[0];
      const listElems = child.children;

      for (let i = 0; i < listElems.length; i++) {
        images.push(listElems[i].className);
        infos.push(listElems[i].innerHTML);
      }

      const visInfo = new SaveAndFetchContent(nodeFullName);
      visInfo.saveVisualInfo(images, infos);
      clearTimeout(timer);
      timer = setTimeout(() => {
        reloadOnboarding();
      }, timeout);
    } catch (error) {
      console.log("Error in saveAnnotatiionChanges", error);
    }
  };

  const resetAnnotationChanges = () => {
    const visInfo = new SaveAndFetchContent(nodeFullName);
    visInfo.resetVisualInfo(expertiseLevel);
    reloadOnboarding();
  };

  const reloadOnboarding = () => {
    if (nodeBasicName && expertiseLevel) {
      let visual = undefined;
      let visualName = "";
      let category: string[];
      let count: number;
      nodeFullName;
      switch (nodeBasicName) {
        case "dashboard":
        case "globalFilter":
          visualName = nodeBasicName;
          break;
        default:
          visual = global.allVisuals.find((visual) => {
            return visual.name == nodeBasicName;
          });

          if (!visual) {
            return;
          }

          visualName = "visual";
      }

      if (nodeFullName.length > 3) {
        category = [nodeFullName[1]];
        count = parseInt(nodeFullName[2]);
      } else {
        category = ["general"];
        count = parseInt(nodeFullName[1]);
      }
      startOnboardingAt(
        visualName,
        visual,
        category,
        count,
        expertiseLevel,
        true
      );
    }
  };

  const addMediaOptions = () => {
    setShowMediaOptions(true);
  };

  useEffect(() => {
    if (props.mainTrigger) {
      buildTraversal();
    }
  }, [props.mainTrigger, props.traversal]);

  useEffect(() => {
    props.setNodes(nodes);
    props.setEdges(edges);
  }, [nodes, edges, props]);

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
            setEdgesForSave={setEdges}
          />
        </ReactFlowProvider>
      </div>
      <div id="annotation-box" className="accordion node-desc">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <div className="accordion-button">
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
            </div>
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
                onInput={function () {
                  saveAnnotationChanges(500);
                }}
              ></div>
              <div className="controls">
                <div
                  className="btn btn-secondary btn-sm me-auto"
                  onClick={resetAnnotationChanges}
                >
                  <FaUndo />
                </div>
                <div className="btn btn-secondary btn-sm me-auto ms-2">
                  <FaCheck
                    id="saveText"
                    onClick={function () {
                      saveAnnotationChanges(0);
                    }}
                  />
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
