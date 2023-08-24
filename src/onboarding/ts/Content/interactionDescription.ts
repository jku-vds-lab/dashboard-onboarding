import BasicTextFormat from "./Format/basicTextFormat";
import LineChart from "./lineChartVisualContent";
import BarChart from "./barChartVisualContent";
import ColumnChart from "./columnChartVisualContent";
import ComboChart from "./comboChartVisualContent";
import Slicer from "./slicerVisualContent";

export default class InteractionDescription {
  text: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    insightImages: [],
    insightInfos: [],
    interactionImages: [],
    interactionInfos: [],
  };

  private interactionInfo = {
    click: "By clicking on a ",
    clickAction: " you can filter the report",
    hover: "You can hover over ",
    hoverAction: " for detailed information",
    label: "label of the"
  };

  private prepositions = {
    by: " by ",
  };

  private components ={
    xAxis: "x-axis",
    yAxis: "y-axis",
    legend: "legend"
  }

  private punctuations = {
    comma: ",",
    dot: ".",
  };

  private lineBreak = "<br>";

  interactionClickText(
    mark: string,
    axis?: string,
    legend?: string,
  ) {
    let text = "";

    text =
      this.interactionInfo.click +
      mark +
      this.interactionInfo.clickAction;

    if(axis && legend){
      text += this.prepositions.by + axis +
      this.punctuations.comma + legend  ;
    } else if(axis){
      text += this.prepositions.by + axis;
    } else if(legend){
      text += this.prepositions.by + legend;
    }

    text += this.punctuations.dot + this.lineBreak;

    return text;
  }

  interactionHoverText(mark: string) {
    let text = "";

    text =
      this.interactionInfo.hover +
      mark +
      this.interactionInfo.hoverAction +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  interactionClickAxisText(axis: string, axisValue: string) {
    let text = "";

    text =
      this.interactionInfo.click +
      this.interactionInfo.label + 
      axis +
      this.interactionInfo.clickAction +
      this.prepositions.by + 
      axisValue + 
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  interactionClickLegendText(legendValue: string) {
    let text = "";

    text =
      this.interactionInfo.click +
      this.interactionInfo.label + 
      this.components.legend +
      this.interactionInfo.clickAction +
      this.prepositions.by + 
      legendValue + 
      this.punctuations.dot +
      this.lineBreak;
    return text;
  }

  getInteractionInfo(visualType:string, visual: LineChart | BarChart | ColumnChart | ComboChart | Slicer, isHorizontal: boolean) { //TODO add slicer and only display click information for slicer
    switch(visualType){
      case "slicer":
        break;
      case "combo":
        break;
      default:
        let interactionInfo = this.interactionClickText(
          visual.chart?.mark,
          visual.axis,
          visual.legend
        );
    
        if (visual.chart?.encoding.hasTooltip) {
          interactionInfo += this.interactionHoverText(
            visual.chart?.mark
          );
        }
    
        this.text.interactionImages.push("elemClickImg");
        this.text.interactionInfos.push(interactionInfo);
    
        if (visual.axisValue && visual.axisValue.isVisible) {
          const axis = isHorizontal? this.components.xAxis : this.components.yAxis;
          this.text.interactionImages.push("axisClickImg");
          this.text.interactionInfos.push(this.interactionClickAxisText(axis, visual.axis));
        }
    
        if (visual.legendValue && visual.legendValue.isVisible) {
          this.text.interactionImages.push("legendClickImg");
          this.text.interactionInfos.push(this.interactionClickLegendText(visual.legend));
        }
    }
  }
}