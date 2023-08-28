import NoviceText from "./generalDescription";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";
import { getSpecificDataInfo } from "../../../componentGraph/helperFunctions";
import GeneralDescription from "./generalDescription";

export default class ColumnChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  textDescription: GeneralDescription;

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
    this.textDescription = new GeneralDescription();
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

    this.text = this.textDescription.getBeginnerVisDesc("column", this);

    return this.text;
  }
}
