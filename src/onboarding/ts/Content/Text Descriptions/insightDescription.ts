import { InsightTextFormat } from "./../Format/basicTextFormat";
import LineChart from "../Visualizations/LineChartVisualContent";
import BarChart from "../Visualizations/BarChartVisualContent";
import ColumnChart from "../Visualizations/ColumnChartVisualContent";
import ComboChart from "../Visualizations/ComboChartVisualContent";
import * as helper from "../../../../componentGraph/helperFunctions";
import { Level } from "../../../../UI/redux/expertise";
import Matrix from "../Visualizations/MatrixVisualContent";
import Table from "../Visualizations/TableVisualContent";

export default class InsightDescription {
  insightText: InsightTextFormat = {
    insightImages: [],
    insightInfos: [],
  };

  private insightInfo = {
    value: "A value of ",
    measured: " was measured",
    highest: "The highest value of ",
    average: "On average ",
    highestCategory: " has higher values than any other category",
  };

  private prepositions = {
    and: " and ",
    space: " ",
    for: " for "
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
      this.insightInfo.measured;

    if (axisValues && axisValues?.length !== 0) {
      text +=
        this.prepositions.for +
        axisValues[Math.floor(axisValues.length / 2)];
      if (legendValues && legendValues?.length !== 0) {
        text +=
          this.prepositions.and +
          legendValues[Math.floor(legendValues.length / 2)];
      }
    } else if (legendValues && legendValues?.length !== 0) {
      text +=
        this.prepositions.for +
        legendValues[Math.floor(legendValues.length / 2)];
    }

    text += this.punctuations.dot + this.lineBreak;

    return text;
  }

  insightHighestValueText(highestValues: (string | number)[], legend?: string) {
    let text = "";

    text =
      this.insightInfo.highest +
      highestValues[0] +
      this.insightInfo.measured + this.prepositions.for +
      highestValues[1];

    if(highestValues[2]){
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
    visual: LineChart | BarChart | ColumnChart | ComboChart | Matrix | Table,
    expertiseLevel: Level
  ) {
    let value;
    let highestCategory;
    let highestValues;
    let dataName;
    switch (visualType) {
      case "combo":
        visual = visual as ComboChart;
        const allAxes = visual.columnAxes.concat(visual.lineAxes);
        const allValues = visual.columnValues.concat(visual.lineValues);
        dataName = allAxes[Math.floor(allAxes.length / 2)];

        if (expertiseLevel === Level.Low) {
          value = helper.getSpecificDataPoint(
            visual.data.data,
            "",
            "",
            allAxes[Math.floor(allAxes.length / 2)],
            visual.axis,
            visual.axisValues[Math.floor(visual.axisValues.length / 2)]
          );
        }

        // if(expertiseLevel !== Level.High) {
        //   highestValues = helper.getHighestValue(visual.data.data, "Value", allAxes, "", visual.axis, visual.axisValues);
        // }

        // if (visual.legend) {
        //   highestCategory = helper.getHighestCategory(visual.data.data, "Value", allValues, "Category");
        // }
        break;
      case "matrix":
      case "table":
        visual = visual as Table | Matrix;
        let attributes = undefined;
        if(visual.row === "" && visual.column === ""){
          attributes = visual.data.attributes;
          dataName = visual.data.attributes[Math.floor(visual.data.attributes.length / 2)];
        } else if(visual.row === "" && visual.dataName === ""){
          dataName = visual.data.attributes[Math.floor(visual.data.attributes.length / 2)];
        }else{
          dataName = visual.dataName;
        }

        value = helper.getSpecificDataPoint(
          visual.data.data,
          visual.row,
          visual.rowValues[Math.floor(visual.rowValues.length / 2)],
          dataName,
          visual.column,
          visual.columnValues[Math.floor(visual.columnValues.length / 2)]
        );

        if (expertiseLevel !== Level.High) {
          if(visual.data.data.length > 100){
            highestValues = helper.getHighestValue(
              visual.data.data,
              dataName,
              [visual.rowValues[Math.floor(visual.rowValues.length / 2)]],
              visual.row,
              visual.column,
              visual.columnValues,
              attributes
            );
          } else {
            highestValues = helper.getHighestValue(
              visual.data.data,
              dataName,
              visual.rowValues,
              visual.row,
              visual.column,
              visual.columnValues,
              attributes
            );
          }
        }

        highestCategory = helper.getHighestCategory(
          visual,
          visual.data.data,
          dataName,
          visual.columnValues,
          visual.column,
          attributes
        );
        
        if (value !== null && value !== undefined && 
          (expertiseLevel === Level.Low || 
          ((highestValues === null || highestValues === undefined) && (highestCategory === null || highestCategory === undefined)))) {
          this.insightText.insightImages.push("lightbulbImg");
          this.insightText.insightInfos.push(
            this.insightExampleText(
              value,
              dataName,
              visual.rowValues,
              visual.columnValues
            )
          );
        }

        if (highestValues !== null && highestValues !== undefined) {
          this.insightText.insightImages.push("lightbulbImg");
          this.insightText.insightInfos.push(
            this.insightHighestValueText(highestValues, visual.column)
          );
        }
        break;
      default:
        visual = visual as LineChart | BarChart | ColumnChart;
        dataName = visual.dataName;

        if (expertiseLevel === Level.Low) {
          value = helper.getSpecificDataPoint(
            visual.data.data,
            visual.legend,
            visual.legendValues[Math.floor(visual.legendValues.length / 2)],
            visual.dataName,
            visual.axis,
            visual.axisValues[Math.floor(visual.axisValues.length / 2)]
          );
        }

        if(visual.data.data.length > 100){
          highestValues = helper.getHighestValue(
            visual.data.data,
            visual.dataName,
            [visual.legendValues[Math.floor(visual.legendValues.length / 2)]],
            visual.legend,
            visual.axis,
            visual.axisValues
          );
        } else {
          highestValues = helper.getHighestValue(
            visual.data.data,
            visual.dataName,
            visual.legendValues,
            visual.legend,
            visual.axis,
            visual.axisValues
          );
        }

        if (visual.legend || visual.encoding.yAxes.length > 1) {
          highestCategory = helper.getHighestCategory(
            visual,
            visual.data.data,
            visual.dataName,
            visual.legendValues,
            visual.legend
          );
        }

        
      if (value !== null && value !== undefined) {
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

      if(expertiseLevel !== Level.High || (highestCategory === null || highestCategory === undefined)){
        if (highestValues !== null && highestValues !== undefined) {
          this.insightText.insightImages.push("lightbulbImg");
          this.insightText.insightInfos.push(
            this.insightHighestValueText(highestValues, visual.legend)
          );
        }
      }
    }

    if (highestCategory !== null && highestCategory !== undefined) {
      this.insightText.insightImages.push("lightbulbImg");
      this.insightText.insightInfos.push(
        this.insightHighestCategoryText(highestCategory)
      );
    }
    return this.insightText;
  }
}