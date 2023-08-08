import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";

export async function getClusteredBarChartInfo(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const axis = CGVisual?.encoding.yAxes[0]
    ? CGVisual?.encoding.yAxes[0].attribute!
    : null;
  const dataName = CGVisual?.encoding.xAxes[0]
    ? CGVisual?.encoding.xAxes[0].attribute!
    : null;

  return await getClusteredBarAndColumnChartInfo(visual, axis, dataName, false);
}

export async function getClusteredColumnChartInfo(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const axis = CGVisual?.encoding.xAxes[0]
    ? CGVisual?.encoding.xAxes[0].attribute!
    : null;
  const dataName = CGVisual?.encoding.yAxes[0]
    ? CGVisual?.encoding.yAxes[0].attribute!
    : null;

  return await getClusteredBarAndColumnChartInfo(visual, axis, dataName, true);
}

export async function getClusteredBarAndColumnChartInfo(
  visual: any,
  axis: string | null,
  dataName: string | null,
  isHorizontal: boolean
) {
  const generalImages = [];
  const generalInfos = [];
  const interactionImages = [];
  const interactionInfos = [];
  const insightImages: any[] = [];
  const insightInfos: string[] = [];

  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const legend = CGVisual?.encoding.legends[0]
    ? CGVisual?.encoding.legends[0].attribute
    : null;

  generalImages.push("infoImg");
  generalInfos.push(CGVisual?.description!);

  const dataString = helpers.dataToString(CGVisual?.data.attributes!);
  const channelString = helpers.dataToString(CGVisual?.visual_channel.channel!);
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

  let barInfo = "";
  if (axis) {
    barInfo += "The " + CGVisual?.mark + "s are separated by " + axis + ".<br>";
  }
  if (legend) {
    barInfo +=
      "Each " +
      axis +
      " has more than one " +
      CGVisual?.mark +
      ". This " +
      CGVisual?.mark +
      "s represent the " +
      legend +
      " and are distinguishable by their color.";
  }
  generalImages.push("barChartImg");
  generalInfos.push(barInfo);

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

  if (isHorizontal) {
    if (CGVisual?.encoding.xAxes[0] && CGVisual?.encoding.xAxes[0].isVisible) {
      generalImages.push("xAxisImg");
      generalInfos.push("The X-axis displays the values of the " + axis + ".");
      interactionImages.push("axisClickImg");
      interactionInfos.push(
        "When clicking on one of the x-axis-labels you can filter the report by " +
          axis +
          "."
      );
    }
    if (CGVisual?.encoding.yAxes[0] && CGVisual?.encoding.yAxes[0].isVisible) {
      generalImages.push("yAxisImg");
      generalInfos.push(
        "The Y-axis displays the values of the " + dataName + "."
      );
    }
  } else {
    if (CGVisual?.encoding.yAxes[0] && CGVisual?.encoding.yAxes[0].isVisible) {
      generalImages.push("yAxisImg");
      generalInfos.push("The Y-axis displays the values of the " + axis + ".");
      interactionImages.push("axisClickImg");
      interactionInfos.push(
        "When clicking on one of the y-axis-labels you can filter the report by " +
          axis +
          "."
      );
    }
    if (CGVisual?.encoding.xAxes[0] && CGVisual?.encoding.xAxes[0].isVisible) {
      generalImages.push("xAxisImg");
      generalInfos.push(
        "The X-axis displays the values of the " + dataName + "."
      );
    }
  }

  if (
    CGVisual?.encoding.legends[0] &&
    CGVisual?.encoding.legends[0].isVisible
  ) {
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

export async function getBarChartInteractionExample(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const axis = CGVisual?.encoding.yAxes[0]
    ? CGVisual?.encoding.yAxes[0].attribute!
    : "";
  const dataName = CGVisual?.encoding.xAxes[0]
    ? CGVisual?.encoding.xAxes[0].attribute!
    : "";

  return await getBarAndColumnChartInteractionExample(visual, axis, dataName);
}

export async function getColumnChartInteractionExample(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const axis = CGVisual?.encoding.xAxes[0]
    ? CGVisual?.encoding.xAxes[0].attribute!
    : "";
  const dataName = CGVisual?.encoding.yAxes[0]
    ? CGVisual?.encoding.yAxes[0].attribute!
    : "";

  return await getBarAndColumnChartInteractionExample(visual, axis, dataName);
}

export async function getBarAndColumnChartInteractionExample(
  visual: any,
  axis: string,
  dataName: string
) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const legend = CGVisual?.encoding.legends[0]
    ? CGVisual?.encoding.legends[0].attribute!
    : "";
  const axisValues = await helpers.getSpecificDataInfo(visual, axis);
  const legendValues = await helpers.getSpecificDataInfo(visual, legend);

  const middelOfAxisValues = Math.floor(axisValues.length / 2);

  let interactionInfo = "Please click on the " + CGVisual?.mark;
  if (dataName !== "") {
    interactionInfo += " representing the " + dataName;
  }
  if (
    axisValues &&
    legendValues &&
    axisValues.length !== 0 &&
    legendValues.length !== 0
  ) {
    interactionInfo +=
      " for " +
      axisValues[middelOfAxisValues] +
      " and " +
      legendValues[0] +
      ".";
  } else if (axisValues && axisValues.length !== 0) {
    interactionInfo += " for " + axisValues[middelOfAxisValues] + ".";
  } else if (legendValues && legendValues.length !== 0) {
    interactionInfo += " for " + legendValues[0] + ".";
  } else {
    interactionInfo += ".";
  }

  return interactionInfo;
}
