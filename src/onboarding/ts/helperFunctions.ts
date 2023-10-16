import * as global from "./globalVariables";
import * as elements from "./elements";
import { getStartFunction } from "./introCards";
import {
  previousInfoCard,
  nextInfoCard,
  createInfoCard,
  nextInGroup,
  previousInGroup,
} from "./infoCards";
import { removeFrame } from "./disableArea";
import {
  createGuidedTour,
  createDashboardExploration,
  createOnboardingOverlay,
} from "./onboarding";
import { createSettings } from "./createSettings";
import {
  removeInteractionCard,
  startInteractionExample,
} from "./interactionExample";
import {
  removeHintCard,
  removeShowChangesCard,
  showReportChanges,
} from "./showReportChanges";

import "powerbi-report-authoring";
import { VisualDescriptor } from "powerbi-client";
import ComponentGraph, {
  reviver,
} from "../../componentGraph/ComponentGraph";

import * as sizes from "./sizes";
import {
  createGroupOverlay,
  findCurrentTraversalVisual,
  findCurrentTraversalVisualIndex,
} from "./traversal";
import * as helper from "../../componentGraph/helperFunctions";
import { createFilterInfoCard } from "./filterInfoCards";
import { store } from "../../UI/redux/store";

export function addContainerOffset(cardHeight: number) {
  let rect = null;
  let pageOffset = 0;
  let buttonHeaderHeight = 0;

  const flex = document
    .getElementById("flexContainer");
  if(flex){
    rect = flex.getBoundingClientRect();
    pageOffset = parseInt(
      window.getComputedStyle(flex)
        .paddingTop
    );

    const header = document.getElementById("onboarding-header");
    if (header) {
      buttonHeaderHeight = header.clientHeight;
      const headerOffset = cardHeight - pageOffset + global.globalCardTop;
      header.style.marginTop = headerOffset + "px";
    }

  }

  const reportOffsetTop = parseInt(
    window.getComputedStyle(document.getElementById("reportContainer")!)
      .paddingTop
  );

  const onboarding = document.getElementById("onboarding");
  if (onboarding) {
    const rectTop = rect? rect.top:0;
    global.setOnboardingOffset(
      pageOffset + buttonHeaderHeight + reportOffsetTop + rectTop
    );
    const top =
      global.globalCardTop +
      cardHeight +
      buttonHeaderHeight +
      reportOffsetTop +
      rectTop;
    onboarding.style.top = top + "px";
  }

  global.setContainerPaddingTop(
    global.report.iframe.offsetTop + global.settings.reportOffset.top
  );
}

function backToVisual() {
  removeContainerOffset();
  global.setInteractionMode(false);
  removeOnboardingOverlay();

  removeInteractionCard();
  removeShowChangesCard();
  removeHintCard();

  const state = store.getState();

  const traversalElement = findCurrentTraversalVisual();
  if (traversalElement) {
    if(traversalElement[0] === "globalFilter"){
      createFilterInfoCard(traversalElement[2], traversalElement[3], state.expertise);
    } else {
      createInfoCard(
        traversalElement[1],
        traversalElement[3],
        traversalElement[2],
        state.expertise
      );
    }
  }
}

export function createBasicCardContent(description: string, parentId: string) {
  const divAttributes = global.createDivAttributes();
  divAttributes.id = "basicCardContent";
  divAttributes.classes = "contentPlacementSmall";
  divAttributes.parentId = parentId;
  elements.createDiv(divAttributes);

  const spanAttributes = global.createSpanAttributes();
  spanAttributes.id = "basicContentText";
  spanAttributes.style = `font-size: ${sizes.textSize}rem`;
  spanAttributes.content = description;
  spanAttributes.parentId = "basicCardContent";
  elements.createSpan(spanAttributes);
}

export function createCard(id: string, style: string, classes: string) {
  const attributes = global.createDivAttributes();
  attributes.id = id;
  attributes.style = style;
  attributes.classes = classes;
  attributes.parentId = "onboarding";
  elements.createDiv(attributes);
}

