import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import NoviceText from "./generalDescription";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";
import { getSpecificDataInfo } from "../../../componentGraph/helperFunctions";

export default class ColumnChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  noviceText: NoviceText;
  axisValue: YAxis;
  axis: string;
  axisValues: string[];
  legendValue: Legend;
  legend: string;
  legendValues: string[];
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
    this.chart = new Visualization();
    this.noviceText = new NoviceText();
    this.axisValue = new YAxis();
    this.axis = "";
    this.axisValues = [];
    this.legendValue = new Legend();
    this.legend = "";
    this.legendValues = [];
    this.dataValue = new YAxis();
    this.dataName = "";
  }

  async getClusteredColumnChartInfo(visual: VisualDescriptor) {
    this.chart = await this.getVisualization(visual);
    this.axisValue = this.chart.encoding.yAxes[0];
    this.axis = this.chart.encoding.xAxes[0]
      ? this.chart.encoding.xAxes[0].attribute!
      : "";
    this.axisValues = this.chart.encoding.yAxes[0]
      ? await getSpecificDataInfo(visual, this.axis)
      : [];

    this.legendValue = this.chart?.encoding.legends[0];
    this.legend = this.chart.encoding.legends[0]
      ? this.chart.encoding.legends[0].attribute
      : "";
    this.legendValues = this.chart.encoding.legends[0]
      ? await getSpecificDataInfo(visual, this.legend)
      : [];

    this.dataName = this.chart.encoding.yAxes[0]
      ? this.chart.encoding.yAxes[0].attribute!
      : "";

    this.getGeneralInfo();

    return this.text;
  }

  getGeneralInfo() {
    this.text.generalImages.push("infoImg");
    this.text.generalInfos.push("This element is a column chart.");

    const dataString = helpers.dataToString(this.chart?.data.attributes!);
    const channelString = helpers.dataToString(this.chart?.channel.channel!);
    this.text.generalImages.push("dataImg");

    const purposeText = this.noviceText.purposeText(
      this.chart.type,
      channelString,
      dataString,
      this.chart?.task
    );

    this.text.generalInfos.push(purposeText);

    let barInfo = "";
    if (this.axis) {
      barInfo += this.noviceText.axisText(
        this.chart.type,
        this.chart?.mark,
        this.dataName,
        this.axis
      );
    }
    if (this.legend) {
      barInfo += this.noviceText.legendText(
        this.chart.type,
        this.chart?.mark,
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
      this.chart.type,
      this.axis,
      this.legend,
      this.chart?.mark
    );
    if (this.chart?.encoding.hasTooltip) {
      interactionInfo += this.noviceText.interactionHoverText(
        this.chart.type,
        this.chart?.mark
      );
    }
    this.text.interactionImages.push("elemClickImg");
    this.text.interactionInfos.push(interactionInfo);

    if (this.axis && this.chart.encoding.xAxes[0].isVisible) {
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
    if (this.axisValue && this.axisValue.isVisible) {
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
