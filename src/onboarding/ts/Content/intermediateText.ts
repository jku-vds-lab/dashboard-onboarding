export default class IntermediateText {
  private articles = { the: "The ", a: "A ", an: "An " };
  private prepositions = {
    by: " by ",
    of: " of ",
    and: " and ",
    over: " over",
  };
  private period = ".";
  private lineBreak = "<br>";
  private axisInfo = {
    line: " shows the trend of ",
    bar: " represent(s) the ",
  };

  private legendInfo = {
    mark: " represent a different ",
    legend: " distinguished by color",
  };

  private interactionInfo = [
    { click: "By clicking on " },
    { clickAction: " you can filter the report by " },
    { hover: "You can hover over " },
    { hoverAction: " for detailed information" },
  ];

  axisText(visual: string, mark: string, dataName: string, axis: string) {
    let text = "";
    switch (visual) {
      case "line":
        text =
          this.axisInfo.line +
          dataName +
          this.prepositions.over +
          this.articles.the.toLocaleLowerCase() +
          axis +
          this.period +
          this.lineBreak;
        break;

      default:
        break;
    }

    return text;
  }
}