export function createCardButtons(
  id: string,
  leftButton: string,
  middleButton: string,
  rightButton: string
) {
  const divAttributes = global.createDivAttributes();
  divAttributes.id = id;
  divAttributes.parentId = "cardContent";
  divAttributes.style = "height: 50px; clear: both;";
  elements.createDiv(divAttributes);

  if (leftButton != "") {
    const buttonAttributes = global.createButtonAttributes();
    buttonAttributes.classes =
      global.darkOutlineButtonClass + " positionLeft cardButtons";
    buttonAttributes.style = `font-size: ${sizes.textSize}rem; margin-bottom: 20px;`;
    buttonAttributes.parentId = id;
    switch (leftButton) {
      case "skip":
        buttonAttributes.id = "skipButton";
        buttonAttributes.content = "Skip";
        buttonAttributes.function = removeOnboarding;
        break;
      case "back to visual":
        buttonAttributes.id = "backButton";
        buttonAttributes.content = "Back to visual";
        buttonAttributes.function = backToVisual;
        break;
      case "cancel":
        buttonAttributes.id = "cancelButton";
        buttonAttributes.content = "Cancel";
        buttonAttributes.function = removeOnboarding;
        break;
      case "previousInGroup":
        buttonAttributes.id = "previousInGroupButton";
        buttonAttributes.content = "Previous";
        buttonAttributes.function = previousInGroup;
        break;
      case "back to group":
        buttonAttributes.id = "backToGroupButton";
        buttonAttributes.content = "Previous";
        buttonAttributes.function = createGroupOverlay;
        break;
      case "out of group":
        buttonAttributes.id = "outOfGroupButton";
        buttonAttributes.content = "Out Of Group";
        buttonAttributes.function = nextInfoCard;
        break;
      case "close":
        buttonAttributes.id = "endButton";
        buttonAttributes.content = "Close";
        buttonAttributes.function = removeOnboarding;
        break;
      default:
        buttonAttributes.id = "previousButton";
        buttonAttributes.content = "Previous";
        buttonAttributes.function = previousInfoCard;
    }
    elements.createButton(buttonAttributes);
  }

  if (rightButton != "") {
    const buttonAttributes = global.createButtonAttributes();
    buttonAttributes.classes =
      global.darkOutlineButtonClass + " positionRight cardButtons";
    buttonAttributes.style = `font-size: ${sizes.textSize}rem; margin-bottom: 20px;`;
    buttonAttributes.parentId = id;
    if (leftButton == "") {
      buttonAttributes.style += "margin-bottom: 20px;";
    }
    switch (rightButton) {
      case "close":
        buttonAttributes.id = "endButton";
        buttonAttributes.content = "Close";
        buttonAttributes.function = removeOnboarding;
        break;
      case "start":
        buttonAttributes.id = "startButton";
        buttonAttributes.content = "Start";
        buttonAttributes.function = getStartFunction();
        break;
      case "back to visual":
        buttonAttributes.id = "backButton";
        buttonAttributes.content = "Back to visual";
        buttonAttributes.function = backToVisual;
        break;
      case "back to overview":
        buttonAttributes.id = "backToOverviewButton";
        buttonAttributes.content = "Back to overview";
        buttonAttributes.function = showReportChanges;
        break;
      case "nextInGroup":
        buttonAttributes.id = "nextInGroupButton";
        buttonAttributes.content = "Next";
        buttonAttributes.function = nextInGroup;
        break;
      case "back to group":
        buttonAttributes.id = "backToGroupButton";
        buttonAttributes.content = "Next";
        buttonAttributes.function = createGroupOverlay;
        break;
      default:
        buttonAttributes.id = "nextButton";
        buttonAttributes.content = "Next";
        buttonAttributes.function = nextInfoCard;
    }
    elements.createButton(buttonAttributes);
  }

  if (middleButton != "") {
    const buttonAttributes = global.createButtonAttributes();
    buttonAttributes.classes =
      global.darkOutlineButtonClass + " positionCenter cardButtons";
    buttonAttributes.style = `font-size: ${sizes.textSize}rem; margin-bottom: 20px;`;
    buttonAttributes.parentId = id;
    switch (middleButton) {
      case "out of group":
        buttonAttributes.id = "outOfGroupButton";
        buttonAttributes.content = "Out Of Group";
        buttonAttributes.function = nextInfoCard;
        break;
      case "close":
        buttonAttributes.id = "endButton";
        buttonAttributes.content = "Close";
        buttonAttributes.function = removeOnboarding;
        break;
    }
    elements.createButton(buttonAttributes);
  }
}

