import GeneralDescription from "./generalDescription";
import BasicTextFormat from "./Format/basicTextFormat";
import Visualization from "../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import Value from "../../../componentGraph/value";

export default class Card extends Visualization {
  chart: Visualization;
  text: BasicTextFormat;
  textDescription: GeneralDescription;
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
    this.chart = new Visualization();
    this.textDescription = new GeneralDescription();
    this.dataValue = new Value();
  }

  async getCardInfo(visual: VisualDescriptor) {
    this.chart = await this.getVisualization(visual);

    //this.text = this.textDescription.getBeginnerText("card", this);
    // this.text = this.textDescription.getIntermediateText("card", this);
    this.text = this.textDescription.getAdvancedVisDesc("card", this);
    return this.text;
  }
}
