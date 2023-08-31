import { BasicTextFormat } from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../componentGraph/XAxis";
import Legend from "../../../componentGraph/Legend";
import YAxis from "../../../componentGraph/YAxis";
import { getSpecificDataInfo } from "../../../componentGraph/helperFunctions";
import { ExpertiseLevel } from "../../../UI/redux/expertise";
import ExpertiseText from "./userLevel";

export default class ComboChart extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  axisValue: XAxis;
  axis: string;
  axisValues: string[];
  legendValue: Legend;
  legend: string;
  legendValues: string[];
  dataNames: YAxis[];
  columnName: YAxis[];
  columnAxes: string[];
  columnValues: string[];
  lineName: YAxis[];
  lineAxes: string[];
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
    this.textDescription = new ExpertiseText();
    this.axisValue = new XAxis();
    this.axis = "";
    this.axisValues = [];
    this.legendValue = new Legend();
    this.legend = "";
    this.legendValues = [];
    this.dataNames = [];
    this.columnName = [];
    this.columnAxes = [];
    this.columnValues = [];
    this.lineName = [];
    this.lineAxes = [];
    this.lineValues = [];
  }

  async getLineClusteredColumnComboChartInfo(visual: VisualDescriptor, expertiseLevel: ExpertiseLevel) {
    await this.setVisualization(visual);

    this.axisValue = this.encoding.xAxes[0];
    this.axis = this.encoding.xAxes[0]
      ? this.encoding.xAxes[0].attribute!
      : "";
    this.axisValues = this.encoding.xAxes[0]
      ? await getSpecificDataInfo(visual, this.axis)
      : [];

    this.legendValue = this.encoding.legends[0];
    this.legend = this.encoding.legends[0]
      ? this.encoding.legends[0].attribute
      : "";
    this.legendValues = this.encoding.legends[0]
      ? await getSpecificDataInfo(visual, this.legend)
      : [];

    this.dataNames = this.encoding.yAxes;
    this.columnName = this.dataNames?.filter(
      (yAxis) => yAxis.type === "Column y-axis"
    )!;
    this.lineName = this.dataNames?.filter(
      (yAxis) => yAxis.type === "Line y-axis"
    )!;

    this.columnAxes = this.columnName.map((axis) => axis.attribute);
    for(const axis of this.columnAxes){
      for (const map of this.data.data) {
        this.columnValues.push(map.get(axis));
      }
    }

    this.lineAxes = this.lineName.map((axis) => axis.attribute);
    for(const axis of this.lineAxes){
      for (const map of this.data.data) {
        this.lineValues.push(map.get(axis));
      }
    }

    this.text = this.textDescription.getTextWithUserLevel(expertiseLevel, "combo", this);
    return this.text;
  }
}
