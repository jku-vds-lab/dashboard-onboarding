import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import TextDescription from "./textDescription";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";

export default class BarChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  textDescription: TextDescription;
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
    this.textDescription = new TextDescription();
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

    //this.text = this.textDescription.getBeginnerText("bar", this);
    // this.text = this.textDescription.getIntermediateText("bar", this);
    this.text = this.textDescription.getAdvancedText("bar", this);
    return this.text;
  }

  getInteractionInfo() {
    this.text.interactionImages.push("interactImg");
    // text.interactionInfos.push(CGVisual?.interactions.description!); // this should be the function down there

    let interactionInfo = this.textDescription.interactionClickText(
      this.chart.type,
      this.axis,
      this.legend,
      this.chart?.mark
    );
    if (this.chart?.encoding.hasTooltip) {
      interactionInfo += this.textDescription.interactionHoverText(
        this.chart.type,
        this.chart?.mark
      );
    }
    this.text.interactionImages.push("elemClickImg");
    this.text.interactionInfos.push(interactionInfo);

    if (this.axis && this.chart.encoding.yAxes[0].isVisible) {
      this.text.interactionImages.push("axisClickImg");
      this.text.interactionInfos.push(
        "When clicking on one of the y-axis-labels you can filter the report by " +
          this.axis +
          "."
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
  }

  getInsightInfo() {}
}
