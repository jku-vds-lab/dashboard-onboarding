import { ExpertiseLevel, Level } from "../../../UI/redux/expertise";
import { BasicTextFormat } from "./Format/basicTextFormat";
import BarChart from "./barChartVisualContent";
import Card from "./cardVisualContent";
import ColumnChart from "./columnChartVisualContent";
import ComboChart from "./comboChartVisualContent";
import GeneralDescription from "./generalDescription";
import InsightDescription from "./insightDescription";
import InteractionDescription from "./interactionDescription";
import LineChart from "./lineChartVisualContent";
import Slicer from "./slicerVisualContent";

export default class ExpertiseText {
    text: BasicTextFormat;
    generalDescription: GeneralDescription;
    insightDescription: InsightDescription;
    interactionDescription: InteractionDescription;
  
    constructor() {
      this.text = {
        generalImages: [],
        generalInfos: [],
        insightImages: [],
        insightInfos: [],
        interactionImages: [],
        interactionInfos: [],
      };
      this.generalDescription = new GeneralDescription();
      this.insightDescription = new InsightDescription();
      this.interactionDescription = new InteractionDescription();
    }

    getTextWithUserLevel(expertiseLevel: ExpertiseLevel, visualType: string, visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer){
        let generalInfo;
        if (expertiseLevel.Vis == Level.Low) {
            generalInfo = this.generalDescription.getBeginnerVisDesc(visualType, visual);
        } else if (expertiseLevel.Vis == Level.Medium) {
            generalInfo = this.generalDescription.getIntermediateVisDesc(visualType, visual);
        } else {
            generalInfo = this.generalDescription.getAdvancedVisDesc(visualType, visual);
        }
        this.text.generalImages = generalInfo.generalImages;
        this.text.generalInfos = generalInfo.generalInfos;

        if(visualType !== "card" && visualType !== "slicer"){
            visual = visual as LineChart | BarChart | ColumnChart | ComboChart;
            const insightInfo = this.insightDescription.getInsightInfo(visualType, visual, expertiseLevel.Domain);
            this.text.insightImages = insightInfo.insightImages;
            this.text.insightInfos = insightInfo.insightInfos;
        }

        if(visualType !== "Card"){
            visual = visual as LineChart | BarChart | ColumnChart | ComboChart | Slicer;
            const interactionInfo = this.interactionDescription.getInteractionInfo(visualType, visual);
            this.text.interactionImages = interactionInfo.interactionImages;
            this.text.interactionInfos = interactionInfo.interactionInfos;
        }

        return this.text;
    }
}