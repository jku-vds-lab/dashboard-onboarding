import Data from "./Data";
import Insight from "./Insight";
import Title from "./Title";
import VisualChannel from "./VisualChannel";
import Interactions from "./Interactions";
import Encoding from "./Encoding";
import * as helper from "./helperFunctions";
import LocalFilter from "./LocalFilter";
import { VisualDescriptor } from "powerbi-client";
import { page, visuals } from "./ComponentGraph";

// Visualization
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
    try {
      await this.setVisualization(visual);
    } catch (error) {
      console.log("Error in getting Visuals Data", error);
    }
    return this;
  }

  async getVisualizations() {
    const visualizations = new Array<Visualization>();
    try {
      const promises: Promise<any>[] = [];

      for (const visual of visuals) {
        promises.push(this.setVisualization(visual));
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
    try {
      const visualization = new Visualization();
      visualization.id = visual.name;
      visualization.type = helper.toCamelCaseString(
        helper.getVisualType(visual)
      );
      visualization.mark = helper.getVisualMark(visual);
      visualization.title = helper.getVisualTitle(visual);

      const results = await Promise.all([
        helper.getVisualTask(visual),
        helper.getVisualDescription(visual),
        helper.getData(visual, []),
        helper.getVisualInsight(visual),
        helper.getVisualChannel(visual),
        helper.getVisualInteractions(visual),
        helper.getVisualEncoding(visual),
        helper.getLocalFilter(visual),
      ]);

      if (results.length == 8) {
        visualization.task = results[0];
        visualization.description = results[1];
        visualization.data = results[2];
        visualization.insights = results[3];
        visualization.channel = results[4];
        visualization.interactions = results[5];
        visualization.encoding = results[6];
        visualization.localFilters = results[7];
      }
      return visualization;
    } catch (error) {
      console.log("Error in setting visual data", error);
    }
  }
}
