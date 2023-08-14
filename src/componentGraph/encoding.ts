import Legend from "./Legend";
import Value from "./Value";
import XAxis from "./XAxis";
import YAxis from "./YAxis";

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
