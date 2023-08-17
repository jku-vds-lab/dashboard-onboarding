import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { VisualDescriptor } from "powerbi-client";

export async function getLineChartInfo(visual: VisualDescriptor) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const axisValue = CGVisual?.encoding.xAxes[0];
  let axis;
  if (axisValue) {
    axis = axisValue.attribute;
  }
  const legendValue = CGVisual?.encoding.legends[0];
  let legend;
  if (legendValue) {
    legend = legendValue.attribute;
  }
  const dataValue = CGVisual?.encoding.yAxes[0];
  let dataName;
  if (dataValue) {
    dataName = dataValue.attribute;
  }

  const generalImages = [];
  const generalInfos = [];
  const insightImages: any[] = [];
  const insightInfos: string[] = [];
  const interactionImages = [];
  const interactionInfos = [];

  generalImages.push("infoImg");
  generalInfos.push(CGVisual?.description!);

  const dataString = helpers.dataToString(CGVisual?.data.attributes!);
  const channelString = helpers.dataToString(CGVisual?.channel.channel!);
  generalImages.push("dataImg");
  generalInfos.push(
    "It displays " +
      dataString +
      ", they are encoded by " +
      channelString +
      ". The purpose of this chart is to " +
      CGVisual?.task +
      "."
  );

  let lineInfo = "";
  if (axis) {
    lineInfo +=
      "The " +
      CGVisual?.mark +
      "s show the development of the " +
      dataName +
      " over the " +
      axis +
      ".<br>";
  }
  if (legend) {
    lineInfo +=
      "Each " +
      CGVisual?.mark +
      " represents a different " +
      legend +
      ", they are distinguishable by their color.";
  }
  generalImages.push("lineGraphImg");
  generalInfos.push(lineInfo);

  interactionImages.push("interactImg");
  interactionInfos.push(CGVisual?.interactions.description!);

  let interactionInfo =
    "With clicking on a " + CGVisual?.mark + " you can filter the report by ";
  if (axis && !legend) {
    interactionInfo += axis + ".";
  } else if (!axis && legend) {
    interactionInfo += legend + ".";
  } else {
    interactionInfo += axis + " and " + legend + ".";
  }
  if (CGVisual?.encoding.hasTooltip) {
    interactionInfo +=
      "</br>You can hover over a " +
      CGVisual?.mark +
      " to get detailed information about its data.";
  }
  interactionImages.push("elemClickImg");
  interactionInfos.push(interactionInfo);

  if (axisValue && axisValue.isVisible) {
    generalImages.push("xAxisImg");
    generalInfos.push("The X-axis displays the values of the " + axis + ".");
    interactionImages.push("axisClickImg");
    interactionInfos.push(
      "When clicking on one of the x-axis-labels you can filter the report by " +
        axis +
        "."
    );
  }

  if (dataValue && dataValue.isVisible) {
    generalImages.push("yAxisImg");
    generalInfos.push(
      "The Y-axis displays the values of the " + dataName + "."
    );
  }

  if (legendValue && legendValue.isVisible) {
    generalImages.push("legendImg");
    generalInfos.push(
      "The legend displays the values of the " +
        legend +
        " and its corresponding color."
    );
    interactionImages.push("legendClickImg");
    interactionInfos.push(
      "When clicking on one of the labels in the legend you can filter the report by " +
        legend +
        "."
    );
  }

  const filterText = helpers.getLocalFilterText(CGVisual);
  if (filterText !== "") {
    generalImages.push("filterImg");
    generalInfos.push("This chart has the following filters:<br>" + filterText);
  }

  return {
    generalImages,
    generalInfos,
    interactionImages,
    interactionInfos,
    insightImages,
    insightInfos,
  };
}

export async function getLineChartInteractionExample(visual: VisualDescriptor) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const axis = CGVisual?.encoding.xAxes[0].attribute;
  const legend = CGVisual?.encoding.legends[0]
    ? CGVisual?.encoding.legends[0]?.attribute
    : "";
  const axisValues = await helpers.getSpecificDataInfo(visual, axis!);
  const legendValues = await helpers.getSpecificDataInfo(visual, legend!);

  const middelOfAxisValues = Math.floor(axisValues.length / 2);

  let interactionInfo = "Please click on the " + CGVisual?.mark;
  if (
    axisValues &&
    legendValues &&
    axisValues.length !== 0 &&
    legendValues.length !== 0
  ) {
    interactionInfo +=
      " representing " +
      legendValues[0] +
      " at the area of " +
      axisValues[middelOfAxisValues] +
      ".";
  } else if (axisValues && axisValues.length !== 0) {
    interactionInfo +=
      " at the area of " + axisValues[middelOfAxisValues] + ".";
  } else if (legendValues && legendValues.length !== 0) {
    interactionInfo += " representing " + legendValues[0] + ".";
  } else {
    interactionInfo += ".";
  }

  return interactionInfo;
}
