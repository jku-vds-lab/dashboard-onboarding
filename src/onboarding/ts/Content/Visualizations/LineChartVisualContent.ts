import * as helpers from "../../../../componentGraph/helperFunctions";
import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../../componentGraph/XAxis";
import Legend from "../../../../componentGraph/Legend";
import YAxis from "../../../../componentGraph/YAxis";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";
import InteractionExampleDescription from "../Text Descriptions/interactionExampleDescription";

export default class LineChart extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  interactionExample: InteractionExampleDescription;
  axisValue: XAxis;
  axis: string;
  axisValues: string[];
  legendValue: Legend;
  legend: string;
  legendValues: string[];
  dataValue: YAxis;
  dataName: string;
  isVertical: boolean;

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
    this.interactionExample = new InteractionExampleDescription();
    this.axisValue = new XAxis();
    this.axis = "";
    this.axisValues = [];
    this.legendValue = new Legend();
    this.legend = "";
    this.legendValues = [];
    this.dataValue = new YAxis();
    this.dataName = "";
    this.isVertical = true;
  }
  
  async setVisualInformation(visual: VisualDescriptor){
    await this.setVisualization(visual);

    this.axisValue = this.encoding.xAxes[0];
    this.axis = this.axisValue && this.axisValue.attribute;
    this.axisValues = this.encoding.yAxes[0]
      ? await helpers.getSpecificDataInfo(visual, this.axis)
      : [];

    this.legendValue = this.encoding.legends[0];
    this.legend = this.legendValue && this.legendValue.attribute;
    this.legendValues = this.encoding.legends[0]
      ? await helpers.getSpecificDataInfo(visual, this.legend)
      : [];

    this.dataValue = this.encoding.yAxes[0];
    this.dataName = (this.dataValue && this.dataValue.attribute) || "";

  }

  getLineChartInfo(
    expertiseLevel: ExpertiseLevel
  ) {
    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "line",
      this
    );
    return this.text;
  }

  getLineChartInteractionExample(){
    const exampleText = this.interactionExample.getInteractionInfo("lines", this);
    return exampleText?exampleText:"";
  }
}
