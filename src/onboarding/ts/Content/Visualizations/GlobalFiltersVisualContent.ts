import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import Value from "../../../../componentGraph/Value";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";
import InteractionExampleDescription from "../Text Descriptions/interactionExampleDescription";
import GlobalFilter from "../../../../componentGraph/GlobalFilter";

export default class GlobalFilters extends GlobalFilter{
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  interactionExample: InteractionExampleDescription;
  filterNames: string[];

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
    this.filterNames = [];
  }

    async setGlobalFilterInformation(){
        await this.getGlobalFilter();
        
        this.filterNames = this.filters.map((filter) => filter.attribute);
    }

  getGlobalFilterInfo(expertiseLevel: ExpertiseLevel) {
    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "globalFilter",
      this
    );
    return this.text;
  }

  getGlobalFilterInteractionExample(){
    const exampleText = this.interactionExample.getInteractionInfo("globalFilter", this);
    return exampleText?exampleText:"";
  }
}
