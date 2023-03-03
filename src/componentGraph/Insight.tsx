import { getVisualInsight } from "./helperFunctions";

// Insight
export default class Insight {
  insights: string[];
  
  constructor() {
    this.insights = [];
  }

  async setInsight(visual: any){
    this.insights = await getVisualInsight(visual);
  }
}