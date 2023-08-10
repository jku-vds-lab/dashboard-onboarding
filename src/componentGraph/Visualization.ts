import Data from "./Data";
import Insight from "./Insight";
import Title from "./Title";
import Visual_Channel from "./Visual_Channel";
import Interactions from "./Interactions";
import Encoding from "./Encoding";
import * as helper from "./helperFunctions";
import Local_Filter from "./Local_Filter";

// Visualization
export default class Visualization {
  id: string;
  type: string;
  task: string;
  description: string;
  mark: string;
  data: Data;
  insight: Insight;
  title: Title;
  visual_channel: Visual_Channel;
  interactions: Interactions;
  encoding: Encoding;
  filters: Local_Filter;

  constructor() {
    this.id = "";
    this.type = "";
    this.task = "";
    this.description = "";
    this.mark = "";
    this.data = new Data();
    this.insight = new Insight();
    this.title = new Title();
    this.visual_channel = new Visual_Channel();
    this.interactions = new Interactions();
    this.encoding = new Encoding();
    this.filters = new Local_Filter();
  }

  async setVisualData(visual: any) {
    this.id = visual.name;
    this.type = helper.toCamelCaseString(helper.getVisualType(visual));
    this.task = await helper.getVisualTask(visual);
    this.description = await helper.getVisualDescription(visual);
    this.mark = helper.getVisualMark(visual);
    await this.data.setData(visual);
    await this.insight.setInsight(visual);
    this.title.setTitle(visual);
    this.visual_channel.setChannel(visual);
    await this.interactions.setInteractionData(visual);
    await this.encoding.setEncodingData(visual);
    await this.filters.setLocalFilter(visual);
  }
}
