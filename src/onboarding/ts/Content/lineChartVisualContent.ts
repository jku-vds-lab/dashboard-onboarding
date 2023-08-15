import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import NoviceText from "./noviceText";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";

export default class LineChart extends Visualization {
  lineChart: Visualization;
  text: BasicTextFormat;
  noviceText: NoviceText;
  axisValue: XAxis;
  axis: string;
  legendValue: Legend;
  legend: string;
  dataValue: YAxis;
  dataName: string;

  constructor() {
    super();

    this.text = {
      generalImages: [],
      generalInfos: [],
      insightImages: [],
      insightInfos: [],
      interactionImages: [],
      interactionInfos: [],
    };
    this.lineChart = new Visualization();
    this.noviceText = new NoviceText();
    this.axisValue = new XAxis();
    this.axis = "";
    this.legendValue = new Legend();
    this.legend = "";
    this.dataValue = new YAxis();
    this.dataName = "";
  }

  async getLineChartInfo(visual: VisualDescriptor) {
    this.lineChart = await this.getVisualization(visual);
    this.axisValue = this.lineChart.encoding.xAxes[0];
    this.axis = this.axisValue && this.axisValue.attribute;
    this.legendValue = this.lineChart?.encoding.legends[0];
    this.legend = this.legendValue && this.legendValue.attribute;
    this.dataValue = this.lineChart?.encoding.yAxes[0];
    this.dataName = (this.dataValue && this.dataValue.attribute) || "";

    this.getGeneralInfo();

    return this.text;
  }

  getGeneralInfo() {
    this.text.generalImages.push("infoImg");
    this.text.generalInfos.push("This element is a line chart.");

    const dataString = helpers.dataToString(this.lineChart?.data.attributes!);
    const channelString = helpers.dataToString(
      this.lineChart?.channel.channel!
    );
    this.text.generalImages.push("dataImg");

    const purposeText = this.noviceText.purposeText(
      this.lineChart.type,
      channelString,
      dataString,
      this.lineChart?.task
    );

    this.text.generalInfos.push(purposeText);

    let lineInfo = "";
    if (this.axis) {
      lineInfo += this.noviceText.axisText(
        this.lineChart.type,
        this.lineChart?.mark,
        this.dataName,
        this.axis
      );
    }
    if (this.legend) {
      lineInfo += this.noviceText.legendText(
        this.lineChart.type,
        this.lineChart?.mark,
        this.legend
      );
    }
    this.text.generalImages.push("lineGraphImg");
    this.text.generalInfos.push(lineInfo);
  }

  getInteractionInfo() {
    this.text.interactionImages.push("interactImg");
    // text.interactionInfos.push(CGVisual?.interactions.description!); // this should be the function down there

    let interactionInfo = this.noviceText.interactionClickText(
      this.lineChart.type,
      this.axis,
      this.legend,
      this.lineChart?.mark
    );
    if (this.lineChart?.encoding.hasTooltip) {
      interactionInfo += this.noviceText.interactionHoverText(
        this.lineChart.type,
        this.lineChart?.mark
      );
    }
    this.text.interactionImages.push("elemClickImg");
    this.text.interactionInfos.push(interactionInfo);

    if (this.axisValue && this.axisValue.isVisible) {
      this.text.generalImages.push("xAxisImg");
      this.text.generalInfos.push(
        "The X-axis displays the values of the " + this.axis + "."
      );
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
      this.text.generalImages.push("legendImg");
      this.text.generalInfos.push(
        "The legend displays the values of the " +
          this.legend +
          " and its corresponding color."
      );
      this.text.interactionImages.push("legendClickImg");
      this.text.interactionInfos.push(
        "When clicking on one of the labels in the legend you can filter the report by " +
          this.legend +
          "."
      );
    }

    const filterText = helpers.getLocalFilterText(this.lineChart);
    if (filterText !== "") {
      this.text.generalImages.push("filterImg");
      this.text.generalInfos.push(
        "This chart has the following filters:<br>" + filterText
      );
    }
  }

  getInsightInfo() {}
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
