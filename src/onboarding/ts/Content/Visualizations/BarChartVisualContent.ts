import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import XAxis from "../../../../componentGraph/XAxis";
import Legend from "../../../../componentGraph/Legend";
import YAxis from "../../../../componentGraph/YAxis";
import { getSpecificDataInfo } from "../../../../componentGraph/helperFunctions";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";
import InteractionExampleDescription from "../Text Descriptions/interactionExampleDescription";

export default class BarChart extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  interactionExample: InteractionExampleDescription;
  axisValue: YAxis;
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
    this.axisValue = new YAxis();
    this.axis = "";
    this.axisValues = [];
    this.legendValue = new Legend();
    this.legend = "";
    this.legendValues = [];
    this.dataValue = new YAxis();
    this.dataName = "";
    this.isVertical = false;
  }

  async setVisualInformation(visual:VisualDescriptor){    
    await this.setVisualization(visual);

    this.axisValue = this.encoding.yAxes[0];
    this.axis = this.encoding.yAxes[0] ? this.encoding.yAxes[0].attribute! : "";
    this.axisValues = this.encoding.yAxes[0]
      ? await getSpecificDataInfo(visual, this.axis)
      : [];

    this.legendValue = this.encoding.legends[0];
    this.legend = this.encoding.legends[0]
      ? this.encoding.legends[0].attribute
      : "";
    this.legendValues = this.encoding.legends[0]
      ? await getSpecificDataInfo(visual, this.legend)
      : [];

    this.dataName = this.encoding.xAxes[0]
      ? this.encoding.xAxes[0].attribute!
      : "";
  }

  getClusteredBarChartInfo(
    expertiseLevel: ExpertiseLevel
  ) {
    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "bar",
      this
    );
    return this.text;
  }

  getBarChartInteractionExample(){
    const exampleText = this.interactionExample.getInteractionInfo("bar", this);
    return exampleText?exampleText:"";
  }
}
