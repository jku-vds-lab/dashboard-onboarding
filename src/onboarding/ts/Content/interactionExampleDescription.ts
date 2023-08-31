import BarChart from "./barChartVisualContent";
import ColumnChart from "./columnChartVisualContent";
import ComboChart from "./comboChartVisualContent";
import LineChart from "./lineChartVisualContent";
import Slicer from "./slicerVisualContent";

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

  interactionElementText(dataValue: string) {
    let text = "";

    text =
      this.interactionInfo.click +
      this.interactionInfo.element +
      dataValue +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  async getInteractionInfo(
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Slicer
  ) {
    switch (visualType) {
      case "slicer":
        break;
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
