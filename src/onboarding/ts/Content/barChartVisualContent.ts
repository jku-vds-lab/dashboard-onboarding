import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import Beginner from "./beginnerText";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";

export default class BarChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  beginnerText: Beginner;
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
    this.chart = new Visualization();
    this.beginnerText = new Beginner();
    this.axisValue = new XAxis();
    this.axis = "";
    this.legendValue = new Legend();
    this.legend = "";
    this.dataValue = new YAxis();
    this.dataName = "";
  }

  async getClusteredBarChartInfo(visual: VisualDescriptor) {
    this.chart = await this.getVisualization(visual);

    this.axisValue = this.chart.encoding.xAxes[0];
    this.axis = this.chart.encoding.yAxes[0]
      ? this.chart.encoding.yAxes[0].attribute!
      : "";
    this.legendValue = this.chart?.encoding.legends[0];
    this.legend = this.chart.encoding.legends[0]
      ? this.chart.encoding.legends[0].attribute
      : "";

    this.dataName = this.chart.encoding.xAxes[0]
      ? this.chart.encoding.xAxes[0].attribute!
      : "";

    // this.getGeneralInfo();
    this.text = this.beginnerText.getBeginnerText("bar", this);
    this.getInteractionInfo();

    return this.text;
  }

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

    if (this.axis && this.chart.encoding.yAxes[0].isVisible) {
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
