import * as helpers from "../../componentGraph/helperFunctions";
import * as onboardingHelpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { createFilterDisabledArea, removeFrame } from "./disableArea";
import Filter from "../../componentGraph/Filter";
import { removeElement } from "./elements";
import { createExpertiseSlider, createInfoCardButtons } from "./infoCards";
import { TraversalElement } from "./traversal";
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

  if(categories[0] !== "interaction"){
    createExpertiseSlider("globalFilter", categories, count, "filterInfoCard");
  }
  
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

  document.getElementById("contentText")!.innerHTML = "";
  const visualData = helpers.getDataWithId(
    traversal,
    "globalFilter",
    categories,
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
    sourceAttributes.src = videoURL;
    sourceAttributes.type = "video/mp4";
    sourceAttributes.parentId = "video";
    elements.createSource(sourceAttributes);
  }

  createTabsWithContent(filterData, categories, expertiseLevel);
}

export async function createTabsWithContent(
  visualData: any,
  categories: string[],
  expertiseLevel?: ExpertiseLevel
) {
  const visualInfos = await helpers.getVisualInfos("globalFilter", expertiseLevel);

  createTabs(categories);

  if (categories.includes("general") || categories.includes("General")) {
    let generalImages = [];
    let generalInfos = [];

    if(visualData.changedGeneralInfos.length === 0){
      generalImages = visualInfos.generalImages;
      generalInfos = visualInfos.generalInfos;
    } else {
      generalImages = visualData.changedGeneralImages;
      generalInfos = visualData.changedGeneralInfos;
    }

    createInfoList(generalImages, generalInfos, "generalTab", false);
  }

  if (categories.includes("interaction") || categories.includes("Interaction")) {
    let interactionImages = [];
    let interactionInfos = [];

    if(visualData.changedInteractionInfos.length === 0){
      interactionImages = visualInfos.interactionImages;
      interactionInfos = visualInfos.interactionInfos;
    } else {
      interactionImages = visualData.changedInteractionImages;
      interactionInfos = visualData.changedInteractionInfos;
    }

    createInfoList(interactionImages, interactionInfos, "interactionTab", false);
    // onboardingHelpers.createInteractionExampleButton("interactionTab");
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

export function removeFilterInfoCard() {
  removeElement("filterInfoCard");
  removeElement("disabledLeft");
  removeFrame();
}