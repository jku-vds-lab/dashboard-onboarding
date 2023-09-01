import { BasicTextFormat } from "./../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "./../userLevel";

export default class Card extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  dataValue: string;

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
    this.dataValue = "";
  }

  async getCardInfo(visual: VisualDescriptor, expertiseLevel: ExpertiseLevel) {
    await this.setVisualization(visual);

    this.dataValue = this.data.data[0].get(this.data.attributes[0]);

    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "card",
      this
    );
    return this.text;
  }
}
