export default class Interactions {
  interactionAttributes: string[];
  interactionChartsHighlighting: string[];
  interactionChartsFiltering: string[];
  description: string; // not really being used anywhere

  constructor() {
    this.interactionAttributes = [];
    this.interactionChartsHighlighting = [];
    this.interactionChartsFiltering = [];
    this.description = "";
  }
}
