import BarChart from "../Visualizations/BarChartVisualContent";
import ColumnChart from "../Visualizations/ColumnChartVisualContent";
import ComboChart from "../Visualizations/ComboChartVisualContent";
import GlobalFilters from "../Visualizations/GlobalFiltersVisualContent";
import LineChart from "../Visualizations/LineChartVisualContent";
import Slicer from "../Visualizations/SlicerVisualContent";

export default class InteractionExampleDescription {
  private interactionInfo = {
    click: "Please click on the ",
    representing: " representing ",
    data: " data ",
    element: "element ",
  };

  private prepositions = {
    for: " for ",
    and: " and ",
  };

  private punctuations = {
    dot: ".",
  };

  private lineBreak = "<br>";

  interactionText(
    mark: string,
    dataName: string,
    axisValues?: string[],
    legendValues?: string[]
  ) {
    let text = "";

    text =
      this.interactionInfo.click +
      mark +
      this.interactionInfo.representing +
      dataName;

    if (axisValues && legendValues) {
      text +=
        this.prepositions.for +
        legendValues[Math.floor(legendValues.length / 2)] +
        this.prepositions.and +
        axisValues[Math.floor(axisValues.length / 2)];
    } else if (axisValues) {
      text +=
        this.prepositions.for + axisValues[Math.floor(axisValues.length / 2)];
    } else if (legendValues) {
      text +=
        this.prepositions.for +
        legendValues[Math.floor(legendValues.length / 2)];
    }

    text += this.punctuations.dot + this.lineBreak;

    return text;
  }

  getInteractionInfo(
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Slicer | GlobalFilters
  ) {
    switch (visualType) {
      case "slicer":
        visual = visual as Slicer;
        return this.interactionText(
          visual.mark,
          visual.data.data[Math.floor(visual.data.data.length / 2)].get(
            visual.data.attributes[0]
          )
        );
      case "globalFilter":
        visual = visual as GlobalFilters;
        const exampleFilter = visual.filters[Math.floor(visual.filters.length / 2)];
        return this.interactionText(
          visual.mark,
          exampleFilter.attribute,
          exampleFilter.values
        );
      default:
        visual = visual as LineChart | BarChart | ColumnChart;
        return this.interactionText(
          visual.mark,
          visual.dataName,
          visual.axisValues,
          visual.legendValues
        );
    }
  }
}