export function createCardContent(
  headline: string | undefined,
  description: string | undefined,
  parentId: string
) {
  const divAttributes = global.createDivAttributes();
  divAttributes.id = "cardContent";
  if(global.isEditor){
    divAttributes.classes = "contentPlacementEditor";
  } else {
    divAttributes.classes = "contentPlacementBig";
  }
  divAttributes.parentId = parentId;
  elements.createDiv(divAttributes);

  const h1Attributes = global.createH1Attributes();
  h1Attributes.id = "cardHeadline";
  if (!headline) {
    h1Attributes.content = "";
  } else {
    h1Attributes.content = headline;
  }
  h1Attributes.parentId = "cardContent";
  h1Attributes.style = `font-size: ${sizes.headlineSize}rem`;
  elements.createH1(h1Attributes);

  const spanAttributes = global.createSpanAttributes();
  spanAttributes.id = "contentText";
  if (!description) {
    spanAttributes.content = "";
  } else {
    spanAttributes.content = description;
  }
  spanAttributes.parentId = "cardContent";
  spanAttributes.style = `font-size: ${sizes.textSize}rem`;
  elements.createSpan(spanAttributes);
}

export function createCloseButton(
  buttonId: string,
  buttonClasses: string,
  buttonStyle: string,
  functionName: any,
  parentId: string
) {
  const buttonAttributes = global.createButtonAttributes();
  buttonAttributes.id = buttonId;
  buttonAttributes.classes = "btn-close " + buttonClasses;
  if (sizes.divisor > 2) {
    buttonStyle += `; width: 5px; height: 5px`;
  }
  buttonAttributes.style = buttonStyle;
  buttonAttributes.function = functionName;
  buttonAttributes.parentId = parentId;
  elements.createButton(buttonAttributes);
}

export function createEditOnboardingButtons() {
  const editButton = document.getElementById("editOnboarding");
  editButton?.removeAttribute("hidden");
}

export async function createInteractionExampleButton(
  parentId: string,
) {
  elements.removeElement("interactionExample");

  const attributes = global.createButtonAttributes();
  attributes.id = "interactionExample";
  attributes.content = "Try it out";
  attributes.style =
    "display:block;margin:0 auto;margin-top:10px;margin-bottom:10px;" +
    `font-size: ${sizes.textSize}rem;`;
  attributes.classes = global.darkOutlineButtonClass;
  attributes.function = startInteractionExample;
  attributes.parentId = parentId;
  elements.createButton(attributes);
}

function getDisabledStyle(
  top: number,
  left: number,
  width: number,
  height: number
) {
  return `position:absolute;pointer-events:none;top:${top}px;left:${left}px;width:${width}px;height:${height}px;`;
}
export function createOnboarding() {
  const style = getDisabledStyle(
    global.containerPaddingTop,
    global.containerPaddingLeft,
    global.reportWidth!,
    global.reportHeight!
  );

  const attributes = global.createDivAttributes();
  attributes.id = "onboarding";
  attributes.style = style;
  attributes.parentId = "embed-container";
  elements.createDiv(attributes);
}

