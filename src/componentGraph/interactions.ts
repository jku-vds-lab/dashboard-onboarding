import { dataToString } from "../onboarding/ts/helperFunctions";
import { visuals } from "./ComponentGraph";
import { getVisualInteractions } from "./helperFunctions";

class Interactions {
    interactionAttributes : string[];
    interactionChartsHighlighting: string[];
    interactionChartsFiltering: string[];
    description: string;
  
    constructor() {
      this.interactionAttributes = [];
      this.interactionChartsHighlighting = [];
      this.interactionChartsFiltering = [];
      this.description = "";
    }

    async setInteractionData(visual: any){
      const interactions = await getVisualInteractions(visual);
      this.interactionAttributes = interactions.interaction_attribute;
      this.interactionChartsHighlighting = interactions.interaction_charts;
      this.interactionChartsFiltering = interactions.interaction_charts;
      this.description = this.getInteractionDescription();
    }

    getInteractionDescription(){
      const attributeString = dataToString(this.interactionAttributes);
      const chartNamesHighlighting = visuals.filter(vis => this.interactionChartsHighlighting.includes(vis.name)).map(vis => vis.title);
      const chartStringHighlighting = dataToString(chartNamesHighlighting);
      const chartNamesFiltering = visuals.filter(vis => this.interactionChartsFiltering.includes(vis.name)).map(vis => vis.title);
      const chartStringFiltering = dataToString(chartNamesFiltering);
      
      return "This chart supports interactions on " + attributeString + ". Highlighting interactions on this chart will effect " + chartStringHighlighting + ". Filtering interactions on this chart will effect " + chartStringFiltering + ".";
    }
  }

  export default Interactions;