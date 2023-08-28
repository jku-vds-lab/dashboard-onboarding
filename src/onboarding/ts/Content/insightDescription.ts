import BasicTextFormat from "./Format/basicTextFormat";
import LineChart from "./lineChartVisualContent";
import BarChart from "./barChartVisualContent";
import ColumnChart from "./columnChartVisualContent";
import ComboChart from "./comboChartVisualContent";
import Card from "./cardVisualContent";
import * as helper from "../../../componentGraph/helperFunctions";

export default class InsightDescription {
  text: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    insightImages: [],
    insightInfos: [],
    interactionImages: [],
    interactionInfos: [],
  };

  private insightInfo = {
    value: "A value of ",
    measured: " was measured for ",
    highest: "The highest value of ",
    average: "On average ",
    highestCategory: " has higher values than any other category.",
  };

  private prepositions = {
    and: " and ",
    space: " ",
  };

  private punctuations = {
    dot: ".",
  };

  private lineBreak = "<br>";

  insightExampleText(
    value: string | number,
    dataName: string,
    axisValues: string[],
    legendValues?: string[]
  ) {
    let text = "";

    text =
      this.insightInfo.value +
      value +
      this.prepositions.space +
      dataName +
      this.insightInfo.measured +
      axisValues[Math.floor(axisValues.length / 2)];

    if (legendValues) {
      text +=
        this.prepositions.and +
        legendValues[Math.floor(legendValues.length / 2)];
    }

    text += this.punctuations.dot + this.lineBreak;

    return text;
  }

  insightHighestValueText(
    highestValue: string | number,
    dataName: string,
    dataCategory: (string | number)[],
    legend?: string
  ) {
    let text = "";

    text =
      this.insightInfo.highest +
      highestValue +
      this.prepositions.space +
      dataName +
      this.insightInfo.measured +
      dataCategory[0];

    if (legend) {
      text += this.prepositions.and + dataCategory[1];
    }

    text += this.punctuations.dot + this.lineBreak;

    return text;
  }

  insightHighestCategoryText(highestCategory: string) {
    let text = "";

    text =
      this.insightInfo.average +
      highestCategory +
      this.insightInfo.highestCategory +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  getInsightInfo(
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Card
  ) {
    let value;
    switch (visualType) {
      case "card":
        visual = visual as Card;
        value = helper.getSpecificDataPoint(
          visual.data.data,
          "",
          "",
          visual.dataValue.attribute,
          "",
          ""
        );
        this.text.insightImages.push("lightbulbImg");
        this.text.insightInfos.push(
          this.insightExampleText(value!, "", [], [])
        );
        break;
      case "combo":
        break;
      default:
        visual = visual as LineChart | BarChart | ColumnChart;
        value = helper.getSpecificDataPoint(
          visual.data.data,
          visual.legend,
          visual.legendValues[Math.floor(visual.legendValues.length / 2)],
          visual.dataName,
          visual.axis,
          visual.axisValues[Math.floor(visual.axisValues.length / 2)]
        );
        this.text.insightImages.push("lightbulbImg");
        this.text.insightInfos.push(
          this.insightExampleText(
            value!,
            visual.dataName,
            visual.axisValues,
            visual.legendValues
          )
        );

        const highestValueArray = helper.getHighestValue(
          visual.data.data,
          visual.dataName,
          visual.legendValues,
          visual.legend,
          visual.axis,
          visual.axisValues
        );
        const highestValue = highestValueArray[0];
        this.text.insightImages.push("lightbulbImg");
        this.text.insightInfos.push(
          this.insightHighestValueText(
            highestValue,
            visual.dataName,
            highestValueArray,
            visual.legend
          )
        );

        if (visual.legend) {
          const highestCategory = helper.getHighestCategory(
            visual.data.data,
            visual.dataName,
            visual.legendValues,
            visual.legend
          );
          this.text.insightImages.push("lightbulbImg");
          this.text.insightInfos.push(
            this.insightHighestCategoryText(highestCategory)
          );
        }
    }
  }
}
