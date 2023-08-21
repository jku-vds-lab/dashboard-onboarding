import Visualization from "../../../componentGraph/Visualization";
import BasicTextFormat from "./Format/basicTextFormat";
import LineChart from "./lineChartVisualContent";
import BarChart from "./barChartVisualContent";
import { Visual, VisualDescriptor } from "powerbi-client";
import * as helper from "../../../componentGraph/helperFunctions";
import * as global from "./../globalVariables";

export default class InsightDescription {
  text: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    insightImages: [],
    insightInfos: [],
    interactionImages: [],
    interactionInfos: [],
  };

  // /*
  // Get insight of the visualization
  // @param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
  // */
  // export async function getVisualInsight(
  //   visual: VisualDescriptor
  // ): Promise<Insight> {
  //   const insights = new Array<string>();
  //   const VisualType = visual.type;
  //   switch (VisualType) {
  //     case "card":
  //     case "multiRowCard":
  //       const dataName = await getFieldMeasure(visual, "Values");
  //       const dataValue = await getSpecificDataInfo(visual, dataName);
  //       insights[0] =
  //         "You can see that the value of " + dataName + " is " + dataValue + ".";
  //       break;
  //     case "slicer":
  //       break;
  //     case "lineClusteredColumnComboChart":
  //       await getLineClusteredColumnComboChartInsights(visual, insights);
  //       break;
  //     case "lineChart":
  //     case "clusteredBarChart":
  //     case "clusteredColumnChart":
  //       await getDefaultInsights(visual, insights);
  //       break;
  //     default:
  //       insights[0] = "This type of visual is not supported yet";
  //       break;
  //   }
  //   return { insights };
  // }

  // export async function getLineClusteredColumnComboChartInsights(
  //   visual: VisualDescriptor,
  //   insights: string[]
  // ) {
  //   const axis = await getFieldColumn(visual, "Category");
  //   const axisValues = await getSpecificDataInfo(visual, axis);
  //   const columnSeries = await getFieldMeasures(visual, "Series");
  //   const columnValues = await getFieldMeasures(visual, "Y");
  //   const lineValues = await getFieldMeasures(visual, "Y2");

  //   const columnData = columnSeries.concat(columnValues);
  //   const allData = columnData.concat(lineValues);

  //   const middelOfXValues = Math.floor(axisValues.length / 2);
  //   const middelOfYValues = Math.floor(allData.length / 2);

  //   const visualData = await getData(visual, allData);
  //   if (!visualData) {
  //     return;
  //   }

  //   const value = await getSpecificDataPoint(
  //     visualData.data,
  //     "Category",
  //     allData[middelOfYValues],
  //     "Value",
  //     axis,
  //     axisValues[middelOfXValues]
  //   );
  //   const highestCategory = await getHighestCategory(
  //     visualData.data,
  //     "Value",
  //     allData,
  //     "Category"
  //   );
  //   const highestValue = await getHighestValue(
  //     visualData.data,
  //     "Value",
  //     allData,
  //     "Category",
  //     axis,
  //     axisValues
  //   );

  //   insights[0] =
  //     "A value of " +
  //     value +
  //     " " +
  //     allData[middelOfYValues] +
  //     " was measured for " +
  //     axisValues[middelOfXValues] +
  //     ".";
  //   insights[1] =
  //     "On average " +
  //     highestCategory +
  //     " has higher values than any other category.";
  //   insights[2] =
  //     "The highest value " +
  //     highestValue[0] +
  //     " was measured for " +
  //     highestValue[1] +
  //     " and " +
  //     highestValue[2] +
  //     ".";
  // }

  // export async function getDefaultInsights(visual: VisualDescriptor, insights: string[]) {
  //   const axes = await getFieldColumns(visual, "Category");
  //   const axisValues = await getSpecificDataInfo(visual, axes[0]);
  //   const dataName = await getFieldMeasure(visual, "Y");
  //   const legend = await getFieldColumn(visual, "Series");
  //   const legendValues = await getSpecificDataInfo(visual, legend);

  //   const middelOfYValues = Math.floor(axisValues.length / 2);
  //   const middelOfLegendValues = Math.floor(legendValues.length / 2);

  //   const visualData = await getData(visual, []);
  //   if (!visualData) {
  //     return;
  //   }

  //   const value = await getSpecificDataPoint(
  //     visualData.data,
  //     legend,
  //     legendValues[middelOfLegendValues],
  //     dataName,
  //     axes[0],
  //     axisValues[middelOfYValues]
  //   );
  //   const highestCategory = await getHighestCategory(
  //     visualData.data,
  //     dataName,
  //     legendValues,
  //     legend
  //   );
  //   const highestValue = await getHighestValue(
  //     visualData.data,
  //     dataName,
  //     legendValues,
  //     legend,
  //     axes[0],
  //     axisValues
  //   );

  //   if (legend === "") {
  //     insights[0] =
  //       "A value of " +
  //       value +
  //       " " +
  //       dataName +
  //       " was measured for " +
  //       axisValues[middelOfYValues] +
  //       ".";
  //     insights[1] =
  //       "The highest value of " +
  //       highestValue[0] +
  //       " " +
  //       dataName +
  //       " was measured for " +
  //       highestValue[1] +
  //       ".";
  //   } else {
  //     insights[0] =
  //       "A value of " +
  //       value +
  //       " " +
  //       dataName +
  //       " was measured for " +
  //       axisValues[middelOfYValues] +
  //       " and " +
  //       legendValues[middelOfLegendValues] +
  //       ".";
  //     insights[1] =
  //       "On average " +
  //       highestCategory +
  //       " has higher values than any other category.";
  //     insights[2] =
  //       "The highest value of " +
  //       highestValue[0] +
  //       " " +
  //       dataName +
  //       " was measured for " +
  //       highestValue[1] +
  //       " and " +
  //       highestValue[2] +
  //       ".";
  //   }
  // }
}
