import { GeneralTextFormat } from "../Format/basicTextFormat";
import LineChart from "../Visualizations/lineChartVisualContent";
import BarChart from "../Visualizations/barChartVisualContent";
import * as helper from "../../../../componentGraph/helperFunctions";
import Filter from "../../../../componentGraph/Filter";
import ColumnChart from "./../Visualizations/columnChartVisualContent";
import ComboChart from "./../Visualizations/comboChartVisualContent";
import Card from "./../Visualizations/cardVisualContent";
import Slicer from "../Visualizations/slicerVisualContent";

interface FormBody {
  prompt: string;
  tokens: number;
}
export default class GeneralDescription {
  text: GeneralTextFormat = {
    generalImages: [],
    generalInfos: [],
  };

  private articles = { the: "The ", a: "A ", an: "An " };
  private prepositions = {
    by: " by ",
    of: " of ",
    and: " and ",
    over: " over ",
    to: "to",
  };
  private actions = {
    displays: " displays ",
    encoded: " encoded ",
    purpose: " purpose ",
  };
  private verbs = {
    is: " is ",
    are: " are ",
  };
  private pronouns = {
    it: "It ",
    their: "Their ",
    they: "They ",
  };

  private punctuations = {
    comma: ", ",
    dot: ".",
    colon: ": ",
  };

  private lineBreak = "<br>";

  private generalInfo = {
    values: " the values of the ",
    chart: " this chart ",
    currentValue: "This visual shows the current value of ",
    which: "which is ",
    with: "With this one ",
    filter: "you can filter by ",
  };

  private components = {
    xAxis: "X-axis",
    yAxis: "Y-axis",
    legend: "legend",
  };

  private axisInfo = {
    line: " shows the trend of ",
    bar: " represent(s) the ",
  };

  private legendInfo = {
    mark: " represent a different ",
    legend: " distinguished by color",
    color: " and its corresponding color",
  };

  private filterInfo = {
    value: " Its current value is ",
    operation: "The operation ",
    executed: " is executed for ",
    general: "This chart has the following filters:<br>",
  };

