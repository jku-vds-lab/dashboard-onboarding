import { getVisualChannel } from "./helperFunctions";

// Visual Channel
export default class Visual_Channel {
  channel: string[];

  constructor() {
    this.channel = [];
  }

  async setChannel(visual: any){
    this.channel = await getVisualChannel(visual);
  }
}