export function createOnboardingButtons() {
  elements.removeElement("guidedTour");
  elements.removeElement("dashboardExploration");

  let attributes = global.createButtonAttributes();
  attributes.id = "guidedTour";
  attributes.content = "Start Guided Tour";
  attributes.style = global.onboardingButtonStyle;
  attributes.classes =
    "onboardingButton col-2 " + global.darkOutlineButtonClass;
  attributes.function = createGuidedTour;
  attributes.parentId = "onboarding-header";
  elements.createButton(attributes);

  attributes = global.createButtonAttributes();
  attributes.id = "dashboardExploration";
  attributes.content = "Start Dashboard Exploration";
  attributes.style = global.onboardingButtonStyle;
  attributes.classes =
    "onboardingButton col-2 " + global.darkOutlineButtonClass;
  attributes.function = createDashboardExploration;
  attributes.parentId = "onboarding-header";
  elements.createButton(attributes);
}

function endExplorationMode() {
  elements.removeElement("dashboardExplaination");
  elements.removeElement("welcomeCardExplaination");
  global.setExplorationMode(false);
  global.setHasOverlay(false);
  const button = document.getElementById("dashboardExploration");
  if (!button) {
    return;
  }
  button.innerHTML = "Start Dashboard Exploration";
}

export async function getActivePage() {
  const pages = await global.report.getPages();
  const page = pages.filter(function (page: { isActive: any }) {
    return page.isActive;
  })[0];
  if (!page) {
    getActivePage();
  }
  global.setPage(page);
}

export function getCardStyle(
  top: number,
  left: number,
  width: number,
  height: string
) {
  return (
    getClickableStyle(top, left, width, height) +
    `border-radius:10px;background-color:lightsteelblue;z-index: 99 !important;`
  );
}

export function getClickableStyle(
  top: number,
  left: number,
  width: number,
  height: string | number
) {
  return `position:absolute;pointer-events:auto;top:${top}px;left:${left}px;width:${width}px;height:${height}px;`;
}

export function getCloseFunction() {
  if (global.isGuidedTour) {
    return removeOnboarding;
  } else {
    return createOnboardingOverlay;
  }
}

export function getElementWidth(element: HTMLElement) {
  let elementWidth = element.clientWidth;
  const computedStyle = getComputedStyle(element);
  elementWidth -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);
  return elementWidth;
}

export function getNextVisual() {
  let nextVisual;
  const visuals = global.currentVisuals.filter(function (visual) {
    return visual.type !== "slicer";
  });

  const index = findCurrentTraversalVisualIndex();

  if (index >= visuals.length - 1) {
    nextVisual = visuals[0];
  } else {
    nextVisual = visuals[index + 1];
  }
  return nextVisual;
}

export async function createComponentGraph() {
  const graph = new ComponentGraph(
    global.report,
    global.page,
    global.allVisuals
  );
  await graph.setComponentGraphData();
}

export function getSettings() {
  try {
    if (localStorage.getItem("settings") == null) {
      createSettings();
    }
    global.setSettings(JSON.parse(localStorage.getItem("settings")!, reviver));
  } catch (error) {
    console.log("Error in getSettings()", error);
  }
}

export function getVisualCardPos(
  visual: VisualDescriptor,
  cardWidth: number,
  offset: number
) {
  const position = {
    x: 0,
    y: 0,
    pos: "",
  };

  try {
    if (!visual) {
      return position;
    }
    if (!visual.layout) {
      return position;
    }
    const visualLayoutX = visual.layout.x ?? 0;
    const visualLayoutY = visual.layout.y ?? 0;
    const visualLayoutWidth = visual.layout.width ?? 0;

    const leftDistance = visualLayoutX / sizes.reportDivisor;
    const rightX = leftDistance + visualLayoutWidth / sizes.reportDivisor;
    const rightDistance = global.reportWidth! - rightX;

    if(global.isEditor){
      if (rightDistance  + global.filterClosedWidth > global.infoCardWidth) {
        position.x = offset + rightX;
        position.pos = "right";
      } else {
        position.x = leftDistance - offset - cardWidth;
        position.pos = "left";
      }
    } else{
      if (rightDistance > leftDistance || leftDistance < global.infoCardWidth) {
        position.x = offset + rightX;
        position.pos = "right";
      } else {
        position.x = leftDistance - offset - cardWidth;
        position.pos = "left";
      }
    }
    position.y = offset + visualLayoutY / sizes.reportDivisor;
  } catch (error) {
    console.log("Error in getVisualCardPos()", error);
  }

  return position;
}

