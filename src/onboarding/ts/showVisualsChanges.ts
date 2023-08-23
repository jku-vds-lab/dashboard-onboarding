import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import { getCardChanges, getChartChanges } from "./basicVisualContent";
import { getLineClusteredColumnComboChartChanges } from "./complexVisualContent";
import { showReportChanges } from "./showReportChanges";
import { VisualDescriptor } from "powerbi-client";
import { dataToString, getData } from "../../componentGraph/helperFunctions";
import { getStandartCategories } from "./traversal";

export async function showVisualChanges(selectedVisual: VisualDescriptor) {
  const visualData = getData(selectedVisual, getStandartCategories(selectedVisual.type));

  if (
    visualData &&
    visualData.interactionChangedInfosStatus != global.infoStatus.deleted
  ) {
    disable.disableFrame();
    disable.createDisabledArea(selectedVisual);

    const position = helpers.getVisualCardPos(
      selectedVisual,
      global.infoCardWidth,
      global.infoCardMargin
    );

    const style = helpers.getCardStyle(
      position.y,
      position.x,
      global.infoCardWidth,
      ""
    );
    if (position.pos === "left") {
      helpers.createCard("showVisualChangesCard", style, "rectLeftBig");
      helpers.createCloseButton(
        "closeButton",
        "closeButtonPlacementBig",
        "",
        helpers.removeOnboarding,
        "showVisualChangesCard"
      );
    } else {
      helpers.createCard("showVisualChangesCard", style, "rectRightBig");
      helpers.createCloseButton(
        "closeButton",
        "closeButtonPlacementBig",
        "",
        helpers.removeOnboarding,
        "showVisualChangesCard"
      );
    }

    helpers.createCardContent(
      global.settings.interactionExample.title,
      "",
      "showVisualChangesCard"
    );
    helpers.createCardButtons(
      "cardButtons",
      "back to visual",
      "",
      "back to overview"
    );

    await createShowVisualChangesInfo(selectedVisual);
  } else {
    showReportChanges();
  }
}

async function createShowVisualChangesInfo(visual: VisualDescriptor) {
  const visualData = getData(visual, getStandartCategories(visual.type));
  let visualChangeInfo;

  switch (visualData?.interactionChangedInfosStatus) {
    case global.infoStatus.original:
      visualChangeInfo = await getShowVisualChangesText(visual);
      break;
    case global.infoStatus.changed:
    case global.infoStatus.added:
      visualChangeInfo = visualData.changedInteractionChangedInfo;
      break;
    default:
      break;
  }

  document.getElementById("contentText")!.innerHTML = "";
  document.getElementById("contentText")!.innerHTML += visualChangeInfo;
}

export async function getShowVisualChangesText(visual: VisualDescriptor) {
  const allTargets = global.selectedTargets.map(({ equals }) => equals);
  const allTargetsString = dataToString(allTargets);
  let visualChangeInfo =
    "You can see that this visual was filtered by " +
    allTargetsString +
    ".<br>";

  switch (visual.type) {
    case "card":
    case "multiRowCard":
      visualChangeInfo += await getCardChanges(visual);
      break;
    case "lineClusteredColumnComboChart":
      visualChangeInfo += await getLineClusteredColumnComboChartChanges(visual);
      visualChangeInfo += displayAdditionalInfo();
      break;
    case "lineChart":
    case "clusteredColumnChart":
      visualChangeInfo += await getChartChanges(visual, true);
      visualChangeInfo += displayAdditionalInfo();
      break;
    case "clusteredBarChart":
      visualChangeInfo += await getChartChanges(visual, false);
      visualChangeInfo += displayAdditionalInfo();
      break;
    default:
      break;
  }

  return visualChangeInfo;
}

function displayAdditionalInfo() {
  return "<br>For some visuals the data is not filtered but highlighted. You can see the highlighted data of a visual in the tooltip.<br>You can also change the report filters by selecting a new element of this visual.";
}
