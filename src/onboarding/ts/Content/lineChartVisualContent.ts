import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import Beginner from "./beginnerText";
import BasicTextFormat, { UserLevel } from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";

export default class LineChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  beginnerText: Beginner;
  axisValue: XAxis;
  axis: string;
  legendValue: Legend;
  legend: string;
  dataValue: YAxis;
  dataName: string;
  userLevel: UserLevel;

  constructor(userLevel?: UserLevel) {
    super();

    this.text = {
      generalImages: [],
      generalInfos: [],
      insightImages: [],
      insightInfos: [],
      interactionImages: [],
      interactionInfos: [],
    };
    this.chart = new Visualization();
    this.beginnerText = new Beginner();
    this.axisValue = new XAxis();
    this.axis = "";
    this.legendValue = new Legend();
    this.legend = "";
    this.dataValue = new YAxis();
    this.dataName = "";
    this.userLevel = userLevel ?? UserLevel.Beginner;
  }

  async getLineChartInfo(visual: VisualDescriptor) {
    this.chart = await this.getVisualization(visual);

    this.axisValue = this.chart.encoding.xAxes[0];
    this.axis = this.axisValue && this.axisValue.attribute;
    this.legendValue = this.chart?.encoding.legends[0];
    this.legend = this.legendValue && this.legendValue.attribute;
    this.dataValue = this.chart?.encoding.yAxes[0];
    this.dataName = (this.dataValue && this.dataValue.attribute) || "";

    this.text = this.beginnerText.getBeginnerText("line", this);

    // this.getGeneralInfo();
    // this.getInteractionInfo();

    return this.text;
  }

  //   Line Chart shows the trend of New Hires over the Month.
  // Each line represents a different FPDesc distinguished by color.
  // The legend displays the values of the FPDesc and its corresponding color.
  // This chart has the following filters:

  // Line Chart shows the trend of New Hires over the Month.

  getInteractionInfo() {
    this.text.interactionImages.push("interactImg");
    // text.interactionInfos.push(CGVisual?.interactions.description!); // this should be the function down there

    let interactionInfo = this.beginnerText.interactionClickText(
      this.chart.type,
      this.axis,
      this.legend,
      this.chart?.mark
    );
    if (this.chart?.encoding.hasTooltip) {
      interactionInfo += this.beginnerText.interactionHoverText(
        this.chart.type,
        this.chart?.mark
      );
    }
    this.text.interactionImages.push("elemClickImg");
    this.text.interactionInfos.push(interactionInfo);

    if (this.axisValue && this.axisValue.isVisible) {
      this.text.interactionImages.push("axisClickImg");
      this.text.interactionInfos.push(
        "When clicking on one of the x-axis-labels you can filter the report by " +
          this.axis +
          "."
      );
    }

    if (this.dataValue && this.dataValue.isVisible) {
      this.text.generalImages.push("yAxisImg");
      this.text.generalInfos.push(
        "The Y-axis displays the values of the " + this.dataName + "."
      );
    }

    if (this.legendValue && this.legendValue.isVisible) {
      this.text.interactionImages.push("legendClickImg");
      this.text.interactionInfos.push(
        "When clicking on one of the labels in the legend you can filter the report by " +
          this.legend +
          "."
      );
    }

    const filterText = helpers.getLocalFilterText(this.chart);
    if (filterText !== "") {
      this.text.generalImages.push("filterImg");
      this.text.generalInfos.push(
        "This chart has the following filters:<br>" + filterText
      );
    }
  }

  getInsightInfo() {}
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

// this was originally a part of Interactions.ts
// getInteractionDescription() {
//   const attributeString = dataToString(this.interactionAttributes);
//   const chartNamesHighlighting = visuals
//     .filter((vis) => this.interactionChartsHighlighting.includes(vis.name))
//     .map((vis) => vis.title);
//   const chartStringHighlighting = dataToString(chartNamesHighlighting);
//   const chartNamesFiltering = visuals
//     .filter((vis) => this.interactionChartsFiltering.includes(vis.name))
//     .map((vis) => vis.title);
//   const chartStringFiltering = dataToString(chartNamesFiltering);

//   return (
//     "This chart supports interactions on " +
//     attributeString +
//     ". Highlighting interactions on this chart will effect " +
//     chartStringHighlighting +
//     ". Filtering interactions on this chart will effect " +
//     chartStringFiltering +
//     "."
//   );
// }

// import { dataToString } from "../onboarding/ts/helperFunctions";
// import { visuals } from "./ComponentGraph";
