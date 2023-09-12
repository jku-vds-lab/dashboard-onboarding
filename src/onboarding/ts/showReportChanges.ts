import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import * as elements from "./elements";
import { removeInteractionCard } from "./interactionExample";
import { reportDivisor } from "./sizes";
import { VisualDescriptor } from "powerbi-client";
import { dataToString } from "../../componentGraph/helperFunctions";

export function showReportChanges() {
  disable.removeFrame();
  removeInteractionCard();
  removeShowChangesCard();
  removeHintCard();

  createInteractionOverlay();
  createHintCard();

  let style =
    `overflow: auto;width:` +
    global.explainGroupCardWidth +
    `px;height:` +
    global.explainGroupCardHeight +
    `px;pointer-events:auto;border-radius:10px;background-color:lightsteelblue;z-index: 99 !important;`;
  if (global.isEditor) {
    const flex = document
      .getElementById("flexContainer")!
      .getBoundingClientRect();
    const onboarding = document
      .getElementById("onboarding")!
      .getBoundingClientRect();
    style +=
      `position:relative;top:` +
      -(onboarding.top - flex.top - global.globalCardTop) +
      `px;margin: 0 auto;`;
  } else {
    style +=
      `position:fixed;top:` +
      global.globalCardTop +
      `px;left:50%;margin-left:` +
      -(global.explainGroupCardWidth / 2) +
      `px;`;
  }
  helpers.createCard("showChangesCard", style, "");

  helpers.addContainerOffset(global.interactionCardHeight);

  helpers.createCloseButton(
    "closeButton",
    "closeButtonPlacementBig",
    "",
    helpers.removeOnboarding,
    "showChangesCard"
  );

  helpers.createCardContent(
    global.settings.interactionExample.title,
    createShowReportChangesInfo(),
    "showChangesCard"
  );

  helpers.createCardButtons("cardButtons", "", "", "back to visual");
}

function createShowReportChangesInfo() {
  let reportChangesInfo;

  switch (global.settings.interactionExample.generalInfoStatus) {
    case global.infoStatus.original:
      reportChangesInfo = getShowReportChangesText();
      break;
    case global.infoStatus.changed:
    case global.infoStatus.added:
      reportChangesInfo = global.settings.interactionExample.changedGeneralInfo;
      break;
    case global.infoStatus.deleted:
      reportChangesInfo =
        "You can now click on one of the cards or graphs to get detailed information about its changes.";
      break;
    default:
      break;
  }
  return reportChangesInfo;
}

export function getShowReportChangesText() {
  const allTargets = global.selectedTargets.map(({ equals }) => equals);
  const allTargetsString = dataToString(allTargets, "and");
  return (
    "Can you see how the whole report changed?<br>All the visualizations were filtered by " +
    allTargetsString +
    ".<br>You can now click on one of the cards or graphs to get detailed information about its changes."
  );
}

export function createInteractionOverlay() {
  const visuals = global.currentVisuals.filter(function (visual) {
    return visual.type !== "slicer";
  });
  visuals.forEach(function (visual) {
    createInteractionVisualOverlay(visual);
  });
}

export function createInteractionVisualOverlay(visual: VisualDescriptor) {
  const visualLayoutX = visual.layout.x ?? 0;
  const visualLayoutY = visual.layout.y ?? 0;
  const visualLayoutWidth = visual.layout.width ?? 0;
  const visualLayoutHeight = visual.layout.height ?? 0;
  const style = helpers.getClickableStyle(
    visualLayoutY / reportDivisor,
    visualLayoutX / reportDivisor,
    visualLayoutWidth / reportDivisor,
    visualLayoutHeight / reportDivisor
  );
  const attributes = global.createDivAttributes();
  attributes.id = visual.name;
  attributes.style = style;
  attributes.clickable = true;
  attributes.selectedTargets = global.selectedTargets;
  attributes.parentId = "onboarding";
  elements.createDiv(attributes);
}

function createHintCard() {
  if (global.settings.interactionExample.nextVisualHint != "") {
    const nextVisual = helpers.getNextVisual();

    const visualWithBorder = document.getElementById(nextVisual.name);
    visualWithBorder!.className += ` greenBorder`;

    const position = helpers.getVisualCardPos(
      nextVisual,
      global.hintCardWidth,
      global.hintCardMargin
    );

    const style =
      helpers.getClickableStyle(
        position.y,
        position.x,
        global.hintCardWidth,
        ""
      ) +
      `border-radius:10px;background-color:lightgreen;opacity: 0.85;z-index: 99 !important;`;
    if (position.pos === "left") {
      helpers.createCard("hintCard", style, "rectLeftSmall");
      helpers.createCloseButton(
        "hintCloseButton",
        "closeButtonPlacementSmall",
        "",
        removeHintCard,
        "hintCard"
      );
    } else {
      helpers.createCard("hintCard", style, "rectRightSmall");
      helpers.createCloseButton(
        "hintCloseButton",
        "closeButtonPlacementSmall",
        "",
        removeHintCard,
        "hintCard"
      );
    }

    helpers.createBasicCardContent(
      global.settings.interactionExample.nextVisualHint!,
      "hintCard"
    );
  }
}

export function removeShowChangesCard() {
  elements.removeElement("showChangesCard");
  elements.removeElement("showVisualChangesCard");
}

export function removeHintCard() {
  const visualsWithBorder = document.getElementsByClassName("greenBorder");
  if (visualsWithBorder.length != 0) {
    visualsWithBorder[0].className += " noBorder";
  }
  elements.removeElement("hintCard");
}
