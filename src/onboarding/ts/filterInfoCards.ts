import * as helpers from "../../componentGraph/helperFunctions";
import * as onboardingHelpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { createFilterDisabledArea, removeFrame } from "./disableArea";
import Filter from "../../componentGraph/Filter";
import { removeElement } from "./elements";
import { createInfoCardButtons } from "./infoCards";
import { replacer } from "../../componentGraph/ComponentGraph";
import { TraversalElement, createTraversalElement } from "./traversal";
import { getTraversalElement } from "./createSettings";
import { VisualDescriptor } from "powerbi-client";
import GlobalFilters from "./Content/Visualizations/GlobalFiltersVisualContent";
import { createInfoList, createTabs } from "./visualInfo";
import { ExpertiseLevel } from "../../UI/redux/expertise";

export async function createFilterInfoCard(categories: string[], count: number, expertiseLevel?: ExpertiseLevel) {
  createFilterDisabledArea();

  const style = onboardingHelpers.getCardStyle(
    global.infoCardMargin,
    global.reportWidth! - global.infoCardMargin - global.infoCardWidth,
    global.infoCardWidth,
    ""
  );
  onboardingHelpers.createCard("filterInfoCard", style, "rectLeftBig");

  onboardingHelpers.createCloseButton(
    "closeButton",
    "closeButtonPlacementBig",
    "",
    onboardingHelpers.getCloseFunction(),
    "filterInfoCard"
  );

  let traversal: TraversalElement[];
  if (global.explorationMode) {
    traversal = global.basicTraversal;
  } else {
    traversal = global.settings.traversalStrategy;
  }

  const filterData = helpers.getDataWithId(
    traversal,
    "globalFilter",
    categories,
    count
  );
  if (!filterData) {
    return;
  }

  onboardingHelpers.createCardContent(
    filterData.title,
   "",
    "filterInfoCard"
  );
  createInfoCardButtons(traversal, "globalFilter", [], count);

  createTabsWithContent(filterData, categories, expertiseLevel);
  onboardingHelpers.createInteractionExampleButton("interactionTab");
}

