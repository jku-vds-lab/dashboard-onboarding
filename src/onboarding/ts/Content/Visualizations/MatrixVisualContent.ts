import { BasicTextFormat } from "../Format/basicTextFormat";
import Visualization from "../../../../componentGraph/Visualization";
import { VisualDescriptor } from "powerbi-client";
import { ExpertiseLevel } from "../../../../UI/redux/expertise";
import ExpertiseText from "../userLevel";
import InteractionExampleDescription from "../Text Descriptions/interactionExampleDescription";
import Column from "../../../../componentGraph/Column";
import Row from "../../../../componentGraph/Row";
import Value from "../../../../componentGraph/Value";
import { getSpecificDataInfo } from "../../../../componentGraph/helperFunctions";

export default class Matrix extends Visualization {
  text: BasicTextFormat;
  textDescription: ExpertiseText;
  interactionExample: InteractionExampleDescription;
  columnValue: Column;
  column: string;
  columnValues: string[];
  rowValue: Row;
  row: string;
  rowValues: string[];
  dataValue: Value;
  dataName: string;

  constructor() {
    super();

    this.text = {
      generalImages: [],
      generalInfos: [],
      insightImages: [],
      insightInfos: [],
      interactionImages: [],
      interactionInfos: [],
    };
    this.textDescription = new ExpertiseText();
    this.interactionExample = new InteractionExampleDescription();
    this.columnValue = new Column();
    this.column = "";
    this.columnValues = [];
    this.rowValue = new Row();
    this.row = "";
    this.rowValues = [];
    this.dataValue = new Value();
    this.dataName = "";
  }

  async setVisualInformation(visual:VisualDescriptor){    
    await this.setVisualization(visual);

    this.rowValue = this.encoding.rows[0];
    this.row = this.encoding.rows[0] ? this.encoding.rows[0].attribute! : "";
    this.rowValues = this.encoding.rows[0]
      ? await getSpecificDataInfo(visual, this.row)
      : [];

    this.columnValue = this.encoding.columns[0];
    this.column = this.encoding.columns[0]
      ? this.encoding.columns[0].attribute
      : "";
    this.columnValues = this.encoding.columns[0]
      ? await getSpecificDataInfo(visual, this.column)
      : [];

    this.dataName = this.encoding.values[0]
      ? this.encoding.values[0].attribute!
      : "";
  }

  getMatrixChartInfo(
    expertiseLevel: ExpertiseLevel
  ) {
    this.text = this.textDescription.getTextWithUserLevel(
      expertiseLevel,
      "matrix",
      this
    );
    return this.text;
  }

  getMatrixInteractionExample(){
    const exampleText = this.interactionExample.getInteractionInfo("matrix", this);
    return exampleText?exampleText:"";
  }
}
