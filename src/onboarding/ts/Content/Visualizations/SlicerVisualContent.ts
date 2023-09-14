import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import Value from "../../../../componentGraph/Value";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";
import InteractionExampleDescription from "../Text Descriptions/interactionExampleDescription";

export default class Slicer extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  interactionExample: InteractionExampleDescription;
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
    this.interactionExample = new InteractionExampleDescription();
    this.dataValue = new Value();
  }

  async setVisualInformation(visual: VisualDescriptor){
    await this.setVisualization(visual);
  }

  getSlicerInfo(
    expertiseLevel: ExpertiseLevel
  ) {
    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "slicer",
      this
    );
    return this.text;
  }

  getSlicerInteractionExample(){
    const exampleText = this.interactionExample.getInteractionInfo("slicer", this);
    return exampleText?exampleText:"";
  }
}
