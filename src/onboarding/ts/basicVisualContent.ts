import * as helper from "./../../componentGraph/helperFunctions";
import * as global from "./globalVariables";
import { VisualDescriptor } from "powerbi-client";

export async function getCardChanges(visual: VisualDescriptor) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const dataNames = CGVisual?.encoding.values!;

  let visualInteractionInfo = "";
  for (const dataName of dataNames) {
    const dataValue = await helper.getSpecificDataInfo(
      visual,
      dataName.attribute
    );
    visualInteractionInfo +=
      "The displayed data of " +
      dataName.attribute +
      " is now " +
      dataValue[0] +
      ". ";
  }

  return visualInteractionInfo;
}

export async function getChartChanges(visual: any, isVertical: boolean) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const legend = CGVisual?.encoding.legends[0];
  let legendAttribute = "";
  if (legend) {
    legendAttribute = legend.attribute!;
  }
  let axis = "";
  let dataName = "";

  if (!isVertical) {
    axis = CGVisual?.encoding.yAxes[0].attribute!;
    dataName = CGVisual?.encoding.xAxes[0].attribute!;
  } else {
    axis = CGVisual?.encoding.xAxes[0].attribute!;
    dataName = CGVisual?.encoding.yAxes[0].attribute!;
  }
  const axisValues = await helper.getSpecificDataInfo(visual, axis);
  const legendValues = await helper.getSpecificDataInfo(
    visual,
    legendAttribute
  );

  const additionalFilters = global.selectedTargets.filter(function (
    selectedData: global.Target
  ) {
    return (
      selectedData.target.column != axis &&
      selectedData.target.column != legendAttribute
    );
  });

  // let visualInteractionInfo = helpers.getGeneralInteractionInfo(
  //   additionalFilters,
  //   dataName
  // );

  // if (axisValues && legendValues) {
  //   visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
  //   visualInteractionInfo += " and ";
  //   visualInteractionInfo +=
  //     helpers.getTargetInteractionFilter(legendAttribute);
  // } else if (axisValues) {
  //   visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
  // } else if (legendValues) {
  //   visualInteractionInfo +=
  //     helpers.getTargetInteractionFilter(legendAttribute);
  // }
  // visualInteractionInfo += ".";

  return "visualInteractionInfo";
}
