import Data from "./Data";
import Insight from "./Insight";
import Title from "./Title";
import VisualChannel from "./VisualChannel";
import Interactions from "./Interactions";
import Encoding from "./encoding";
import * as helper from "./helperFunctions";
import LocalFilter from "./LocalFilter";
import { VisualDescriptor } from "powerbi-client";
import { page, visuals } from "./ComponentGraph";
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import Legend from "./Legend";
import Value from "./Value";
import Filter from "./Filter";

export default class Visualization {
  id: string;
  type: string;
  task: string;
  data: Data;
  description: string;
  mark: string;
  encoding: Encoding;
  title: Title;
  channel: VisualChannel;
  interactions: Interactions;
  insights: Insight;
  localFilters: LocalFilter;

  constructor() {
    this.id = "";
    this.type = "";
    this.task = "";
    this.description = "";
    this.mark = "";
    this.data = new Data();
    this.insights = new Insight();
    this.title = new Title();
    this.channel = new VisualChannel();
    this.interactions = new Interactions();
    this.encoding = new Encoding();
    this.localFilters = new LocalFilter();
  }

  async getVisualization(visual: VisualDescriptor) {
    let visualization = new Visualization();
    try {
      visualization = await this.setVisualization(visual);
    } catch (error) {
      console.log("Error in getting Visuals Data", error);
    }
    return visualization;
  }

  async getVisualizations() {
    const visualizations = new Array<Visualization>();
    try {
      const promises: Promise<any>[] = [];

      for (const visual of visuals) {
        promises.push(this.getVisualization(visual));
      }
      const results = await Promise.all(promises);
      for (const result of results) {
        visualizations.push(result);
      }
    } catch (error) {
      console.log("Error in getting Visuals Data", error);
    }
    return visualizations;
  }

  // change from VisualDescriptor to Visualization
  async setVisualization(visual: VisualDescriptor) {
    const visualization = new Visualization();
    try {
      visualization.id = visual.name;
      visualization.type = this.toCamelCaseString(visual.type);
      visualization.mark = this.getVisualMark(visual);
      visualization.title = this.getVisualTitle(visual);
      visualization.task = this.getVisualTask(visual);
      visualization.description = this.getVisualDescription(visual);

      const results = await Promise.all([
        helper.getData(visual, []),
        this.getVisualChannel(visual),
        this.getVisualEncoding(visual),
        this.getLocalFilter(visual),
      ]);

      if (results.length == 4) {
        visualization.data = results[0];
        visualization.channel = results[1];
        visualization.encoding = results[2];
        visualization.localFilters = results[3];
      }
    } catch (error) {
      console.log("Error in setting visual data", error);
    }
    return visualization;
  }

