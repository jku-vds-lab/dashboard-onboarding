import Visualization from "../../../componentGraph/Visualization";
import BasicTextFormat from "./Format/basicTextFormat";
import LineChart from "./lineChartVisualContent";
import BarChart from "./barChartVisualContent";
import { Visual, VisualDescriptor } from "powerbi-client";
import * as helper from "../../../componentGraph/helperFunctions";
import * as global from "./../globalVariables";

export default class InteractionDescription {
  // from line chart

  text: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    insightImages: [],
    insightInfos: [],
    interactionImages: [],
    interactionInfos: [],
  };

  private interactionInfo = {
    click: "By clicking on ",
    clickAction: " you can filter the report by ",
    hover: "You can hover over ",
    hoverAction: " for detailed information",
  };

  private punctuations = {
    comma: ",",
    dot: ".",
  };

  private lineBreak = "<br>";

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

  //   getInteractionDescription() {
  //   const attributeString = dataToString(this.interactionAttributes);
  //   const chartNamesHighlighting = visuals
  //     .filter((vis) => this.interactionChartsHighlighting.includes(vis.name))
  //     .map((vis) => vis.title);
  //   const chartStringHighlighting = dataToString(chartNamesHighlighting);
  //   const chartNamesFiltering = visuals
  //     .filter((vis) => this.interactionChartsFiltering.includes(vis.name))
  //     .map((vis) => vis.title);
  //   const chartStringFiltering = dataToString(chartNamesFiltering);

  //   return (
  //     "This chart supports interactions on " +
  //     attributeString +
  //     ". Highlighting interactions on this chart will effect " +
  //     chartStringHighlighting +
  //     ". Filtering interactions on this chart will effect " +
  //     chartStringFiltering +
  //     "."
  //   );
  // }

  getInteractionInfo(visualType: string, visual: LineChart | BarChart) {
    this.text.interactionImages.push("interactImg");
    // text.interactionInfos.push(CGVisual?.interactions.description!); // this should be the function down there

    let interactionInfo = this.interactionClickText(
      visual.chart.type,
      visual.axis,
      visual.legend,
      visual.chart?.mark
    );
    if (visual.chart?.encoding.hasTooltip) {
      interactionInfo += this.interactionHoverText(
        visual.chart.type,
        visual.chart?.mark
      );
    }
    this.text.interactionImages.push("elemClickImg");
    this.text.interactionInfos.push(interactionInfo);

    if (visual.axisValue) {
      this.text.interactionImages.push("axisClickImg");
      this.text.interactionInfos.push(
        "When clicking on one of the x-axis-labels you can filter the report by " +
          visual.axis +
          "."
      );
    }

    if (visual.legendValue && visual.legendValue.isVisible) {
      this.text.interactionImages.push("legendClickImg");
      this.text.interactionInfos.push(
        "When clicking on one of the labels in the legend you can filter the report by " +
          visual.legend +
          "."
      );
    }
  }

  async getLineClusteredColumnComboChartInteractionExample(
    visual: VisualDescriptor
  ) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    const axis = CGVisual?.encoding.xAxes[0].attribute;
    const axisValues = await helper.getSpecificDataInfo(visual, axis!);
    const data = CGVisual?.encoding.yAxes;
    const columnData = data?.filter((yAxis) => yAxis.type === "Column y-axis")!;
    const lineData = data?.filter((yAxis) => yAxis.type === "Line y-axis")!;

    const middelOfAxisValues = Math.floor(axisValues.length / 2);

    let interactionInfo;
    if (lineData.length != 0 && columnData.length == 0) {
      interactionInfo = "Please click on the line";
      if (axisValues && lineData) {
        interactionInfo +=
          " representing " +
          lineData[0].attribute +
          " at the area of " +
          axisValues[middelOfAxisValues] +
          ".";
      } else if (axisValues) {
        interactionInfo +=
          " at the area of " + axisValues[middelOfAxisValues] + ".";
      } else if (lineData.length == 0) {
        interactionInfo += " representing " + lineData[0].attribute + ".";
      } else {
        interactionInfo += ".";
      }
    } else {
      interactionInfo = "Please click on the bar representing the ";
      if (axisValues && columnData.length != 0) {
        interactionInfo +=
          columnData[0].attribute +
          " for " +
          axisValues[middelOfAxisValues] +
          ".";
      } else if (axisValues) {
        interactionInfo += " data for " + axisValues[middelOfAxisValues] + ".";
      } else if (columnData.length != 0) {
        interactionInfo += columnData[0].attribute + ".";
      } else {
        interactionInfo += ".";
      }
    }

    return interactionInfo;
  }

  async getLineChartInteractionExample(visual: VisualDescriptor) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    const axis = CGVisual?.encoding.xAxes[0].attribute;
    const legend = CGVisual?.encoding.legends[0]
      ? CGVisual?.encoding.legends[0]?.attribute
      : "";
    const axisValues = await helper.getSpecificDataInfo(visual, axis!);
    const legendValues = await helper.getSpecificDataInfo(visual, legend!);

    const middelOfAxisValues = Math.floor(axisValues.length / 2);

    let interactionInfo = "Please click on the " + CGVisual?.mark;
    if (
      axisValues &&
      legendValues &&
      axisValues.length !== 0 &&
      legendValues.length !== 0
    ) {
      interactionInfo +=
        " representing " +
        legendValues[0] +
        " at the area of " +
        axisValues[middelOfAxisValues] +
        ".";
    } else if (axisValues && axisValues.length !== 0) {
      interactionInfo +=
        " at the area of " + axisValues[middelOfAxisValues] + ".";
    } else if (legendValues && legendValues.length !== 0) {
      interactionInfo += " representing " + legendValues[0] + ".";
    } else {
      interactionInfo += ".";
    }

    return interactionInfo;
  }

  async getBarChartInteractionExample(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    const axis = CGVisual?.encoding.yAxes[0]
      ? CGVisual?.encoding.yAxes[0].attribute!
      : "";
    const dataName = CGVisual?.encoding.xAxes[0]
      ? CGVisual?.encoding.xAxes[0].attribute!
      : "";

    return await this.getBarAndColumnChartInteractionExample(
      visual,
      axis,
      dataName
    );
  }

  async getColumnChartInteractionExample(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    const axis = CGVisual?.encoding.xAxes[0]
      ? CGVisual?.encoding.xAxes[0].attribute!
      : "";
    const dataName = CGVisual?.encoding.yAxes[0]
      ? CGVisual?.encoding.yAxes[0].attribute!
      : "";

    return await this.getBarAndColumnChartInteractionExample(
      visual,
      axis,
      dataName
    );
  }

  async getBarAndColumnChartInteractionExample(
    visual: any,
    axis: string,
    dataName: string
  ) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    const legend = CGVisual?.encoding.legends[0]
      ? CGVisual?.encoding.legends[0].attribute!
      : "";
    const axisValues = await helper.getSpecificDataInfo(visual, axis);
    const legendValues = await helper.getSpecificDataInfo(visual, legend);

    const middelOfAxisValues = Math.floor(axisValues.length / 2);

    let interactionInfo = "Please click on the " + CGVisual?.mark;
    if (dataName !== "") {
      interactionInfo += " representing the " + dataName;
    }
    if (
      axisValues &&
      legendValues &&
      axisValues.length !== 0 &&
      legendValues.length !== 0
    ) {
      interactionInfo +=
        " for " +
        axisValues[middelOfAxisValues] +
        " and " +
        legendValues[0] +
        ".";
    } else if (axisValues && axisValues.length !== 0) {
      interactionInfo += " for " + axisValues[middelOfAxisValues] + ".";
    } else if (legendValues && legendValues.length !== 0) {
      interactionInfo += " for " + legendValues[0] + ".";
    } else {
      interactionInfo += ".";
    }

    return interactionInfo;
  }

  async getSlicerInteractionExample(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    const filterName = CGVisual?.encoding.values[0]!;
    const dataValues = await helper.getSpecificDataInfo(
      visual,
      filterName.attribute
    );

    const middelOfDataValues = Math.floor(dataValues.length / 2);

    const interactionInfo =
      "Please click on the list element " +
      dataValues[middelOfDataValues] +
      ".";

    return interactionInfo;
  }

  // from the interaction example file

  getDataOfInteractionVisual(visual: VisualDescriptor) {
    const visualsData = global.settings.interactionExample.visuals;
    const visualData = visualsData.find(function (data) {
      return data.id == visual.name;
    });

    return visualData;
  }

  async createInteractionInfo(visual: VisualDescriptor) {
    const visualData = this.getDataOfInteractionVisual(visual);
    let interactionInfo;

    switch (visualData?.clickInfosStatus) {
      case global.infoStatus.original:
        interactionInfo = await this.getInteractionText(visual);
        break;
      case global.infoStatus.changed:
      case global.infoStatus.added:
        interactionInfo = visualData.changedClickInfo;
        break;
      default:
        interactionInfo =
          "Please click on an element of the visualization to filter the report.";
        break;
    }

    if (!interactionInfo) {
      interactionInfo =
        "Please click on an element of the visualization to filter the report.";
    }

    document.getElementById("contentText")!.innerHTML = interactionInfo;
  }

  async getInteractionText(visual: VisualDescriptor) {
    const type = visual.type; // helpers.getTypeName(visual); // again what the hell, why are you not using visual.type?????

    let interactionInfo;

    switch (type) {
      case "Line Clustered Column Combo Chart":
        interactionInfo =
          await this.getLineClusteredColumnComboChartInteractionExample(visual);
        break;
      case "Line Chart":
        interactionInfo = await this.getLineChartInteractionExample(visual);
        break;
      case "Clustered Bar Chart":
        interactionInfo = await this.getBarChartInteractionExample(visual);
        break;
      case "Clustered Column Chart":
        interactionInfo = await this.getColumnChartInteractionExample(visual);
        break;
      case "Slicer":
        interactionInfo = await this.getSlicerInteractionExample(visual);
        break;
      default:
        break;
    }

    return interactionInfo;
  }
}
