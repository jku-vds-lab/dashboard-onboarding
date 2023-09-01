import { VisualDescriptor, Page } from "powerbi-client";
import "powerbi-report-authoring";
import { exportData } from "../Provenance/utils";
import * as global from "../onboarding/ts/globalVariables";
import Filter from "./Filter";
import { getFilterDescription } from "../onboarding/ts/filterInfoCards";
import { BasicTextFormat } from "../onboarding/ts/Content/Format/basicTextFormat";
import Card from "../onboarding/ts/Content/Visualizations/cardVisualContent";
import Slicer from "../onboarding/ts/Content/Visualizations/slicerVisualContent";
import LineChart from "../onboarding/ts/Content/Visualizations/lineChartVisualContent";
import BarChart from "../onboarding/ts/Content/Visualizations/barChartVisualContent";
import ColumnChart from "../onboarding/ts/Content/Visualizations/columnChartVisualContent";
import ComboChart from "../onboarding/ts/Content/Visualizations/comboChartVisualContent";
import { TraversalElement, isGroup } from "../onboarding/ts/traversal";
import Data from "./Data";
import { ExpertiseLevel, Level } from "../UI/redux/expertise";
/*
Get encoding of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/

export async function getPageFilters(
  page: Page
): Promise<Array<Record<string, unknown>>> {
  const FiltersCollectionArray = [];
  const GlobalFilters = await page.getFilters();
  for (const x in GlobalFilters) {
    const FiltersCollection = {};
    if ("target" in GlobalFilters[x]) {
      if ("table" in GlobalFilters[x]["target"]) {
        FiltersCollection["table"] = GlobalFilters[x]["target"]["table"];
      }
    }
    if ("target" in GlobalFilters[x]) {
      if ("column" in GlobalFilters[x]["target"]) {
        FiltersCollection["attribute"] = GlobalFilters[x]["target"]["column"];
      }
    }
    if ("operator" in GlobalFilters[x]) {
      FiltersCollection["operator"] = GlobalFilters[x]["operator"];
    }
    if ("values" in GlobalFilters[x]) {
      FiltersCollection["values"] = GlobalFilters[x]["values"];
    }
    if ("conditions" in GlobalFilters[x]) {
      FiltersCollection["values"] = GlobalFilters[x]["conditions"];
    }
    FiltersCollectionArray.push(FiltersCollection);
  }
  return FiltersCollectionArray;
}

/*
Get the local filter
@param visual visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/

export function getOperation(originalOperation: string) {
  let operation;
  switch (originalOperation) {
    case "In":
      operation = "Equal";
      break;
    case "NotIn":
      operation = "Not Equal";
      break;
    default:
      operation = originalOperation;
  }
  return operation;
}

export function getSpecificDataPoint(
  visualData: Map<string, string>[],
  legendName: string,
  selectedLegendValue: string,
  dataName: string,
  axisName: string,
  selectedAxisValue: string
) {
  const axisData = visualData.filter(
    (dataMap) => dataMap.get(axisName) === selectedAxisValue
  );

  if (legendName === "") {
    return axisData[0].get(dataName);
  }

  switch (axisData.length) {
    case 0:
      return "0";
    case 1:
      return axisData[0].get(selectedLegendValue);
    default:
      const legendData = axisData.filter(
        (dataMap) => dataMap.get(legendName) === selectedLegendValue
      );
      switch (legendData.length) {
        case 0:
          return "0";
        case 1:
          return legendData[0].get(dataName);
        default:
          let sum = 0;
          for (const dataPoint of legendData) {
            const data = dataPoint.get(dataName);
            if (data) {
              sum += parseInt(data);
            }
          }
          return sum;
      }
  }
}

export function getHighestCategory(
  visualData: Map<string, string>[],
  dataName: string,
  legendValues: string[],
  legendName: string
) {
  const sums = [];

  for (const legendValue of legendValues) {
    const legendData = visualData.filter(
      (dataMap) => dataMap.get(legendName) === legendValue
    );
    let sum = 0;
    for (const dataPoint of legendData) {
      const data = dataPoint.get(dataName);
      if (data) {
        sum += parseInt(data);
      }
    }
    sums.push(sum);
  }

  const position = sums.indexOf(Math.max(...sums));
  return legendValues[position];
}

export function getHighestValue(
  visualData: Map<string, string>[],
  dataName: string,
  legendValues: string[],
  legendName: string,
  axisName: string,
  axisValues: string[]
) {
  let max = Number.MIN_SAFE_INTEGER;
  let highestCategory = "";
  let highestAxis = "";

  if (legendName === "") {
    const sums = [];
    for (const axisValue of axisValues) {
      const axisData = visualData.filter(
        (dataMap) => dataMap.get(axisName) === axisValue
      );
      const data = axisData[0].get(dataName);
      if (data) {
        sums.push(parseInt(data));
      }
    }
    const max = Math.max(...sums);
    const position = sums.indexOf(max);
    if (axisValues[position]) {
      highestAxis = axisValues[position];
    }
    return [max, highestAxis];
  }

  for (const legendValue of legendValues) {
    const legendData = visualData.filter(
      (dataMap) => dataMap.get(legendName) === legendValue
    );
    const sums = [];
    for (const axisValue of axisValues) {
      const axisData = legendData.filter(
        (dataMap) => dataMap.get(axisName) === axisValue
      );
      let sum = 0;
      for (const axisDataPoint of axisData) {
        const data = axisDataPoint.get(dataName);
        if (data) {
          sum += parseInt(data);
        }
      }
      sums.push(sum);
    }
    const localMax = Math.max(...sums);
    if (localMax > max) {
      max = localMax;
      highestCategory = legendValue;
      const position = sums.indexOf(max);
      if (axisValues[position]) {
        highestAxis = axisValues[position];
      }
    }
  }

  return [max, highestCategory, highestAxis];
}

export async function getSpecificDataInfo(
  visual: VisualDescriptor,
  dataName: string
) {
  const dataMap = await getVisualData(visual);
  if (!dataMap || !dataName) {
    return [];
  }

  if (dataMap === "exportError") {
    const dataPoints = [];
    const data = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    )!.data.data;
    for (const map of data) {
      dataPoints.push(map.get(dataName));
    }
    return dataPoints;
  }

  return dataMap.get(dataName) ?? [];
}

export async function getData(
  visual: VisualDescriptor,
  categories: string[]
): Promise<Data> {
  const attributes = await getVisualDataFields(visual);
  const exportedData = await exportData(visual);
  if (!exportedData) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    return CGVisual?.data.data;
  }

  const visualData = exportedData.data;
  const data = [];

  const headers = visualData.slice(0, visualData.indexOf("\r")).split(",");
  const rows = visualData.slice(visualData.indexOf("\n") + 1).split(/\r?\n/);
  rows.pop();

  if (categories.length > 0) {
    for (const row of rows) {
      const values = row.split(",");
      for (const category of categories) {
        const rowData = new Map<string, string>();
        for (let i = 0; i < headers.length; i++) {
          if (categories.includes(headers[i])) {
            if (headers[i] === category) {
              rowData.set("Category", category);
              rowData.set("Value", values[i]);
            }
          } else {
            rowData.set(headers[i], values[i]);
          }
        }
        data.push(rowData);
      }
    }
  } else {
    for (const row of rows) {
      const values = row.split(",");
      const rowData = new Map<string, string>();
      for (let i = 0; i < headers.length; i++) {
        rowData.set(headers[i], values[i]);
      }
      data.push(rowData);
    }
  }

  return { attributes, data };
}

async function getVisualDataFields(
  visual: VisualDescriptor
): Promise<Array<string>> {
  const DataFields: Array<string> = [];

  if (visual.getCapabilities) {
    const capabilities = await visual.getCapabilities();
    if (capabilities.dataRoles) {
      await Promise.all(
        capabilities.dataRoles.map(async (role) => {
          const dataFields = await visual.getDataFields(role.name);
          if (dataFields.length > 0) {
            await Promise.all(
              dataFields.map(async (d, idx) => {
                const attribute = await visual.getDataFieldDisplayName(
                  role.name,
                  idx
                );
                DataFields.push(attribute);
              })
            );
          }
        })
      );
    }
  }
  return DataFields;
}

export function getDataWithId(
  traversal: TraversalElement[],
  ID: string,
  categories: string[],
  count: number
) {
  const traversalElements = traversal;

  let foundVisual: TraversalElement = {
    element: null,
    categories: [],
    count: 0,
  };
  for (const elem of traversalElements) {
    if (isGroup(elem.element)) {
      for (const groupTraversals of elem.element.visuals) {
        for (const groupElem of groupTraversals) {
          if (
            groupElem.element.id === ID &&
            groupElem.categories.every((category: string) =>
              categories.includes(category)
            ) &&
            groupElem.count == count
          ) {
            foundVisual = groupElem;
          }
        }
      }
      // } else {
      //   if (
      //     elem.element.id === ID &&
      //     elem.categories.every((category: string) =>
      //       categories.includes(category)
      //     ) &&
      //     elem.count == count
      //   ) {
      //     foundVisual = elem;
      //   }
      // }
    } else {
      if (elem.element.id === ID) {
        foundVisual = elem;
      }
    }
  }

  return foundVisual?.element; //as global.SettingsVisual;
}

export function firstLetterToUpperCase(str: string) {
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

export async function getVisualInfos(
  visual: VisualDescriptor,
  expertiseLevel: ExpertiseLevel = { Domain: Level.Medium, Vis: Level.Medium }
): Promise<BasicTextFormat> {
  const type = visual.type;
  let visualInfos: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    insightImages: [],
    insightInfos: [],
    interactionImages: [],
    interactionInfos: [],
  };
  try {
    switch (type) {
      case "card":
      case "multiRowCard":
        const card = new Card();
        visualInfos = await card.getCardInfo(visual, expertiseLevel);
        break;
      case "lineClusteredColumnComboChart":
        const combo = new ComboChart();
        visualInfos = await combo.getLineClusteredColumnComboChartInfo(
          visual,
          expertiseLevel
        );
        break;
      case "lineChart":
        const lineChart = new LineChart();
        visualInfos = await lineChart.getLineChartInfo(visual, expertiseLevel);
        break;
      case "clusteredBarChart":
        const barChart = new BarChart();
        visualInfos = await barChart.getClusteredBarChartInfo(
          visual,
          expertiseLevel
        );
        break;
      case "clusteredColumnChart":
        const columnChart = new ColumnChart();
        visualInfos = await columnChart.getClusteredColumnChartInfo(
          visual,
          expertiseLevel
        );
        break;
      case "slicer":
        const slicer = new Slicer();
        visualInfos = await slicer.getSlicerInfo(visual, expertiseLevel);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log("Error in getVisualsInfo", error);
  }

  return visualInfos;
}

export function getFilterInfo() {
  const filters = global.componentGraph.dashboard.globalFilter.filters;
  const filterInfos = [];
  for (let i = 0; i < filters.length; ++i) {
    const filter = filters[i] as Filter;
    filterInfos.push(getFilterDescription(filter));
  }

  return filterInfos;
}
export function saveInfoVideo(
  url: string,
  visId: string,
  categories: string[],
  count: number
) {
  const visData = getDataWithId(
    global.settings.traversalStrategy,
    visId,
    categories,
    count
  );
  if (!visData) {
    return;
  }

  visData.mediaType = global.mediaType.video;
  visData.videoURL = url;
}

// not used but might be useful
export async function getDataRange(
  visual: VisualDescriptor,
  categorie: string
) {
  const data = await getVisualData(visual);
  if (!data || data === "exportError") {
    return null;
  }

  let dataPoints = data.get(categorie);
  if (!dataPoints) {
    return null;
  }

  let numberArray: number[] = [];
  if (!isNaN(Number(dataPoints[0]))) {
    numberArray = dataPoints.map((str: string) => {
      return Number(str);
    });
  }

  for (let i = 0; i < dataPoints.length; i++) {
    const intArray = [];
    intArray.push(Math.min(...numberArray));
    intArray.push(Math.max(...numberArray));
    numberArray = intArray;
    dataPoints = numberArray.map((num: number) => {
      return num.toString();
    });
  }

  return dataPoints;
}

export async function getVisualData(visual: VisualDescriptor) {
  const exportedData = await exportData(visual);
  if (!exportedData) {
    return "exportError";
  }
  const visualData = exportedData.data;
  const headers = visualData.slice(0, visualData.indexOf("\r")).split(",");
  const rows = visualData.slice(visualData.indexOf("\n") + 1).split(/\r?\n/);
  rows.pop();
  const visualDataMap = new Map<string, string[]>();
  for (let i = 0; i < rows.length; i++) {
    const values = rows[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      const dataArray = visualDataMap.get(headers[j]) ?? [];
      dataArray.push(values[j]);
      visualDataMap.set(headers[j], dataArray);
    }
  }

  for (let i = 0; i < headers.length; i++) {
    const dataArray = visualDataMap.get(headers[i]) ?? [];
    visualDataMap.set(headers[i], dataArray);
  }

  return visualDataMap;
}

export function dataToString(dataArray: string | any[]) {
  let dataString = "";
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].length != 0) {
      dataString += dataArray[i];
      if (i == dataArray.length - 2) {
        dataString += " and ";
      } else if (i != dataArray.length - 1) {
        dataString += ", ";
      }
    }
  }
  return dataString;
}
