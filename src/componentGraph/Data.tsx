import { getVisualData } from "../onboarding/ts/helperFunctions";
import { getVisualDataFields } from "./helperFunctions";
import * as global from "../onboarding/ts/globalVariables";

// Data
export default class Data {
  attributes: string[];
  data: any;

  constructor() {
    this.attributes = [];
    this.data = null;
  }

  async setData(visual: any){
    this.attributes = await getVisualDataFields(visual);
    const newData = await getVisualData(visual);
    if(newData){
      this.data = newData;
    } else {
      const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
      this.data = CGVisual?.data.data;
    }
  }
}