export function getVisualIndex(name: string) {
  const index = global.currentVisuals.findIndex(function (visual) {
    return visual.name == name;
  });
  return index;
}

export async function getVisualsfromPowerBI() {
  const visuals = await global.page.getVisuals();
  console.log(visuals);
  global.setVisuals(visuals);
  sortVisuals();
  removeDesignVisuals();
  global.setAllVisuals(global.currentVisuals);
}

export function recreateInteractionExampleButton() {
  const interactionButton = document.getElementById("interactionExample");
  if (!interactionButton) {
    const visual = global.currentVisuals[global.currentVisualIndex];
    let parent = document.getElementById("visualInfoTabs");
    if (parent) {
      createInteractionExampleButton("interactionTab");
    }
    parent = document.getElementById("visualInfo");
    if (parent) {
      createInteractionExampleButton("visualInfo");
    }
  }
}

export function removeContainerOffset() {
  const header = document.getElementById("onboarding-header");
  if (header) {
    header.style.marginTop = "0px";
  }

  const onboarding = document.getElementById("onboarding");
  if (onboarding && !global.isEditor) {
    onboarding.style.top = global.onboardingOffset + "px";
  }

  global.setContainerPaddingTop(
    global.report.iframe.offsetTop + global.settings.reportOffset.top
  );
}

function removeDesignVisuals() {
  const visuals = global.currentVisuals.filter(function (visual) {
    return (
      visual.type !== "" &&
      visual.type !== "basicShape" &&
      visual.type !== "textbox" &&
      visual.type !== "actionButton"
    );
  });
  global.setVisuals(visuals);
}

export function removeOnboarding() {
  removeContainerOffset();

  global.setInteractionMode(false);
  global.setIsGuidedTour(false);
  endExplorationMode();

  elements.removeElement("onboarding");
  removeFrame();
}

export function reloadOnboarding() {
  removeFrame();
  elements.removeElement("dashboardExplaination");
  elements.removeElement("welcomeCardExplaination");
  elements.removeElement("onboarding");
  createOnboarding();
}

export function removeOnboardingOverlay() {
  global.setHasOverlay(false);
  elements.removeElement("dashboardExplaination");
  elements.removeElement("welcomeCardExplaination");
  global.currentVisuals.forEach(function (visual) {
    elements.removeElement(visual.name);
  });
  elements.removeElement("globalFilter");
}

export function resizeEmbed(filterWidth: number) {
  try {
    document.getElementById(
      "embed-container"
    )!.style.cssText = `top:0px;left:0px;width:${
      global.reportWidth! + filterWidth
    }px;height:${
      global.reportHeight! +
      global.settings.reportOffset.top +
      global.footerHeight
    }px;`;
  } catch (error) {
    console.log("Error in resizeEmbed", error);
  }
}

function sortVisuals() {
  global.currentVisuals.sort(function (a, b) {
    const aLayoutX = a.layout.x ?? 0;
    const aLayoutY = a.layout.y ?? 0;
    const bLayoutX = b.layout.x ?? 0;
    const bLayoutY = b.layout.y ?? 0;
    if (aLayoutX < bLayoutX) {
      return -1;
    } else if (aLayoutX > bLayoutX) {
      return 1;
    } else {
      if (aLayoutY < bLayoutY) {
        return -1;
      } else {
        return 1;
      }
    }
  });
}

export function startExplorationMode() {
  global.setExplorationMode(true);

  const button = document.getElementById("dashboardExploration");
  button!.innerHTML = "End Dashboard Exploration";
}

export async function toggleFilter(open: boolean) {
  const newSettings = {
    panes: {
      filters: {
        expanded: open,
        visible: true,
      },
      pageNavigation: {
        visible: true,
      },
    },
  };

  if (open) {
    resizeEmbed(global.filterOpenedWidth);
  } else {
    resizeEmbed(global.filterClosedWidth);
  }

  await global.report.updateSettings(newSettings);
}
