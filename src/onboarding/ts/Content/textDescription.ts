import Visualization from "../../../componentGraph/Visualization";
import BasicTextFormat from "./Format/basicTextFormat";
import * as helpers from "../helperFunctions";
import LineChart from "./lineChartVisualContent";
import BarChart from "./barChartVisualContent";

interface FormBody {
  prompt: string;
  tokens: number;
}
export default class TextDescription {
  text: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    insightImages: [],
    insightInfos: [],
    interactionImages: [],
    interactionInfos: [],
  };
  private articles = { the: "The ", a: "A ", an: "An " };
  private prepositions = {
    by: " by ",
    of: " of ",
    and: " and ",
    over: " over ",
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
    comma: ",",
    dot: ".",
  };

  private lineBreak = "<br>";
  private axisInfo = {
    line: " shows the trend of ",
    bar: " represent(s) the ",
  };

  private legendInfo = {
    mark: " represent a different ",
    legend: " distinguished by color",
  };

  private interactionInfo = {
    click: "By clicking on ",
    clickAction: " you can filter the report by ",
    hover: "You can hover over ",
    hoverAction: " for detailed information",
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

  purposeText(visual: string, channel: string, data: string, task?: string) {
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

  axisText(visual: string, mark?: string, dataName?: string, axis?: string) {
    let text = "";
    text =
      this.articles.the +
      mark +
      this.axisInfo.line +
      dataName +
      this.prepositions.over +
      this.articles.the.toLocaleLowerCase() +
      axis +
      this.punctuations.dot +
      this.lineBreak;
    return text;
  }

  legendText(visual: string, mark?: string, legend?: string) {
    let text = "";
    text =
      mark +
      this.legendInfo.mark +
      legend +
      this.legendInfo.legend +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  interactionClickText(
    visual: string,
    axis?: string,
    legend?: string,
    mark?: string
  ) {
    let text = "";

    text =
      this.interactionInfo.click +
      mark +
      this.interactionInfo.clickAction +
      axis +
      this.punctuations.comma;
    legend + this.punctuations.dot + this.lineBreak;

    return text;
  }

  interactionHoverText(visual: string, mark?: string) {
    let text = "";

    text =
      this.lineBreak +
      this.interactionInfo.hover +
      mark +
      this.interactionInfo.hoverAction +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }
  getBeginnerText(visualType: string, visual: LineChart | BarChart) {
    this.text.generalImages.push("infoImg");
    this.text.generalInfos.push("This element is a " + visualType + " chart.");

    const dataString = helpers.dataToString(visual.chart.data.attributes!);
    const channelString = helpers.dataToString(visual.chart.channel.channel!);
    this.text.generalImages.push("dataImg");

    const purposeText = this.purposeText(
      visualType,
      channelString,
      dataString,
      visual?.task
    );

    this.text.generalInfos.push(purposeText);
    if (visual.axis) {
      const axisText = this.axisText(
        visualType,
        visual.chart?.mark,
        visual.dataName,
        visual.axis
      );
      this.text.generalImages.push(visualType + "GraphImg");
      this.text.generalInfos.push(axisText);
      this.text.generalImages.push("xAxisImg");
      this.text.generalInfos.push(
        "The X-axis displays the values of the " + visual.axis + "."
      );
    }
    this.text.generalImages.push("yAxisImg");
    this.text.generalInfos.push(
      "The Y-axis displays the values of the " + visual.dataName + "."
    );

    if (visual.legend) {
      const legendText = this.legendText(
        visualType,
        visual.chart.mark,
        visual.legend
      );
      this.text.generalImages.push(visualType + "GraphImg");
      this.text.generalInfos.push(legendText);
      this.text.generalImages.push("legendImg");
      this.text.generalInfos.push(
        "The legend displays the values of the " +
          visual.legend +
          " and its corresponding color."
      );
    }

    const filterText = helpers.getLocalFilterText(visual.chart);
    if (filterText !== "") {
      this.text.generalImages.push("filterImg");
      this.text.generalInfos.push(
        "This chart has the following filters:<br>" + filterText
      );
    }
    return this.text;
  }

  getIntermediateText(visualType: string, visual: LineChart | BarChart) {
    if (visual.axis) {
      const axisText = this.axisText(
        visualType,
        visual.chart?.mark,
        visual.dataName,
        visual.axis
      );
      this.text.generalImages.push(visualType + "GraphImg");
      this.text.generalInfos.push(axisText);
      this.text.generalImages.push("xAxisImg");
      this.text.generalInfos.push("X-axis: " + visual.axis + ".");
    }
    this.text.generalImages.push("yAxisImg");
    this.text.generalInfos.push("Y-axis: " + visual.dataName + ".");

    if (visual.legend) {
      this.text.generalImages.push("legendImg");
      this.text.generalInfos.push("Legend value:  " + visual.legend);
    }

    const filterText = helpers.getLocalFilterText(visual.chart);
    if (filterText !== "") {
      this.text.generalImages.push("filterImg");
      this.text.generalInfos.push(
        "This chart has the following filters:<br>" + filterText
      );
    }
    return this.text;
  }

  getAdvancedText(visualType: string, visual: LineChart | BarChart) {
    if (visual.axis) {
      const axisText = this.axisText(
        visualType,
        visual.chart?.mark,
        visual.dataName,
        visual.axis
      );
      this.text.generalImages.push(visualType + "GraphImg");
      this.text.generalInfos.push(axisText);
    }
    return this.text;
  }
}
