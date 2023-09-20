import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";
import InteractionExampleDescription from "../Text Descriptions/interactionExampleDescription";

export default class Table extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  interactionExample: InteractionExampleDescription;

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
  }

  async setVisualInformation(visual:VisualDescriptor){    
    await this.setVisualization(visual);
  }

  getTableChartInfo(
    expertiseLevel: ExpertiseLevel
  ) {
    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "table",
      this
    );
    return this.text;
  }

  getTableInteractionExample(){
    const exampleText = this.interactionExample.getInteractionInfo("table", this);
    return exampleText?exampleText:"";
  }
}
