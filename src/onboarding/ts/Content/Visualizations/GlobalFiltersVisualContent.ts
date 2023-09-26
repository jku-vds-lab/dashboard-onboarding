import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import Value from "../../../../componentGraph/Value";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";
import InteractionExampleDescription from "../Text Descriptions/interactionExampleDescription";
import GlobalFilter from "../../../../componentGraph/GlobalFilter";

export default class GlobalFilters {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  interactionExample: InteractionExampleDescription;
  filterNames: string[];
  globalFilterInfos: GlobalFilter;

  constructor() {
    // exends GlobalFilter and super call throws called before initialization error workaraund with initializing it here as a variable, someone needs to look into that when there is more time
    this.globalFilterInfos = new GlobalFilter();
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
        await this.globalFilterInfos.getGlobalFilter();
        
        this.filterNames = this.globalFilterInfos.filters.map((filter) => filter.attribute);
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
