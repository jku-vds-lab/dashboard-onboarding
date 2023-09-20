import { ExpertiseLevel, Level } from "../../../UI/redux/expertise";
import { BasicTextFormat } from "./Format/basicTextFormat";
import BarChart from "./Visualizations/BarChartVisualContent";
import Card from "./Visualizations/CardVisualContent";
import ColumnChart from "./Visualizations/ColumnChartVisualContent";
import ComboChart from "./Visualizations/ComboChartVisualContent";
import GeneralDescription from "./Text Descriptions/generalDescription";
import InsightDescription from "./Text Descriptions/insightDescription";
import InteractionDescription from "./Text Descriptions/interactionDescription";
import LineChart from "./Visualizations/LineChartVisualContent";
import Slicer from "./Visualizations/SlicerVisualContent";
import GlobalFilters from "./Visualizations/GlobalFiltersVisualContent";
import Table from "./Visualizations/TableVisualContent";
import Matrix from "./Visualizations/MatrixVisualContent";

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
    visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer | GlobalFilters | Matrix | Table
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

    if (visualType !== "card" && visualType !== "slicer" && visualType !== "globalFilter") {
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
        | Slicer
        | GlobalFilters;
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