  async getVisualEncoding(visual: VisualDescriptor): Promise<Encoding> {
    const encoding = new Encoding();
    let attributes: any;
    let visibility = new Array<boolean>();
    try {
      const results = await Promise.all([
        this.getVisualAttributeMapper(visual),
        this.getVisibleObjects(visual),
        this.isVisible(visual, "tooltip"),
      ]);

      if (results.length < 3) {
        return encoding;
      }
      if (results.length == 3) {
        attributes = results[0];
        visibility = results[1];
        encoding.hasTooltip = results[2];
      }

      for (const key in attributes) {
        const type = attributes[key];
        switch (type) {
          case "X-axis":
            const xAxis = new XAxis();
            xAxis.setXAxisData(key, visibility[0]);
            encoding.xAxes.push(xAxis);
            break;
          case "Y-axis":
          case "Column y-axis":
          case "Line y-axis":
            const yAxis = new YAxis();
            yAxis.setYAxisData(key, visibility[1]);
            yAxis.setType(type);
            encoding.yAxes.push(yAxis);
            break;
          case "Legend":
            const legend = new Legend();
            legend.setLegendData(key, visibility[2]);
            encoding.legends.push(legend);
            break;
          case "Field":
          case "Fields":
            const value = new Value();
            value.setValueData(key, true);
            encoding.values.push(value);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log("Error in getVisualEncoding()", error);
    }

    return encoding;
  }

  async getVisualAttributeMapper(
    visual: VisualDescriptor
  ): Promise<{ [key: string]: string }> {
    const mapper: { [key: string]: string } = {};

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
                  if (role.displayName) {
                    const role_display_name = await role.displayName;
                    mapper[attribute] = role_display_name;
                  }
                })
              );
            }
          })
        );
      }
    }
    return mapper;
  }

  getVisualMark(visual: VisualDescriptor): string {
    let mark = "";
    debugger;
    const VisualType = visual.type;
    switch (VisualType) {
      case "card":
      case "multiRowCard":
        mark = "Value";
        break;
      case "slicer":
        mark = "Value";
        break;
      case "lineChart":
        mark = "Line";
        break;
      case "clusteredBarChart":
      case "clusteredColumnChart":
        mark = "Bar";
        break;
      case "lineClusteredColumnComboChart":
        mark = "Line or Bar";
        break;
      default:
        mark = "This type of visual is not supported yet";
        break;
    }
    return mark;
  }
  toCamelCaseString(title: string): string {
    return title
      .split(" ")
      .map((t, i) => (i === 0 ? t : t[0].toUpperCase() + t.slice(1)))
      .join("");
  }

  getVisualTitle(visual: VisualDescriptor): Title {
    let title = "";
    if (visual == null) {
      title = page.displayName;
    } else {
      title = visual.title;
    }
    return { title };
  }

  getVisualTask(visual: VisualDescriptor): string {
    let task = "";
    const VisualType = visual.type;
    switch (VisualType) {
      case "card":
      case "multiRowCard":
        task = "summarize";
        break;
      case "slicer":
        task = "discover, derive and explore";
        break;
      case "lineChart":
        task = "show trends";
        break;
      case "clusteredBarChart":
      case "clusteredColumnChart":
        task = "show part-to-whole relationship, lookup values and find trends";
        break;
      case "lineClusteredColumnComboChart":
        task = "compare, lookup values and find trends";
        break;
      default:
        task = "This type of visual is not supported yet";
        break;
    }
    return task;
  }

  getVisualDescription(visual: VisualDescriptor): string {
    let description = "";
    const VisualType = visual.type;
    switch (VisualType) {
      case "card":
      case "multiRowCard":
        description =
          "This element is a card. Cards display the most important facts of a report.";
        break;
      case "slicer":
        description =
          "This element is a slicer. Slicers act as filters for the report.";
        break;
      case "lineChart":
        description = "This element is a line chart.";
        break;
      case "clusteredBarChart":
        description = "This element is a clusterd bar chart.";
        break;
      case "clusteredColumnChart":
        description = "This element is a clustered column chart.";
        break;
      case "lineClusteredColumnComboChart":
        description =
          "This element is a line clustered column combo chart. It can combine lines and bars in one chart.";
        break;
      default:
        description = "This type of visual is not supported yet";
        break;
    }
    return description;
  }

  async getVisualChannel(visual: VisualDescriptor): Promise<VisualChannel> {
    const channel = [];
    const VisualType = visual.type;
    if (
      VisualType === "lineChart" ||
      VisualType === "clusteredBarChart" ||
      VisualType === "clusteredColumnChart" ||
      VisualType === "lineClusteredColumnComboChart"
    ) {
      channel.push("position");
      const encoding = await this.getVisualAttributeMapper(visual);
      if (
        Object.values(encoding).includes("Legend") ||
        Object.values(encoding).includes("Column y-axis")
      ) {
        channel.push("color");
      }
    }
    return { channel };
  }

  async getVisibleObjects(visual: VisualDescriptor) {
    const visibility = new Array<boolean>(3).fill(false);
    const VisualType = visual.type;
    switch (VisualType) {
      case "clusteredBarChart":
        visibility[0] = await this.isVisible(visual, "valueAxis");
        visibility[1] = await this.isVisible(visual, "categoryAxis");
        visibility[2] = await this.isVisible(visual, "legend");
        break;
      case "lineChart":
      case "lineClusteredColumnComboChart":
      case "clusteredColumnChart":
        visibility[0] = await this.isVisible(visual, "categoryAxis");
        visibility[1] = await this.isVisible(visual, "valueAxis");
        visibility[2] = await this.isVisible(visual, "legend");
        break;
      default:
        break;
    }
    return visibility;
  }

  async isVisible(visual: VisualDescriptor, selectorObject: string) {
    if (selectorObject === "") {
      return true;
    }
    const selector = {
      objectName: selectorObject,
      propertyName: "visible",
    };
    const visible = await visual.getProperty(selector);
    if (visible.value) {
      return true;
    } else {
      return false;
    }
  }

  async getLocalFilter(visual: VisualDescriptor): Promise<LocalFilter> {
    const visualFilters = await this.getVisualFilters(visual);
    const localFilters = new Array<Filter>();

    for (const visualFilter of visualFilters) {
      const filter = new Filter();

      filter.attribute = <string>visualFilter?.attribute;
      filter.values = <string[]>visualFilter?.values;
      filter.operation = helper.getOperation(<string>visualFilter?.operator);
      localFilters.push(filter);
    }

    return { localFilters };
  }

  async getVisualFilters(
    visual: VisualDescriptor
  ): Promise<Array<Record<string, unknown>>> {
    const FiltersCollectionArray = [];
    const LocalFilters = await visual.getFilters();
    for (const x in LocalFilters) {
      const FiltersCollection = {};
      if ("target" in LocalFilters[x]) {
        if ("table" in LocalFilters[x]["target"]) {
          FiltersCollection["table"] = LocalFilters[x]["target"]["table"];
        }
      }
      if ("target" in LocalFilters[x]) {
        if ("column" in LocalFilters[x]["target"]) {
          FiltersCollection["attribute"] = LocalFilters[x]["target"]["column"];
        }
        if ("measure" in LocalFilters[x]["target"]) {
          FiltersCollection["attribute"] = LocalFilters[x]["target"]["measure"];
        }
      }
      if ("logicalOperator" in LocalFilters[x]) {
        FiltersCollection["operator"] = LocalFilters[x]["logicalOperator"];
      }
      if ("operator" in LocalFilters[x]) {
        FiltersCollection["operator"] = LocalFilters[x]["operator"];
      }
      if ("values" in LocalFilters[x]) {
        FiltersCollection["values"] = LocalFilters[x]["values"];
      }
      if ("conditions" in LocalFilters[x]) {
        FiltersCollection["values"] = LocalFilters[x]["conditions"];
      }
      FiltersCollectionArray.push(FiltersCollection);
    }
    return FiltersCollectionArray;
  }
}
