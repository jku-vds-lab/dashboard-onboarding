import { InsightTextFormat } from "./Format/basicTextFormat";
import LineChart from "./lineChartVisualContent";
import BarChart from "./barChartVisualContent";
import ColumnChart from "./columnChartVisualContent";
import ComboChart from "./comboChartVisualContent";
import * as helper from "../../../componentGraph/helperFunctions";
import { Level } from "../../../UI/redux/expertise";

export default class InsightDescription {
  insightText: InsightTextFormat = {
    insightImages: [],
    insightInfos: [],
  };

  private insightInfo = {
    value: "A value of ",
    measured: " was measured for ",
    highest: "The highest value of ",
    average: "On average ",
    highestCategory: " has higher values than any other category",
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

    if (legendValues && legendValues?.length !== 0) {
      text +=
        this.prepositions.and +
        legendValues[Math.floor(legendValues.length / 2)];
    }

    text += this.punctuations.dot + this.lineBreak;

    return text;
  }

  insightHighestValueText(
    highestValues: (string | number)[],
    legend?: string
  ) {
    let text = "";

    text =
      this.insightInfo.highest +
      highestValues[0] +
      this.insightInfo.measured +
      highestValues[1];

    if (legend) {
      text += this.prepositions.and + highestValues[2];
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
    visual: LineChart | BarChart | ColumnChart | ComboChart,
    expertiseLevel: Level
  ) {
    let value;
    let highestCategory;
    let highestValues;
    let dataName;
    switch (visualType) {
      case "combo":
        visual = visual as ComboChart
        const allAxes = visual.columnAxes.concat(visual.lineAxes);
        const allValues = visual.columnValues.concat(visual.lineValues);
        dataName = allAxes[Math.floor(allAxes.length / 2)];

        if(expertiseLevel === Level.Low){
          value = helper.getSpecificDataPoint(visual.data.data, "", "",
          allAxes[Math.floor(allAxes.length / 2)], visual.axis, visual.axisValues[Math.floor(visual.axisValues.length / 2)]);
        }

        // if(expertiseLevel !== Level.High) {
        //   highestValues = helper.getHighestValue(visual.data.data, "Value", allAxes, "", visual.axis, visual.axisValues);
        // }

        // if (visual.legend) {
        //   highestCategory = helper.getHighestCategory(visual.data.data, "Value", allValues, "Category");
        // }
        break;
      default:
        visual = visual as LineChart | BarChart | ColumnChart;
        dataName = visual.dataName;

        if(expertiseLevel === Level.Low){
          value = helper.getSpecificDataPoint(
            visual.data.data,
            visual.legend,
            visual.legendValues[Math.floor(visual.legendValues.length / 2)],
            visual.dataName,
            visual.axis,
            visual.axisValues[Math.floor(visual.axisValues.length / 2)]
          );
        }

        if(expertiseLevel !== Level.High) {
          highestValues = helper.getHighestValue(
            visual.data.data,
            visual.dataName,
            visual.legendValues,
            visual.legend,
            visual.axis,
            visual.axisValues
          );
        }

        if (visual.legend) {
          highestCategory = helper.getHighestCategory(
            visual.data.data,
            visual.dataName,
            visual.legendValues,
            visual.legend
          );
        }
    }

    if(value){
      this.insightText.insightImages.push("lightbulbImg");
      this.insightText.insightInfos.push(
        this.insightExampleText(
          value,
          dataName,
          visual.axisValues,
          visual.legendValues
        )
      );
    }

    if(highestValues) {
      this.insightText.insightImages.push("lightbulbImg");
      this.insightText.insightInfos.push(
        this.insightHighestValueText(
          highestValues,
          visual.legend
        )
      );
    }

    if(highestCategory) {
      this.insightText.insightImages.push("lightbulbImg");
      this.insightText.insightInfos.push(
        this.insightHighestCategoryText(highestCategory)
      );
    }
    return this.insightText;
  }
}
