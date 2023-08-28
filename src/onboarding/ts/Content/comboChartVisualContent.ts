import GeneralDescription from "./generalDescription";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";
import { getSpecificDataInfo } from "../../../componentGraph/helperFunctions";

export default class ComboChart extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  textDescription: GeneralDescription;
  axisValue: XAxis;
  axis: string;
  axisValues: string[];
  legendValue: Legend;
  legend: string;
  legendValues: string[];
  dataNames: YAxis[];
  columnName: YAxis[];
  columnAxis: string;
  columnValues: string[];
  lineName: YAxis[];
  lineAxis: string;
  lineValues: string[];

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
    this.axisValues = [];
    this.legendValue = new Legend();
    this.legend = "";
    this.legendValues = [];
    this.dataNames = [];
    this.columnName = [];
    this.columnAxis = "";
    this.columnValues = [];
    this.lineName = [];
    this.lineAxis = "";
    this.lineValues = [];
  }

  async getLineClusteredColumnComboChartInfo(visual: VisualDescriptor) {
    this.chart = await this.getVisualization(visual);

    this.axisValue = this.chart.encoding.xAxes[0];
    this.axis = this.chart.encoding.xAxes[0]
      ? this.chart.encoding.xAxes[0].attribute!
      : "";
    this.axisValues = this.chart.encoding.xAxes[0]
      ? await getSpecificDataInfo(visual, this.axis)
      : [];

    this.legendValue = this.chart?.encoding.legends[0];
    this.legend = this.chart.encoding.legends[0]
      ? this.chart.encoding.legends[0].attribute
      : "";
    this.legendValues = this.chart.encoding.legends[0]
      ? await getSpecificDataInfo(visual, this.legend)
      : [];

    this.dataNames = this.chart.encoding.yAxes;
    this.columnName = this.dataNames?.filter(
      (yAxis) => yAxis.type === "Column y-axis"
    )!;
    this.lineName = this.dataNames?.filter(
      (yAxis) => yAxis.type === "Line y-axis"
    )!;
    this.columnAxis = this.columnName[0] ? this.columnName[0].attribute! : "";
    this.columnValues = this.columnName[0]
      ? await getSpecificDataInfo(visual, this.columnAxis)
      : [];
    this.lineAxis = this.lineName[0] ? this.lineName[0].attribute! : "";
    this.lineValues = this.lineName[0]
      ? await getSpecificDataInfo(visual, this.lineAxis)
      : [];

    //this.text = this.textDescription.getBeginnerText("combo", this);
    // this.text = this.textDescription.getIntermediateText("combo", this);
    this.text = this.textDescription.getAdvancedVisDesc("combo", this);
    return this.text;
  }
}
