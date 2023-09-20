import { dataToString } from "../../../../componentGraph/helperFunctions";
import BarChart from "../Visualizations/BarChartVisualContent";
import ColumnChart from "../Visualizations/ColumnChartVisualContent";
import ComboChart from "../Visualizations/ComboChartVisualContent";
import GlobalFilters from "../Visualizations/GlobalFiltersVisualContent";
import LineChart from "../Visualizations/LineChartVisualContent";
import Matrix from "../Visualizations/MatrixVisualContent";
import Slicer from "../Visualizations/SlicerVisualContent";
import Table from "../Visualizations/TableVisualContent";

import { InteractionTextFormat } from "./../Format/basicTextFormat";

export default class InteractionDescription {
  interactionText: InteractionTextFormat = {
    interactionImages: [],
    interactionInfos: [],
  };

  private interactionInfo = {
    click: "By clicking on a ",
    clickAction: " you can filter the report",
    hover: "You can hover over ",
    hoverAction: " for detailed information",
    label: "label of the ",
  };

  private prepositions = {
    by: " by ",
  };

  private components = {
    xAxis: "x-axis",
    yAxis: "y-axis",
    legend: "legend",
  };

  private punctuations = {
    comma: ",",
    dot: ".",
  };

  private lineBreak = "<br>";

  interactionClickText(
    mark: string,
    dataName?: string,
    axis?: string,
    legend?: string
  ) {
    let text = "";

    text =
      this.interactionInfo.click +
      mark +
      this.interactionInfo.clickAction +
      this.prepositions.by;

    if (dataName) {
      text += dataName;
    } else if (axis && legend) {
      text += axis + this.punctuations.comma + legend;
    } else if (axis) {
      text += axis;
    } else if (legend) {
      text += legend;
    }

    text += this.punctuations.dot + this.lineBreak;

    return text;
  }

  
  interactionTableText(mark: string) {
    let text = "";

    text =
      this.interactionInfo.click +
      mark +
      this.interactionInfo.clickAction +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  interactionHoverText(mark: string) {
    let text = "";

    text =
      this.interactionInfo.click +
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

  getInteractionInfo(
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Slicer | GlobalFilters | Matrix | Table
  ) {
    switch (visualType) {
      case "slicer":
        visual = visual as Slicer;
        this.interactionText.interactionImages.push("elemClickImg");
        this.interactionText.interactionInfos.push(
          this.interactionClickText(visual.mark, visual.data.attributes[0])
        );
        break;
      case "globalFilter":
        visual = visual as GlobalFilters;
        this.interactionText.interactionImages.push("elemClickImg");
        this.interactionText.interactionInfos.push(
          this.interactionClickText(visual.globalFilterInfos.mark, dataToString(visual.filterNames, "or"))
        );
        break;
      case "matrix":
      case "table":
        visual = visual as Matrix | Table;
        const interactionInfoTable = this.interactionTableText(
          visual.mark,
        );

        this.interactionText.interactionImages.push("elemClickImg");
        this.interactionText.interactionInfos.push(interactionInfoTable);
        break;
      default:
        visual = visual as LineChart | BarChart | ColumnChart;
        let interactionInfo = this.interactionClickText(
          visual.mark,
          visual.axis,
          visual.legend
        );

        if (visual.encoding.hasTooltip) {
          interactionInfo += this.interactionHoverText(visual.mark);
        }

        this.interactionText.interactionImages.push("elemClickImg");
        this.interactionText.interactionInfos.push(interactionInfo);

        if (visual.axisValue && visual.axisValue.isVisible) {
          const axis =
            visualType === "line" ||
            visualType === "column" ||
            visualType === "combo"
              ? this.components.xAxis
              : this.components.yAxis;
          this.interactionText.interactionImages.push("axisClickImg");
          this.interactionText.interactionInfos.push(
            this.interactionClickAxisText(axis, visual.axis)
          );
        }

        if (visual.legendValue && visual.legendValue.isVisible) {
          this.interactionText.interactionImages.push("legendClickImg");
          this.interactionText.interactionInfos.push(
            this.interactionClickLegendText(visual.legend)
          );
        }
    }
    return this.interactionText;
  }
}
