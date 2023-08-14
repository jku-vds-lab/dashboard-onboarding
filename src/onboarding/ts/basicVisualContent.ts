import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";

export async function getCardInfo(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const dataNames = CGVisual?.encoding.values!;

  const generalImages = [];
  const generalInfos = [];
  const interactionImages: any[] = [];
  const interactionInfos: string[] = [];
  const insightImages: any[] = [];
  const insightInfos: string[] = [];

  generalImages.push("infoImg");
  generalInfos.push(CGVisual?.description!);

  let dataText = "";
  for (const dataName of dataNames) {
    const dataValue = await helpers.getSpecificDataInfo(
      visual,
      dataName.attribute
    );
    dataText +=
      " It shows the current value of " +
      dataName.attribute +
      ", which is " +
      dataValue[0] +
      ".";
  }

  generalImages.push("dataImg");
  generalInfos.push(
    "The purpose of this chart is to " + CGVisual?.task + "." + dataText
  );

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

export async function getCardChanges(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const dataNames = CGVisual?.encoding.values!;

  let visualInteractionInfo = "";
  for (const dataName of dataNames) {
    const dataValue = await helpers.getSpecificDataInfo(
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

export async function getSlicerInfo(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const filterName = CGVisual?.encoding.values[0];

  const generalImages = [];
  const generalInfos = [];
  const interactionImages = [];
  const interactionInfos = [];
  const insightImages: any[] = [];
  const insightInfos: string[] = [];

  generalImages.push("infoImg");
  generalInfos.push(CGVisual?.description!);

  if (filterName) {
    generalImages.push("dataImg");
    generalInfos.push(
      "With this one you can filter by " +
        filterName.attribute +
        ". The purpose of this chart is to " +
        CGVisual?.task +
        "."
    );
  }

  const filterText = helpers.getLocalFilterText(CGVisual);
  if (filterText !== "") {
    generalImages.push("filterImg");
    generalInfos.push("This chart has the following filters:<br>" + filterText);
  }

  interactionImages.push("interactImg");
  interactionInfos.push(CGVisual?.interactions.description!);

  if (filterName) {
    interactionImages.push("elemClickImg");
    interactionInfos.push(
      "With clicking on a " +
        CGVisual?.mark +
        " you can filter the report by " +
        filterName.attribute +
        "."
    );
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

export async function getSlicerInteractionExample(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  );
  const filterName = CGVisual?.encoding.values[0]!;
  const dataValues = await helpers.getSpecificDataInfo(
    visual,
    filterName.attribute
  );

  const middelOfDataValues = Math.floor(dataValues.length / 2);

  const interactionInfo =
    "Please click on the list element " + dataValues[middelOfDataValues] + ".";

  return interactionInfo;
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
  const axisValues = await helpers.getSpecificDataInfo(visual, axis);
  const legendValues = await helpers.getSpecificDataInfo(
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

  let visualInteractionInfo = helpers.getGeneralInteractionInfo(
    additionalFilters,
    dataName
  );

  if (axisValues && legendValues) {
    visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
    visualInteractionInfo += " and ";
    visualInteractionInfo +=
      helpers.getTargetInteractionFilter(legendAttribute);
  } else if (axisValues) {
    visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
  } else if (legendValues) {
    visualInteractionInfo +=
      helpers.getTargetInteractionFilter(legendAttribute);
  }
  visualInteractionInfo += ".";

  return visualInteractionInfo;
}
