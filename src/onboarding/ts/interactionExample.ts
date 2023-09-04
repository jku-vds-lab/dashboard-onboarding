import * as infoCard from "./infoCards";
import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import * as elements from "./elements";
import { findCurrentTraversalVisual } from "./traversal";
import { VisualDescriptor } from "powerbi-client";
import InteractionExampleDescription from "./Content/Text Descriptions/interactionExampleDescription";
import Card from "./Content/Visualizations/cardVisualContent";
import BarChart from "./Content/Visualizations/barChartVisualContent";
import ColumnChart from "./Content/Visualizations/columnChartVisualContent";
import ComboChart from "./Content/Visualizations/comboChartVisualContent";
import LineChart from "./Content/Visualizations/lineChartVisualContent";
import Slicer from "./Content/Visualizations/slicerVisualContent";

export function startInteractionExample() {
  global.setInteractionMode(true);
  infoCard.removeInfoCard();
  const traversalElem = findCurrentTraversalVisual();
  if (traversalElem) {
    createInteractionCard(traversalElem[0]);
  }
}

export async function createInteractionCard(visual: VisualDescriptor) {
  const interactionDesc = new InteractionExampleDescription();
  disable.disableFrame();
  disable.createDisabledArea(visual);

  const position = helpers.getVisualCardPos(
    visual,
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
    helpers.createCard("interactionCard", style, "rectLeftBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "interactionCard"
    );
  } else {
    helpers.createCard("interactionCard", style, "rectRightBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "interactionCard"
    );
  }
  helpers.createCardContent(
    global.settings.interactionExample.title,
    "",
    "interactionCard"
  );
  helpers.createCardButtons("cardButtons", "", "", "back to visual");

  await getInteractionExampleText(visual);
}

 async function getInteractionExampleText(visual: VisualDescriptor){
  let exampleText = "";
  switch (visual.type) {
    case "lineClusteredColumnComboChart":
      const combo = new ComboChart();
      await combo.setVisualInformation(visual);
      exampleText = await combo.getComboChartInteractionExample();
      break;
    case "lineChart":
      const lineChart = new LineChart();
      await lineChart.setVisualInformation(visual);
      exampleText = await lineChart.getLineChartInteractionExample();
      break;
    case "clusteredBarChart":
      const barChart = new BarChart();
      await barChart.setVisualInformation(visual);
      exampleText = await barChart.getBarChartInteractionExample();
      break;
    case "clusteredColumnChart":
      const columnChart = new ColumnChart();
      await columnChart.setVisualInformation(visual);
      exampleText = await columnChart.getColumnChartInteractionExample();
      break;
    case "slicer":
      const slicer = new Slicer();
      await slicer.setVisualInformation(visual);
      exampleText = await slicer.getSlicerChartInteractionExample();
      break;
    default:
      break;
  }
  document.getElementById("contentText")!.innerHTML = exampleText;
}

export async function createInteractionCardForOutputPane(
  visual: VisualDescriptor
) {
  global.setInteractionMode(true);
  infoCard.removeInfoCard();
  const interactionDesc = new InteractionExampleDescription();
  disable.disableFrame();
  disable.createDisabledArea(visual);

  const position = helpers.getVisualCardPos(
    visual,
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
    helpers.createCard("interactionCard", style, "rectLeftBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "interactionCard"
    );
  } else {
    helpers.createCard("interactionCard", style, "rectRightBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "interactionCard"
    );
  }
  helpers.createCardContent(
    global.settings.interactionExample.title,
    "",
    "interactionCard"
  );

  helpers.createInteractionExampleButton("visualInfo", visual);

  // helpers.createCardButtons("cardButtons", "", "", "back to visual");
  // visual = visual as LineChart | BarChart | ColumnChart | ComboChart | Slicer;
  // await interactionDesc.getInteractionInfo(visual.type, visual);
}
export function removeInteractionCard() {
  elements.removeElement("interactionCard");
  elements.removeElement("disabledUpper");
  elements.removeElement("disabledLower");
  elements.removeElement("disabledRight");
  elements.removeElement("disabledLeft");
  disable.removeFrame();
}
