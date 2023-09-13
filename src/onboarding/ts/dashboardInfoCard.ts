import * as helpers from "../../componentGraph/helperFunctions";
import * as onboardingHelpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { removeElement } from "./elements";
import { disableAll } from "./disableArea";
import Dashboard from "../../componentGraph/Dashboard";
import { createInfoList } from "./visualInfo";
import { createInfoCardButtons } from "./infoCards";
import {
  TraversalElement,
} from "./traversal";

export function createDashboardInfoCard(count: number) {
  global.setShowsDashboardInfo(true);
  disableAll();

  const style =
  onboardingHelpers.getCardStyle(global.introCardMargin, 0, global.introCardWidth, "") +
    `right:0;margin:auto;`;
    onboardingHelpers.createCard("dashboardInfoCard", style, "");

    onboardingHelpers.createCloseButton(
    "closeButton",
    "closeButtonPlacementBig",
    "",
    onboardingHelpers.getCloseFunction(),
    "dashboardInfoCard"
  );

  let traversal: TraversalElement[];
  if (global.explorationMode) {
    traversal = global.basicTraversal;
  } else {
    traversal = global.settings.traversalStrategy;
  }

  const dashboard = global.componentGraph.dashboard;
  onboardingHelpers.createCardContent(dashboard.title.title, "", "dashboardInfoCard");
  setDashboardInfos(traversal, count);
  createInfoCardButtons(traversal, "dashboard", [], count);
}

function setDashboardInfos(traversal: TraversalElement[], count: number) {
  document.getElementById("contentText")!.innerHTML = "";
  const visualData = helpers.getDataWithId(
    traversal,
    "dashboard",
    ["general"],
    count
  );
  if (!visualData) {
    return;
  }

  const videoURL = localStorage.getItem("dashboardvideo");
  if (videoURL) {
    const attributes = global.createDivAttributes();
    attributes.id = "videoContainer";
    attributes.style = "position: relative;padding-bottom: 56.25%;height: 0;";
    attributes.parentId = "contentText";
    elements.createDiv(attributes);
    const videoAttributes = global.createVideoAttributes();
    videoAttributes.id = "video";
    videoAttributes.width = "100%";
    videoAttributes.parentId = "videoContainer";
    elements.createVideo(videoAttributes);

    const sourceAttributes = global.createSourceAttributes();
    sourceAttributes.id = "source";
    sourceAttributes.src = visualData.videoURL;
    sourceAttributes.type = "video/mp4";
    sourceAttributes.parentId = "video";
    elements.createSource(sourceAttributes);
  }

  const dashboardInfos = getDashboardInfos(traversal, count);
  if (dashboardInfos) {
    createInfoList(
      dashboardInfos[0],
      dashboardInfos[1],
      "contentText",
      false
    );
  }
}

export function getDashboardInfos(
  traversal: TraversalElement[],
  count: number
) {
  const dashboardData = helpers.getDataWithId(
    traversal,
    "dashboard",
    ["general"],
    count
  );
  if (!dashboardData) {
    return;
  }

  let newImages: string[];
  let newInfos: string[];
    if(dashboardData.changedInfos.length === 0){
      const dashboard = global.componentGraph.dashboard;
      const dashboardInfo = getNewDashboardInfo(dashboard);

      newImages = dashboardInfo[0];
      newInfos = dashboardInfo[1];
    } else {
      newImages = dashboardData.changedImages;
      newInfos = dashboardData.changedInfos;
    }
       
  return [newImages, newInfos];
}

export function removeDashboardInfoCard() {
  global.setShowsDashboardInfo(false);
  removeElement("dashboardInfoCard");
  removeElement("disabledPage");
}

export function getNewDashboardInfo(dashboard: Dashboard) {
  const images = ["infoImg", "dataImg", "layoutImg"];
  const infos = [dashboard.purpose, dashboard.task, dashboard.layout];

  return [images, infos];
}
