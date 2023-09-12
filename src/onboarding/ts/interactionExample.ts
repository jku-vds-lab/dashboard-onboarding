import * as infoCard from "./infoCards";
import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import * as elements from "./elements";
import { TraversalElement, currentId, findCurrentTraversalVisual } from "./traversal";
import { VisualDescriptor } from "powerbi-client";
import InteractionExampleDescription from "./Content/Text Descriptions/interactionExampleDescription";
import BarChart from "./Content/Visualizations/BarChartVisualContent";
import ColumnChart from "./Content/Visualizations/ColumnChartVisualContent";
import ComboChart from "./Content/Visualizations/ComboChartVisualContent";
import LineChart from "./Content/Visualizations/LineChartVisualContent";
import Slicer from "./Content/Visualizations/SlicerVisualContent";
import GlobalFilters from "./Content/Visualizations/GlobalFiltersVisualContent";
import { removeFilterInfoCard } from "./filterInfoCards";

export function startInteractionExample() {
  global.setInteractionMode(true);
  infoCard.removeInfoCard();
  removeFilterInfoCard();

  let traversal: TraversalElement[];
  if (global.explorationMode) {
    traversal = global.basicTraversal;
  } else {
    traversal = global.settings.traversalStrategy;
  }
  const traversalElemId = traversal[currentId].element.id;

  if (traversalElemId === "globalFilter") {
      createInteractionCard(traversalElemId);
  } else{
    const visual = findCurrentTraversalVisual();
    if(visual){
      createInteractionCard(traversalElemId, visual[0]);
    }
  }
}

export async function createInteractionCard(visualType: string, visual?: VisualDescriptor) {
  let position;
  if(visualType === "globalFilter"){
    disable.createFilterDisabledArea();

    position = {
      y: global.infoCardMargin,
      x: global.reportWidth! - global.infoCardMargin - global.infoCardWidth,
      pos: "left"
    }

  } else {
    disable.disableFrame();
    disable.createDisabledArea(visual);
  
    position = helpers.getVisualCardPos(
      visual!,
      global.infoCardWidth,
      global.infoCardMargin
    );
  }

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

  await getInteractionExampleText(visualType, visual);
}

async function getInteractionExampleText(visualType: string, visual?: VisualDescriptor) {
  let exampleText = "";
  switch (visualType) {
    case "globalFilter":
      const filter = new GlobalFilters();
      await filter.setGlobalFilterInformation();
      exampleText = await filter.getGlobalFilterInteractionExample();
      break;
    case "lineClusteredColumnComboChart":
      const combo = new ComboChart();
      await combo.setVisualInformation(visual!);
      exampleText = await combo.getComboChartInteractionExample();
      break;
    case "lineChart":
      const lineChart = new LineChart();
      await lineChart.setVisualInformation(visual!);
      exampleText = await lineChart.getLineChartInteractionExample();
      break;
    case "clusteredBarChart":
      const barChart = new BarChart();
      await barChart.setVisualInformation(visual!);
      exampleText = await barChart.getBarChartInteractionExample();
      break;
    case "clusteredColumnChart":
      const columnChart = new ColumnChart();
      await columnChart.setVisualInformation(visual!);
      exampleText = await columnChart.getColumnChartInteractionExample();
      break;
    case "slicer":
      const slicer = new Slicer();
      await slicer.setVisualInformation(visual!);
      exampleText = await slicer.getSlicerInteractionExample();
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

  helpers.createInteractionExampleButton("visualInfo");

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
