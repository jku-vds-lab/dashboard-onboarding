import * as helpers from "./../../componentGraph/helperFunctions";
import * as global from "./globalVariables";

export async function getLineClusteredColumnComboChartChanges(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const axis = CGVisual?.encoding.xAxes[0].attribute!;
  const axisValues = await helpers.getSpecificDataInfo(visual, axis!);
  const dataArray = CGVisual?.encoding.yAxes!;

  const additionalFilters = global.selectedTargets.filter(function (data: {
    target: { column: string };
  }) {
    return (
      data.target.column != axis &&
      dataArray.filter((yAxis) => yAxis.attribute === data.target.column)
        .length == 0
    );
  });

  const allAttributs = dataArray.map((yAxis) => yAxis.attribute);
  const allDataString = helpers.dataToString(allAttributs);

  let visualInteractionInfo = getGeneralInteractionInfo(
    additionalFilters,
    allDataString
  );

  // if (axisValues) {
  //   visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
  // }
  visualInteractionInfo += ".";

  return visualInteractionInfo;
}
export function getGeneralInteractionInfo(
  additionalFilters: global.Target[],
  filterString: string
) {
  let visualInteractionInfo = "The highlighted data includes ";

  if (additionalFilters.length != 0) {
    let dataString = "";
    for (let i = 0; i < additionalFilters.length; i++) {
      dataString +=
        additionalFilters[i].target.column + " " + additionalFilters[i].equals;
      if (i != additionalFilters.length - 1) {
        dataString += " and ";
      }
    }
    visualInteractionInfo += " the " + filterString + " of " + dataString;
  } else {
    visualInteractionInfo += "all " + filterString;
  }

  return visualInteractionInfo;
}
