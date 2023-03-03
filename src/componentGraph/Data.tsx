import { getVisualData } from "../onboarding/ts/helperFunctions";
import { getVisualDataFields } from "./helperFunctions";

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
    this.data = await getVisualData(visual);
  }
}
