import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import NoviceText from "./noviceText";
import BasicTextFormat from "./Format/basicTextFormat";

export async function getLineChartInfo(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const chartType = "line";
  const noviceText = new NoviceText();
  const axisValue = CGVisual?.encoding.xAxes[0];
  const axis = (axisValue && axisValue.attribute) || "";
  const legendValue = CGVisual?.encoding.legends[0];
  const legend = (legendValue && legendValue.attribute) || "";
  const dataValue = CGVisual?.encoding.yAxes[0];
  const dataName = (dataValue && dataValue.attribute) || "";

  const text: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    insightImages: [],
    insightInfos: [],
    interactionImages: [],
    interactionInfos: [],
  };

  text.generalImages.push("infoImg");
  text.generalInfos.push(CGVisual?.description!);

  const dataString = helpers.dataToString(CGVisual?.data.attributes!);
  const channelString = helpers.dataToString(CGVisual?.visual_channel.channel!);
  text.generalImages.push("dataImg");

  const purposeText = noviceText.purposeText(
    chartType,
    channelString,
    dataString,
    CGVisual?.task
  );

  text.generalInfos.push(purposeText);

  let lineInfo = "";
  if (axis) {
    lineInfo += noviceText.axisText(chartType, CGVisual?.mark, dataName, axis);
  }
  if (legend) {
    lineInfo += noviceText.legendText(chartType, CGVisual?.mark, legend);
  }
  text.generalImages.push("lineGraphImg");
  text.generalInfos.push(lineInfo);

  // interaction

  text.interactionImages.push("interactImg");
  text.interactionInfos.push(CGVisual?.interactions.description!);

  let interactionInfo = noviceText.interactionClickText(
    chartType,
    axis,
    legend,
    CGVisual?.mark
  );
  if (CGVisual?.encoding.hasTooltip) {
    interactionInfo += noviceText.interactionHoverText(
      chartType,
      CGVisual?.mark
    );
  }
  text.interactionImages.push("elemClickImg");
  text.interactionInfos.push(interactionInfo);

  if (axisValue && axisValue.isVisible) {
    text.generalImages.push("xAxisImg");
    text.generalInfos.push(
      "The X-axis displays the values of the " + axis + "."
    );
    text.interactionImages.push("axisClickImg");
    text.interactionInfos.push(
      "When clicking on one of the x-axis-labels you can filter the report by " +
        axis +
        "."
    );
  }

  if (dataValue && dataValue.isVisible) {
    text.generalImages.push("yAxisImg");
    text.generalInfos.push(
      "The Y-axis displays the values of the " + dataName + "."
    );
  }

  if (legendValue && legendValue.isVisible) {
    text.generalImages.push("legendImg");
    text.generalInfos.push(
      "The legend displays the values of the " +
        legend +
        " and its corresponding color."
    );
    text.interactionImages.push("legendClickImg");
    text.interactionInfos.push(
      "When clicking on one of the labels in the legend you can filter the report by " +
        legend +
        "."
    );
  }

  const filterText = helpers.getLocalFilterText(CGVisual);
  if (filterText !== "") {
    text.generalImages.push("filterImg");
    text.generalInfos.push(
      "This chart has the following filters:<br>" + filterText
    );
  }

  return text;
}

export async function getLineChartInteractionExample(visual: any) {
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
