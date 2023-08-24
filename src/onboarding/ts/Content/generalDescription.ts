import BasicTextFormat from "./Format/basicTextFormat";
import LineChart from "./lineChartVisualContent";
import BarChart from "./barChartVisualContent";
import * as helper from "../../../componentGraph/helperFunctions";
import Filter from "../../../componentGraph/Filter";
import ColumnChart from "./columnChartVisualContent";
import ComboChart from "./comboChartVisualContent";
import Card from "./cardVisualContent";
import Slicer from "./slicerVisualContent";

interface FormBody {
  prompt: string;
  tokens: number;
}
export default class GeneralDescription {
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
    to: "to"
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
    colon: ": "
  };

  private lineBreak = "<br>";

  private generalInfo = {
    values: " the values of the ",
    chart: " this chart "
  }

  private components ={
    xAxis: "X-axis",
    yAxis: "Y-axis",
    legend: "legend"
  }

  private axisInfo = {
    line: " shows the trend of ",
    bar: " represent(s) the ",
  };

  private legendInfo = {
    mark: " represent a different ",
    legend: " distinguished by color",
    color: " and its corresponding color."
  };

  private filterInfo = {
    value: " Its current value is ",
    operation: "The operation ",
    executed: " is executed for ",
    general: "This chart has the following filters:<br>"
  }

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
      this.punctuations.dot + this.lineBreak;

    return text;
  }

  purposeText(task: string) {
    let text = "";
    text =
      this.articles.the + this.actions.purpose +
      this.prepositions.of + this.generalInfo.chart +
      this.verbs.is + this.prepositions.to +
      task +
      this.punctuations.dot +
      this.lineBreak;

    return text;
  }

  markAxisText(mark: string, dataName: string, axis: string) {
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

  markLegendText(mark: string, legend: string) {
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

  axisText(axisType: string, axis: string) {
    let text = "";
    text =
      this.articles.the +
      axisType +
      this.generalInfo.values+
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
          text += this.filterInfo.operation + filter.operation +
            this.filterInfo.executed + filter.attribute +
            this.punctuations.dot;

          let valueText = helper.dataToString(filter.values);
          if (valueText !== "") {
            text += this.filterInfo.value + valueText +
            this.punctuations.dot + this.lineBreak;
          }
        }
      }
  
    return text;
  }

  getBeginnerVisDesc(visualType: string, visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer) {
    switch(visualType){
      case "card":
        break;
      case "slicer":
        break;
      case "combo":
        break;
      default:
        this.text.generalImages.push("infoImg");
        this.text.generalInfos.push(visual.description);
    
        const dataString = helper.dataToString(visual.chart.data.attributes!);
        const channelString = helper.dataToString(visual.chart.channel.channel!);
    
        const generalText = this.generalText(channelString, dataString);
        const purposeText = this.purposeText(visual?.task);
    
        this.text.generalImages.push("dataImg");
        this.text.generalInfos.push(generalText + purposeText);
    
        let markText = "";
        if (visual.axis) {
          markText += this.markAxisText(visual.chart?.mark, visual.dataName, visual.axis);
          this.text.generalImages.push("xAxisImg");
          this.text.generalInfos.push(this.axisText(this.components.xAxis, visual.axis));
        }
    
        if(visual.dataName){
          this.text.generalImages.push("yAxisImg");
          this.text.generalInfos.push(this.axisText(this.components.yAxis, visual.dataName));
        }
    
        if (visual.legend) {
          markText += this.markLegendText(visual.chart.mark, visual.legend);
          this.text.generalImages.push("legendImg");
          this.text.generalInfos.push(this.legendText(visual.legend));
        }
    
        this.text.generalImages.push(visualType + "GraphImg");
        this.text.generalInfos.push(markText);
    
    
        const filterText = this.filterText(visual.localFilters.localFilters);
        if (filterText !== "") {
          this.text.generalImages.push("filterImg");
          this.text.generalInfos.push(
            this.filterInfo.general + filterText
          );
        }
    }
    return this.text;
  }

  getIntermediateVisDesc(visualType: string, visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer) {
    switch(visualType){
      case "card":
        break;
      case "slicer":
        break;
      case "combo":
        break;
      default:
        let markText = "";
      if (visual.axis) {
        markText += this.markAxisText(
          visual.chart?.mark,
          visual.dataName,
          visual.axis
        );
        this.text.generalImages.push("xAxisImg");
        this.text.generalInfos.push(this.components.xAxis + this.punctuations.colon + visual.axis + this.punctuations.dot);
      }
      if(visual.dataName){
        this.text.generalImages.push("yAxisImg");
        this.text.generalInfos.push(this.components.yAxis + this.punctuations.colon + visual.dataName + this.punctuations.dot);
      }

      if (visual.legend) {
        markText += this.markLegendText(visual.chart.mark, visual.legend);
        this.text.generalImages.push("legendImg");
        this.text.generalInfos.push(helper.firstLetterToUpperCase(this.components.legend) + this.punctuations.colon + visual.legend + this.punctuations.dot);
      }

      this.text.generalImages.push(visualType + "GraphImg");
      this.text.generalInfos.push(markText);

      const filterText = this.filterText(visual.localFilters.localFilters);
      if (filterText !== "") {
        this.text.generalImages.push("filterImg");
        this.text.generalInfos.push(
          this.filterInfo.general + filterText
        );
      }
    }
    return this.text;
  }

  getAdvancedVisDesc(visualType: string, visual: LineChart | BarChart | ColumnChart | ComboChart | Card | Slicer) {
    switch(visualType){
      case "card":
        break;
      case "slicer":
        break;
      case "combo":
        break;
      default:
        let markText = "";
        if (visual.axis) {
          markText += this.markAxisText(
            visual.chart?.mark,
            visual.dataName,
            visual.axis
          );
        }
        if(visual.legend){
          markText += this.markLegendText(visual.chart.mark, visual.legend);
        }

        this.text.generalImages.push(visualType + "GraphImg");
        this.text.generalInfos.push(markText);
    }
    return this.text;
  }

  // get beginner, intermediate and advanced insight information

  // interaction information always stays the same

  // all text should be here and not in helper functions, not anywhere else. Max within the vis. But no where else.
}
