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
  createTraversalElement,
  currentId,
} from "./traversal";
import { replacer } from "../../componentGraph/ComponentGraph";
import { getTraversalElement } from "./createSettings";

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
  const title = setDashboardTitle(traversal, dashboard, count);
  onboardingHelpers.createCardContent(title, "", "dashboardInfoCard");
  setDashboardInfos(traversal, count);
  createInfoCardButtons(traversal, "dashboard", [], count);
}

function setDashboardTitle(
  traversal: TraversalElement[],
  dashboard: Dashboard,
  count: number
) {
  const title = dashboard.title.title;

  const dashboardData = helpers.getDataWithId(
    traversal,
    "dashboard",
    ["general"],
    count
  );
  if (!dashboardData) {
    return;
  }

  let newTitle = "";
  switch (dashboardData.titleStatus) {
    case global.infoStatus.original:
      newTitle = title;
      break;
    case global.infoStatus.changed:
    case global.infoStatus.added:
      newTitle = dashboardData.changedTitle;
      break;
    default:
      break;
  }

  return newTitle;
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
  const dashboard = global.componentGraph.dashboard;
  const dashboardInfo = getNewDashboardInfo(dashboard);
  const images = dashboardInfo[0];
  const infos = dashboardInfo[1];

  const dashboardData = helpers.getDataWithId(
    traversal,
    "dashboard",
    ["general"],
    count
  );
  if (!dashboardData) {
    return;
  }

  const newImages = [];
  const newInfos = [];
  for (let i = 0; i < dashboardData.infoStatus.length; ++i) {
    switch (dashboardData.infoStatus[i]) {
      case global.infoStatus.original:
        newImages.push(images[i]);
        newInfos.push(infos[i]);
        break;
      case global.infoStatus.changed:
      case global.infoStatus.added:
        newImages.push("dotImg");
        newInfos.push(dashboardData.changedInfos[i]);
        break;
      default:
        break;
    }
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

export async function saveDashboardChanges(newInfo: string[], count: number) {
  const dashboard = global.componentGraph.dashboard;
  const dashboardInfo = getNewDashboardInfo(dashboard);
  const originalInfos = dashboardInfo[1];

  let dashboardData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    "dashboard",
    ["general"],
    count
  );
  if (!dashboardData) {
    const traversalElem = createTraversalElement("");
    traversalElem.element = await getTraversalElement("dashboard");
    traversalElem.count = count;
    traversalElem.categories = ["general"];
    global.settings.traversalStrategy.push(traversalElem);
    dashboardData = helpers.getDataWithId(
      global.settings.traversalStrategy,
      "dashboard",
      ["general"],
      count
    );
  }

  for (let i = 0; i < newInfo.length; ++i) {
    if (newInfo[i] == "" || newInfo[i] == null) {
      dashboardData.infoStatus[i] = "deleted";
      dashboardData.changedInfos[i] = "";
    } else if (i >= dashboardData.infoStatus.length) {
      dashboardData.infoStatus.push("added");
      dashboardData.changedInfos.push(newInfo[i]);
    } else if (newInfo[i] == originalInfos[i]) {
      dashboardData.infoStatus[i] = "original";
      dashboardData.changedInfos[i] = "";
    } else {
      dashboardData.infoStatus[i] = "changed";
      dashboardData.changedInfos[i] = newInfo[i];
    }
  }

  if (newInfo.length < dashboardData.infoStatus.length) {
    for (let i = newInfo.length; i < dashboardData.infoStatus.length; ++i) {
      dashboardData.infoStatus[i] = "deleted";
      dashboardData.changedInfos[i] = "";
    }
  }

  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function resetDashboardChanges(count: number) {
  const dashboard = global.componentGraph.dashboard;
  const dashboardInfo = getNewDashboardInfo(dashboard);
  const originalImages = dashboardInfo[0];
  const originalInfos = dashboardInfo[1];

  const textBox = document.getElementById("textBox")! as HTMLTextAreaElement;
  textBox.innerHTML = "";

  await createInfoList(originalImages, originalInfos, "textBox", true);

  const dashboardData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    "dashboard",
    ["general"],
    count
  );
  if (!dashboardData) {
    const traversalElem = createTraversalElement("");
    traversalElem.element = await getTraversalElement("dashboard");
    traversalElem.count = count;
    traversalElem.categories = ["general"];
    global.settings.traversalStrategy.push(traversalElem);
    return;
  }

  for (let i = 0; i < originalInfos.length; ++i) {
    dashboardData.infoStatus[i] = "original";
    dashboardData.changedInfos[i] = "";
  }

  if (originalInfos.length < dashboardData.infoStatus.length) {
    const elemCount = dashboardData.infoStatus.length - originalInfos.length;
    dashboardData.infoStatus.splice(originalInfos.length, elemCount);
    dashboardData.changedInfos.splice(originalInfos.length, elemCount);
  }

  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function getDashboardInfoInEditor(count: number) {
  let infos = [];
  let images = [];

  const dashboard = global.componentGraph.dashboard;
  const dashboardInfo = getNewDashboardInfo(dashboard);
  const dashboardImages = dashboardInfo[0];
  const dashboardInfos = dashboardInfo[1];

  const dashboardData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    "dashboard",
    ["general"],
    count
  );
  if (!dashboardData) {
    images = dashboardImages;
    infos = dashboardInfos;
  } else {
    for (let i = 0; i < dashboardData.infoStatus.length; ++i) {
      switch (dashboardData.infoStatus[i]) {
        case global.infoStatus.original:
          images.push(dashboardImages[i]);
          infos.push(dashboardInfos[i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          images.push("dotImg");
          infos.push(dashboardData.changedInfos[i]);
          break;
        default:
          break;
      }
    }
  }

  const textBox = document.getElementById("textBox")! as HTMLTextAreaElement;
  textBox.innerHTML = "";

  await createInfoList(images, infos, "textBox", true);
}
