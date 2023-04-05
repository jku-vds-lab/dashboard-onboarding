import { isVisible } from "../onboarding/ts/helperFunctions";
import { getVisualAttributeMapper } from "./helperFunctions";
import Legend from "./legend";
import Value from "./value";
import XAxis from "./xAxis";
import YAxis from "./yAxis";

class Encoding {
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

    async setEncodingData(visual: any){
      const attributes = await getVisualAttributeMapper(visual);
      const visibility = await this.getVisibleObjects(visual);
      for (const key in attributes) {
        const type = attributes[key];
        switch(type){
          case "X-axis":
            const xAxis = new XAxis();
            xAxis.setXAxisData(key, visibility[0]);
            this.xAxes.push(xAxis);
            break;
          case "Y-axis": case "Column y-axis": case "Line y-axis":
            const yAxis = new YAxis();
            yAxis.setYAxisData(key, visibility[1]);
            yAxis.setType(type);
            this.yAxes.push(yAxis);
            break;
          case "Legend":
            const legend = new Legend();
            legend.setLegendData(key, visibility[2]);
            this.legends.push(legend);
            break;
          case "Field": case "Fields":
            const value = new Value();
            value.setValueData(key, true);
            this.values.push(value);
            break;
          default:
            break;
        }
      }
    }

    async getVisibleObjects(visual: any) {
      this.hasTooltip = await isVisible(visual, "tooltip");
      const visibility = new Array<boolean>(3).fill(false);
      const VisualType = visual.type;
        switch(VisualType){
          case 'clusteredBarChart':
            visibility[0] = await isVisible(visual, "valueAxis");
            visibility[1] = await isVisible(visual, "categoryAxis");
            visibility[2] = await isVisible(visual, "legend");
            break;
          case 'lineChart':
          case 'lineClusteredColumnComboChart':
          case 'clusteredColumnChart':
            visibility[0] = await isVisible(visual, "categoryAxis");
            visibility[1] = await isVisible(visual, "valueAxis");
            visibility[2] = await isVisible(visual, "legend");
            break;
          default:
            break;
        }
      return visibility;
    }
  }
  
  export default Encoding;