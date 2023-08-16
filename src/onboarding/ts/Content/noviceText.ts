interface FormBody {
  prompt: string;
  tokens: number;
}
export default class NoviceText {
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
      this.lineBreak +
      this.articles.the +
      this.actions.purpose +
      this.verbs.is +
      task +
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
}
