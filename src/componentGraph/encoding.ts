import Legend from "./legend";
import Value from "./value";
import XAxis from "./xAxis";
import YAxis from "./yAxis";

export default class Encoding {
  xAxes: XAxis[];
  yAxes: YAxis[];
  legends: Legend[];
  values: Value[];
  hasTooltip: boolean;

  constructor() {
    this.xAxes = [];
    this.yAxes = [];
    this.legends = [];
    this.values = [];
    this.hasTooltip = true;
  }
}
