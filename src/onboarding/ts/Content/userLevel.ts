import { ExpertiseLevel, Level } from "../../../UI/redux/expertise";
import { BasicTextFormat } from "./Format/basicTextFormat";
import BarChart from "./Visualizations/barChartVisualContent";
import Card from "./Visualizations/cardVisualContent";
import ColumnChart from "./Visualizations/columnChartVisualContent";
import ComboChart from "./Visualizations/comboChartVisualContent";
import GeneralDescription from "./Text Descriptions/generalDescription";
import InsightDescription from "./Text Descriptions/insightDescription";
import InteractionDescription from "./Text Descriptions/interactionDescription";
import LineChart from "./Visualizations/lineChartVisualContent";
import Slicer from "./Visualizations/slicerVisualContent";

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

  getTextWithUserLevel(
    expertiseLevel: ExpertiseLevel,
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer
  ) {
    let generalInfo;
    if (expertiseLevel.Vis == Level.Low) {
      generalInfo = this.generalDescription.getBeginnerVisDesc(
        visualType,
        visual
      );
    } else if (expertiseLevel.Vis == Level.Medium) {
      generalInfo = this.generalDescription.getIntermediateVisDesc(
        visualType,
        visual
      );
    } else {
      generalInfo = this.generalDescription.getAdvancedVisDesc(
        visualType,
        visual
      );
    }
    this.text.generalImages = generalInfo.generalImages;
    this.text.generalInfos = generalInfo.generalInfos;

    if (visualType !== "card" && visualType !== "slicer") {
      visual = visual as LineChart | BarChart | ColumnChart | ComboChart;
      const insightInfo = this.insightDescription.getInsightInfo(
        visualType,
        visual,
        expertiseLevel.Domain
      );
      this.text.insightImages = insightInfo.insightImages;
      this.text.insightInfos = insightInfo.insightInfos;
    }

    if (visualType !== "Card") {
      visual = visual as
        | LineChart
        | BarChart
        | ColumnChart
        | ComboChart
        | Slicer;
      const interactionInfo = this.interactionDescription.getInteractionInfo(
        visualType,
        visual
      );
      this.text.interactionImages = interactionInfo.interactionImages;
      this.text.interactionInfos = interactionInfo.interactionInfos;
    }

    return this.text;
  }
}
