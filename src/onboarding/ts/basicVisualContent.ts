import * as helper from "./../../componentGraph/helperFunctions";
import { getGeneralInteractionInfo } from "./complexVisualContent";
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
    const allAxis = [];
    for(const axis of CGVisual?.encoding.xAxes!){
      allAxis.push(axis.attribute!);
    }
    dataName = helper.dataToString(allAxis, "and");
  } else {
    axis = CGVisual?.encoding.xAxes[0].attribute!;
    const allAxis = [];
    for(const axis of CGVisual?.encoding.yAxes!){
      allAxis.push(axis.attribute!);
    }
    dataName = helper.dataToString(allAxis, "and");
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

  let visualInteractionInfo = getGeneralInteractionInfo(
    additionalFilters,
    dataName
  );

  if (axisValues.length !== 0 && legendValues.length !== 0) {
    visualInteractionInfo += getTargetInteractionFilter(axis);
    visualInteractionInfo += " and ";
    visualInteractionInfo +=
      getTargetInteractionFilter(legendAttribute);
  } else if (axisValues.length !== 0) {
    visualInteractionInfo += getTargetInteractionFilter(axis);
  } else if (legendValues.length !== 0) {
    visualInteractionInfo +=
      getTargetInteractionFilter(legendAttribute);
  }
  visualInteractionInfo += ".";

  return visualInteractionInfo;
}

function getTargetInteractionFilter(target: string){
  let visualInteractionInfo = "";
  const filter = global.selectedTargets.filter(function (data) {
      return data.target.column == target;
  });
  if(filter.length == 0){
      visualInteractionInfo += " for all " + target + "s"; 
  }else{
      visualInteractionInfo += " for " + filter[0].equals;   
  }
  return visualInteractionInfo;
}