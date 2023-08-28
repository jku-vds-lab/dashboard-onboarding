import * as helpers from "./../../../componentGraph/helperFunctions";
import GeneralDescription from "./generalDescription";
import BasicTextFormat, { UserLevel } from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";

export default class LineChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  textDescription: GeneralDescription;
  axisValue: XAxis;
  axis: string;
  axisValues: string[];
  legendValue: Legend;
  legend: string;
  legendValues: string[];
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
    this.textDescription = new GeneralDescription();
    this.axisValue = new XAxis();
    this.axis = "";
    this.axisValues = [];
    this.legendValue = new Legend();
    this.legend = "";
    this.legendValues = [];
    this.dataValue = new YAxis();
    this.dataName = "";
    this.userLevel = userLevel ?? UserLevel.Beginner;
  }

  async getLineChartInfo(visual: VisualDescriptor) {
    this.chart = await this.getVisualization(visual);

    this.axisValue = this.chart.encoding.xAxes[0];
    this.axis = this.axisValue && this.axisValue.attribute;
    this.axisValues = this.chart.encoding.yAxes[0]
      ? await helpers.getSpecificDataInfo(visual, this.axis)
      : [];

    this.legendValue = this.chart?.encoding.legends[0];
    this.legend = this.legendValue && this.legendValue.attribute;
    this.legendValues = this.chart.encoding.legends[0]
      ? await helpers.getSpecificDataInfo(visual, this.legend)
      : [];

    this.dataValue = this.chart?.encoding.yAxes[0];
    this.dataName = (this.dataValue && this.dataValue.attribute) || "";

    this.text = this.textDescription.getBeginnerVisDesc("line", this);
    // this.text = this.textDescription.getIntermediateVisDesc("line", this);
    // this.text = this.textDescription.getAdvancedVisDesc("line", this);
    return this.text;
  }

  getInsightInfo() {}
}
