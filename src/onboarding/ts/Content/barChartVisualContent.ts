import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import GeneralDescription from "./generalDescription";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";

export default class BarChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  textDescription: GeneralDescription;
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
    this.textDescription = new GeneralDescription();
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
    this.text = this.textDescription.getAdvancedVisDesc("bar", this);
    return this.text;
  }
  getInsightInfo() {}
}
