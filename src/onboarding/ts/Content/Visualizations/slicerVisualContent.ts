import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import Value from "../../../../componentGraph/Value";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";

export default class Slicer extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  dataValue: Value;

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
    this.dataValue = new Value();
  }

  async getSlicerInfo(
    visual: VisualDescriptor,
    expertiseLevel: ExpertiseLevel
  ) {
    await this.setVisualization(visual);

    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "slicer",
      this
    );
    return this.text;
  }
}
