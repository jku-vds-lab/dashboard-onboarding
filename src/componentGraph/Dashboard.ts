import Title from "./Title";
// import Visualization from "./Visualization";
import GlobalFilter from "./GlobalFilter";
import { page, visuals } from "./ComponentGraph";
import { getOperation, getPageFilters } from "./helperFunctions";
import Filter from "./Filter";
import Visualization from "./Visualization";

// Dashboard
export default class Dashboard {
  title: Title;
  purpose: string;
  task: string;
  layout: string;
  visualizations: Visualization[];
  globalFilter: GlobalFilter;

  constructor() {
    this.title = new Title();
    this.purpose = "";
    this.task = "";
    this.layout = "";
    this.visualizations = [];
    this.globalFilter = new GlobalFilter();
  }

  async setDashboardData() {
    this.title = new Title();
    this.purpose = this.getPurposeData();
    this.task = this.getTaskData();
    const vis = new Visualization();
    this.visualizations = await vis.getVisualizations();
    this.globalFilter = await this.getGlobalFilter();
    this.layout = this.getLayoutData();
  }

  async getGlobalFilter(): Promise<GlobalFilter> {
    this.globalFilter = new GlobalFilter();

    const pageFilters = await getPageFilters(page);
    for (const pageFilter of pageFilters) {
      const filter = new Filter();
      filter.attribute = <string>pageFilter?.attribute;
      filter.values = <string[]>pageFilter?.values;
      filter.operation = getOperation(<string>pageFilter?.operator);

      this.globalFilter.filters.push(filter);
    }
    return this.globalFilter;
  }

  getPurposeData() {
    const pageTitle = page.displayName;
    const defaultPurposeText =
      "The purpose of this dashboard is to allow an in-depth investigation of the " +
      pageTitle +
      " statistics.";
    return defaultPurposeText;
  }

  getTaskData() {
    const pageTitle = page.displayName;
    const defaultTaskText =
      "The task of this dashboard is to show the " + pageTitle + " statistics.";
    return defaultTaskText;
  }

  getLayoutData() {
    const numberOfVisuals = visuals.length;
    const numberOfFilters = this.globalFilter.filters.length;
    const defaultLayoutText =
      "This dashboard consists of " +
      numberOfVisuals +
      " visuals and " +
      numberOfFilters +
      " global filters.";
    return defaultLayoutText;
  }

  // async getVisualsData() {
  //   // why is this needed?
  //   for (const visual of visuals) {
  //     const visualisation = new Visualization();
  //     await visualisation.setVisualData(visual);
  //     this.visualizations.push(visualisation);
  //   }
  // }

  // async getVisualsData() {
  //   try {
  //     const promises: Promise<any>[] = [];

  //     for (const visual of visuals) {
  //       const visualisation = new Visualization();
  //       promises.push(visualisation.setVisualData(visual));
  //     }
  //     const results = await Promise.all(promises);
  //     for (const result of results) {
  //       this.visualizations.push(result);
  //     }
  //   } catch (error) {
  //     console.log("Error in getting Visuals Data", error);
  //   }
  // }
}