  async sendRequestToGPT(prompt: string) {
    const formBody: FormBody = { prompt: prompt, tokens: 20 };

    const response = await fetch("http://127.0.0.1:8000/chat-completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });

    const dataddd = await response.json();
    console.log("Chat generated successfully!", dataddd);
  }

  generalText(channel: string, data: string) {
    let text = "";
    text =
      this.pronouns.it +
      this.actions.displays +
      data +
      this.actions.encoded +
      this.prepositions.by +
      channel +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  cardText(dataName: string, dataValue: string) {
    let text = "";
    text =
      this.generalInfo.currentValue +
      dataName +
      this.punctuations.comma +
      this.generalInfo.which +
      dataValue +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  slicerText(dataName: string) {
    let text = "";
    text =
      this.generalInfo.with +
      this.generalInfo.filter +
      dataName +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  purposeText(task: string) {
    let text = "";
    text =
      this.articles.the +
      this.actions.purpose +
      this.prepositions.of +
      this.generalInfo.chart +
      this.verbs.is +
      this.prepositions.to +
      " " +
      task +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  markAxisText(mark: string, dataName: string, axis: string) {
    let text = "";
    text = this.articles.a + mark;
    if (mark === "line") {
      text +=
        this.axisInfo.line +
        dataName +
        this.prepositions.over +
        this.articles.the.toLocaleLowerCase() +
        axis;
    } else {
      text += this.axisInfo.bar + dataName;
    }

    text += this.punctuations.dot + this.lineBreak;
    return text;
  }

  markLegendText(mark: string, legend: string) {
    let text = "";
    text =
      this.articles.a +
      mark +
      this.legendInfo.mark +
      legend +
      this.legendInfo.legend +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  axisText(axisType: string, axis: string) {
    let text = "";
    text =
      this.articles.the +
      axisType +
      this.actions.displays +
      this.generalInfo.values +
      axis +
      this.punctuations.dot +
      this.lineBreak;
    return text;
  }

  legendText(legend: string) {
    let text = "";
    text =
      this.articles.the +
      this.components.legend +
      this.actions.displays +
      this.generalInfo.values +
      legend +
      this.legendInfo.color +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  filterText(filters: Filter[]) {
    let text = "";

    for (const filter of filters) {
      if (filter.operation !== "All") {
        text +=
          this.filterInfo.operation +
          filter.operation +
          this.filterInfo.executed +
          filter.attribute +
          this.punctuations.dot +
          this.lineBreak;

        const valueText = helper.dataToString(filter.values);
        if (valueText !== "") {
          text +=
            this.filterInfo.value +
            valueText +
            this.punctuations.dot +
            this.lineBreak;
        }
      }
    }

    return text;
  }

  getBeginnerVisDesc(
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer
  ) {
    this.text.generalImages.push("infoImg");
    this.text.generalInfos.push(visual.description);
    const purposeText = this.purposeText(visual?.task);

    switch (visualType) {
      case "card":
        visual = visual as Card;
        const generalTextCard = this.cardText(
          visual.data.attributes[0],
          visual.dataValue
        );

        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalTextCard + purposeText);
        break;
      case "slicer":
        visual = visual as Slicer;
        const generalTextSlicer = this.slicerText(visual.data.attributes[0]);

        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalTextSlicer + purposeText);
        break;
      default:
        let dataName;
        let marks = [];
        if (visualType === "combo") {
          visual = visual as ComboChart;
          dataName = helper.dataToString(visual.data.attributes);
          marks = ["Line", "Bar"];
        } else {
          visual = visual as LineChart | BarChart | ColumnChart;
          dataName = visual.dataName;
          marks = [visual.mark];
        }

        const dataString = helper.dataToString(visual.data.attributes!);
        const channelString = helper.dataToString(visual.channel.channel!);

        const generalText = this.generalText(channelString, dataString);

        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalText + purposeText);

        const isHorizontal =
          visualType === "line" ||
          visualType === "column" ||
          visualType === "combo";

        let markText = "";
        if (visual.axis) {
          for (const mark of marks) {
            markText += this.markAxisText(mark, dataName, visual.axis);
          }
          if (isHorizontal) {
            this.text.generalImages.push("xAxisImg");
            this.text.generalInfos.push(
              this.axisText(this.components.xAxis, visual.axis)
            );
          } else {
            this.text.generalImages.push("yAxisImg");
            this.text.generalInfos.push(
              this.axisText(this.components.yAxis, visual.axis)
            );
          }
        }

        if (dataName) {
          if (isHorizontal) {
            this.text.generalImages.push("yAxisImg");
            this.text.generalInfos.push(
              this.axisText(this.components.yAxis, dataName)
            );
          } else {
            this.text.generalImages.push("xAxisImg");
            this.text.generalInfos.push(
              this.axisText(this.components.xAxis, dataName)
            );
          }
        }

        if (visual.legend) {
          for (const mark of marks) {
            markText += this.markLegendText(mark, visual.legend);
          }
          this.text.generalImages.push("legendImg");
          this.text.generalInfos.push(this.legendText(visual.legend));
        }

        if (visualType === "line") {
          this.text.generalImages.push("lineGraphImg");
        } else {
          this.text.generalImages.push("barChartImg");
        }
        this.text.generalInfos.push(markText);
    }

    const filterText = this.filterText(visual.localFilters.localFilters);
    if (filterText !== "") {
      this.text.generalImages.push("filterImg");
      this.text.generalInfos.push(this.filterInfo.general + filterText);
    }
    return this.text;
  }

  getIntermediateVisDesc(
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer
  ) {
    switch (visualType) {
      case "card":
        visual = visual as Card;
        const generalTextCard = this.cardText(
          visual.data.attributes[0],
          visual.dataValue
        );

        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalTextCard);
        break;
      case "slicer":
        visual = visual as Slicer;
        const generalTextSlicer = this.slicerText(visual.data.attributes[0]);

        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalTextSlicer);
        break;
      default:
        visual = visual as LineChart | BarChart | ColumnChart | ComboChart;

        let dataName;
        let marks = [];
        if (visualType === "combo") {
          visual = visual as ComboChart;
          dataName = helper.dataToString(visual.data.attributes);
          marks = ["line", "bar"];
        } else {
          visual = visual as LineChart | BarChart | ColumnChart;
          dataName = visual.dataName;
          marks = [visual.mark];
        }

        const isHorizontal =
          visualType === "line" ||
          visualType === "column" ||
          visualType === "combo";
        let markText = "";
        if (visual.axis) {
          for (const mark of marks) {
            markText += this.markAxisText(mark, dataName, visual.axis);
          }
          if (isHorizontal) {
            this.text.generalImages.push("xAxisImg");
            this.text.generalInfos.push(
              this.components.xAxis +
                this.punctuations.colon +
                visual.axis +
                this.punctuations.dot
            );
          } else {
            this.text.generalImages.push("yAxisImg");
            this.text.generalInfos.push(
              this.components.yAxis +
                this.punctuations.colon +
                visual.axis +
                this.punctuations.dot
            );
          }
        }

        if (dataName) {
          if (isHorizontal) {
            this.text.generalImages.push("yAxisImg");
            this.text.generalInfos.push(
              this.components.yAxis +
                this.punctuations.colon +
                dataName +
                this.punctuations.dot
            );
          } else {
            this.text.generalImages.push("xAxisImg");
            this.text.generalInfos.push(
              this.components.xAxis +
                this.punctuations.colon +
                dataName +
                this.punctuations.dot
            );
          }
        }

        if (visual.legend) {
          for (const mark of marks) {
            markText += this.markLegendText(mark, visual.legend);
          }
          this.text.generalImages.push("legendImg");
          this.text.generalInfos.push(
            helper.firstLetterToUpperCase(this.components.legend) +
              this.punctuations.colon +
              visual.legend +
              this.punctuations.dot
          );
        }

        if (visualType === "line") {
          this.text.generalImages.push("lineGraphImg");
        } else {
          this.text.generalImages.push("barChartImg");
        }
        this.text.generalInfos.push(markText);
    }

    const filterText = this.filterText(visual.localFilters.localFilters);
    if (filterText !== "") {
      this.text.generalImages.push("filterImg");
      this.text.generalInfos.push(this.filterInfo.general + filterText);
    }
    return this.text;
  }

  getAdvancedVisDesc(
    visualType: string,
    visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer
  ) {
    switch (visualType) {
      case "card":
        visual = visual as Card;
        const generalTextCard = this.cardText(
          visual.data.attributes[0],
          visual.dataValue
        );

        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalTextCard);
        break;
      case "slicer":
        visual = visual as Slicer;
        const generalTextSlicer = this.slicerText(visual.data.attributes[0]);

        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalTextSlicer);
        break;
      default:
        visual = visual as LineChart | BarChart | ColumnChart | ComboChart;
        let dataName;
        let marks = [];
        if (visualType === "combo") {
          visual = visual as ComboChart;
          dataName = helper.dataToString(visual.data.attributes);
          marks = ["line", "bar"];
        } else {
          visual = visual as LineChart | BarChart | ColumnChart;
          dataName = visual.dataName;
          marks = [visual.mark];
        }

        let markText = "";
        if (visual.axis) {
          for (const mark of marks) {
            markText += this.markAxisText(mark, dataName, visual.axis);
          }
        }
        if (visual.legend) {
          for (const mark of marks) {
            markText += this.markLegendText(mark, visual.legend);
          }
        }
        if (visualType === "line") {
          this.text.generalImages.push("lineGraphImg");
        } else {
          this.text.generalImages.push("barChartImg");
        }
        this.text.generalInfos.push(markText);
    }

    return this.text;
  }

  // get beginner, intermediate and advanced insight information

  // interaction information always stays the same

  // all text should be here and not in helper functions, not anywhere else. Max within the vis. But no where else.
}
