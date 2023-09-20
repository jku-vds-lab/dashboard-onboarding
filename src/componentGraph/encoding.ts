import Column from "./Column";
import Legend from "./Legend";
import Row from "./Row";
import Value from "./Value";
import XAxis from "./XAxis";
import YAxis from "./YAxis";

export default class Encoding {
  xAxes: XAxis[];
  yAxes: YAxis[];
  legends: Legend[];
  values: Value[];
  columns: Column[];
  rows : Row[];
  hasTooltip: boolean;

  constructor() {
    this.xAxes = [];
    this.yAxes = [];
    this.legends = [];
    this.values = [];
    this.columns = [];
    this.rows = [];

    this.hasTooltip = true;
  }
}