export async function createTabsWithContent(
  visualData: any,
  categories: string[],
  expertiseLevel?: ExpertiseLevel
) {
  const visualInfos = await helpers.getVisualInfos("globalFilter", expertiseLevel);

  createTabs(categories);

  if (categories.includes("general")) {
    const generalImages = [];
    const generalInfos = [];

    for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
      switch (visualData.generalInfosStatus[i]) {
        case global.infoStatus.original:
          generalImages.push(visualInfos.generalImages[i]);
          generalInfos.push(visualInfos.generalInfos[i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          generalImages.push("dotImg");
          generalInfos.push(visualData.changedGeneralInfos[i]);
          break;
        default:
          break;
      }
    }

    createInfoList(generalImages, generalInfos, "generalTab", false);
  }

  if (categories.includes("interaction")) {
    const interactionImages = [];
    const interactionInfos = [];

    for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
      switch (visualData.interactionInfosStatus[i]) {
        case global.infoStatus.original:
          interactionImages.push(visualInfos.interactionImages[i]);
          interactionInfos.push(visualInfos.interactionInfos[i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          interactionImages.push("dotImg");
          interactionInfos.push(visualData.changedInteractionInfos[i]);
          break;
        default:
          break;
      }
    }

    createInfoList(interactionImages, interactionInfos, "interactionTab", false);
    onboardingHelpers.createInteractionExampleButton("interactionTab");
  }
}

export function createFilterList(
  traversal: TraversalElement[],
  list: string | any[],
  parentId: string,
  count: number
) {
  document.getElementById("contentText")!.innerHTML = "";
  const visualData = helpers.getDataWithId(
    traversal,
    "globalFilter",
    ["general"],
    count
  );
  if (!visualData) {
    return;
  }
  const videoURL = localStorage.getItem("globalFiltervideo");
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

  const ul = document.createElement("ul");
  document.getElementById(parentId)?.appendChild(ul);

  for (let i = 0; i < list.length; ++i) {
    const li = document.createElement("li");
    li.innerHTML = list[i];
    ul.appendChild(li);
  }
}

export function getFilterDescription(filter: Filter) {
  let valueText = "";
  let filterText = "";
  if (filter.operation) {
    if (filter.values.length != 0) {
      valueText =
        " Its current value is " + helpers.dataToString(filter.values, "and") + ".";
    }
    filterText =
      "The operation " +
      filter.operation +
      " is execuded for " +
      filter.attribute +
      "." +
      valueText;
  } else {
    filterText = "There is a filter for " + filter.attribute + ".";
  }
  return filter.attribute + ": " + filterText;
}

export async function getFilterInfos(
  traversal: TraversalElement[],
  count: number
) {
  const filterInfos = await helpers.getFilterInfo();

  const filterData = helpers.getDataWithId(
    traversal,
    "globalFilter",
    ["general"],
    count
  );
  if (!filterData) {
    return;
  }

  const newFilters = [];
  for (let i = 0; i < filterData.filterInfosStatus.length; ++i) {
    switch (filterData.filterInfosStatus[i]) {
      case global.infoStatus.original:
        newFilters.push(filterInfos[i]);
        break;
      case global.infoStatus.changed:
      case global.infoStatus.added:
        newFilters.push(filterData.changedFilterInfos[i]);
        break;
      default:
        break;
    }
  }
  return newFilters;
}

export function removeFilterInfoCard() {
  removeElement("filterInfoCard");
  removeElement("disabledLeft");
  removeFrame();
}

export async function saveFilterChanges(newInfo: string[], count: number) {
  const filterInfos = await helpers.getFilterInfo();

  let filterData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    "globalFilter",
    ["general"],
    count
  );
  if (!filterData) {
    const traversalElem = createTraversalElement("");
    traversalElem.element = await getTraversalElement("globalFilter");
    traversalElem.count = count;
    traversalElem.categories = ["general"];
    global.settings.traversalStrategy.push(traversalElem);
    filterData = helpers.getDataWithId(
      global.settings.traversalStrategy,
      "globalFilter",
      ["general"],
      count
    );
  }

  for (let i = 0; i < newInfo.length; ++i) {
    if (newInfo[i] == "" || newInfo[i] == null) {
      filterData.filterInfosStatus[i] = "deleted";
      filterData.changedFilterInfos[i] = "";
    } else if (i >= filterData.filterInfosStatus.length) {
      filterData.filterInfosStatus.push("added");
      filterData.changedFilterInfos.push(newInfo[i]);
    } else if (newInfo[i] == filterInfos[i]) {
      filterData.filterInfosStatus[i] = "original";
      filterData.changedFilterInfos[i] = "";
    } else {
      filterData.filterInfosStatus[i] = "changed";
      filterData.changedFilterInfos[i] = newInfo[i];
    }
  }

  if (newInfo.length < filterData.filterInfosStatus.length) {
    for (let i = newInfo.length; i < filterData.filterInfosStatus.length; ++i) {
      filterData.filterInfosStatus[i] = "deleted";
      filterData.changedFilterInfos[i] = "";
    }
  }

  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function resetFilterChanges(count: number) {
  const filterInfos = await helpers.getFilterInfo();

  const textBox = document.getElementById("textBox")! as HTMLTextAreaElement;
  textBox.innerHTML = "";

  const ul = document.createElement("ul");
  document.getElementById("textBox")?.appendChild(ul);

  for (let i = 0; i < filterInfos.length; ++i) {
    const li = document.createElement("li");
    li.innerHTML = filterInfos[i];
    ul.appendChild(li);
  }

  const filterData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    "globalFilter",
    ["general"],
    count
  );
  if (!filterData) {
    const traversalElem = createTraversalElement("");
    traversalElem.element = await getTraversalElement("globalFilter");
    traversalElem.count = count;
    traversalElem.categories = ["general"];
    global.settings.traversalStrategy.push(traversalElem);
    return;
  }

  for (let i = 0; i < filterInfos.length; ++i) {
    filterData.filterInfosStatus[i] = "original";
    filterData.changedFilterInfos[i] = "";
  }

  if (filterInfos.length < filterData.filterInfosStatus.length) {
    const elemCount = filterData.filterInfosStatus.length - filterInfos.length;
    filterData.filterInfosStatus.splice(filterInfos.length, elemCount);
    filterData.changedFilterInfos.splice(filterInfos.length, elemCount);
  }

  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export function getFilterInfoInEditor(count: number) {
  let infos = [];

  const filterInfos = helpers.getFilterInfo();

  const filterData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    "globalFilter",
    ["general"],
    count
  );
  if (!filterData) {
    infos = filterInfos;
  } else {
    for (let i = 0; i < filterData.filterInfosStatus.length; ++i) {
      switch (filterData.filterInfosStatus[i]) {
        case global.infoStatus.original:
          infos.push(filterInfos[i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          infos.push(filterData.changedFilterInfos[i]);
          break;
        default:
          break;
      }
    }
  }

  const textBox = document.getElementById("textBox")! as HTMLTextAreaElement;
  textBox.innerHTML = "";

  const ul = document.createElement("ul");
  document.getElementById("textBox")?.appendChild(ul);

  for (let i = 0; i < infos.length; ++i) {
    const li = document.createElement("li");
    li.innerHTML = infos[i];
    ul.appendChild(li);
  }
}
