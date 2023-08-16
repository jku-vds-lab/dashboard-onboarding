import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import NoviceText from "./noviceText";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";

export default class BarChart extends Visualization {
  barChart: Visualization;
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
    this.barChart = new Visualization();
    this.noviceText = new NoviceText();
    this.axisValue = new XAxis();
    this.axis = "";
    this.legendValue = new Legend();
    this.legend = "";
    this.dataValue = new YAxis();
    this.dataName = "";
  }

  async getClusteredBarChartInfo(visual: VisualDescriptor) {
    this.barChart = await this.getVisualization(visual);

    this.axisValue = this.barChart.encoding.xAxes[0];
    this.axis = this.barChart.encoding.yAxes[0]
      ? this.barChart.encoding.yAxes[0].attribute!
      : "";
    this.legendValue = this.barChart?.encoding.legends[0];
    this.legend = this.barChart.encoding.legends[0]
      ? this.barChart.encoding.legends[0].attribute
      : "";

    this.dataName = this.barChart.encoding.xAxes[0]
      ? this.barChart.encoding.xAxes[0].attribute!
      : "";

    this.getGeneralInfo();

    return this.text;
  }

  getGeneralInfo() {
    this.text.generalImages.push("infoImg");
    this.text.generalInfos.push("This element is a bar chart.");

    const dataString = helpers.dataToString(this.barChart?.data.attributes!);
    const channelString = helpers.dataToString(this.barChart?.channel.channel!);
    this.text.generalImages.push("dataImg");

    const purposeText = this.noviceText.purposeText(
      this.barChart.type,
      channelString,
      dataString,
      this.barChart?.task
    );

    this.text.generalInfos.push(purposeText);

    let barInfo = "";
    if (this.axis) {
      barInfo += this.noviceText.axisText(
        this.barChart.type,
        this.barChart?.mark,
        this.dataName,
        this.axis
      );
    }
    if (this.legend) {
      barInfo += this.noviceText.legendText(
        this.barChart.type,
        this.barChart?.mark,
        this.legend
      );
    }
    this.text.generalImages.push("barGraphImg");
    this.text.generalInfos.push(barInfo);
  }

  getInteractionInfo() {
    this.text.interactionImages.push("interactImg");
    // text.interactionInfos.push(CGVisual?.interactions.description!); // this should be the function down there

    let interactionInfo = this.noviceText.interactionClickText(
      this.barChart.type,
      this.axis,
      this.legend,
      this.barChart?.mark
    );
    if (this.barChart?.encoding.hasTooltip) {
      interactionInfo += this.noviceText.interactionHoverText(
        this.barChart.type,
        this.barChart?.mark
      );
    }
    this.text.interactionImages.push("elemClickImg");
    this.text.interactionInfos.push(interactionInfo);

    if (this.axis && this.barChart.encoding.yAxes[0].isVisible) {
      this.text.generalImages.push("yAxisImg");
      this.text.generalInfos.push(
        "The Y-axis displays the values of the " + this.axis + "."
      );
      this.text.interactionImages.push("axisClickImg");
      this.text.interactionInfos.push(
        "When clicking on one of the y-axis-labels you can filter the report by " +
          this.axis +
          "."
      );
    }
    if (this.axisValue && this.axisValue.isVisible) {
      this.text.generalImages.push("xAxisImg");
      this.text.generalInfos.push(
        "The X-axis displays the values of the " + this.dataName + "."
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

    const filterText = helpers.getLocalFilterText(this.barChart);
    if (filterText !== "") {
      this.text.generalImages.push("filterImg");
      this.text.generalInfos.push(
        "This chart has the following filters:<br>" + filterText
      );
    }
  }

  getInsightInfo() {}
}
