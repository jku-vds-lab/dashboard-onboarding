import Title from "./Title"
import Visualization from "./Visualization"
import Global_Filter from "./Global_Filter"
import { page, visuals } from "./ComponentGraph"

// Dashboard 
export default class Dashboard {
  title: Title; 
  purpose: string;
  task: string; 
  layout: string; 
  visualizations: Visualization[];
  global_filter: Global_Filter;
  
  constructor() {
    this.title = new Title();
    this.purpose = "";
    this.task = "";
    this.layout = "";
    this.visualizations = [];
    this.global_filter = new Global_Filter();
  }

  async setDashboardData(){
    this.title.setTitle(null);
    this.purpose = this.getPurposeData();
    this.task = this.getTaskData();
    await this.getVisualsData();
    await this.global_filter.setGlobalFilter();
    this.layout = this.getLayoutData();
  }

  getPurposeData(){
    const pageTitle = page.displayName;
    const defaultPurposeText = "The purpose of this dashboard is to allow an in-depth investigation of the " + pageTitle + " statistics."
    return defaultPurposeText;
  }

  getTaskData(){
    const pageTitle = page.displayName;
    const defaultTaskText = "The task of this dashboard is to show the " + pageTitle + " statistics."
    return defaultTaskText;
  }

  getLayoutData(){
    const numberOfVisuals = visuals.length;
    const numberOfFilters = this.global_filter.filters.length;
    const defaultLayoutText = "This dashboard consists of " + numberOfVisuals + " visuals and " + numberOfFilters + " global filters."
    return defaultLayoutText;
  }

  async getVisualsData(){
    for (const visual of visuals) {
      const visualisation = new Visualization();
      await visualisation.setVisualData(visual);
      this.visualizations.push(visualisation);
    }
  }
}