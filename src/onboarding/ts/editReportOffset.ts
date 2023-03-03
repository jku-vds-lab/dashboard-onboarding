import * as global from "./globalVariables";
import * as elements from "./elements";
import { createCollapseButton, firstLetterToUpperCase } from "./helperFunctions";

export function createReportOffsetGroup(){
    let divAttributes = global.createDivAttributes();
    divAttributes.id = "offsetGroup";
    divAttributes.style = "padding: 10px;border: 1px solid black;";
    divAttributes.parentId = "editOnbording";
    elements.createDiv(divAttributes);

    const h2Attributes = global.createH2Attributes();
    h2Attributes.id = "offsetLabel";
    h2Attributes.style = "display: inline-block;margin-bottom: 0px;";
    h2Attributes.content = "Report Offset:";
    h2Attributes.parentId = "offsetGroup";
    elements.createH2(h2Attributes);

    createCollapseButton("collapseButtonOffsetGroup", "offsetGroup");

    const smallAttributes = global.createSmallAttributes();
    smallAttributes.id = "offsetHelp";
    smallAttributes.style = "margin-bottom: 10px;";
    smallAttributes.content = "If our report has some padding please set these values. So that the onboarding can fitt ontop of the report.";
    smallAttributes.parentId = "offsetGroup";
    elements.createSmall(smallAttributes);

    divAttributes = global.createDivAttributes();
    divAttributes.id = "collapseFormoffsetGroup";
    divAttributes.classes = "collapse collapseForm";
    divAttributes.parentId = "offsetGroup";
    elements.createDiv(divAttributes);

    createOffsetInput("top", global.settings.reportOffset.top);
    createOffsetInput("bottom", global.settings.reportOffset.bottom);
    createOffsetInput("left", global.settings.reportOffset.left);
    createOffsetInput("right", global.settings.reportOffset.right);
}

function createOffsetInput(type: string, offsetSetting: { toString: () => string; }){
    const labelAttributes = global.createLabelAttributes();
    labelAttributes.id = type + "OffsetLabel";
    labelAttributes.for = type + "OffsetInput";
    labelAttributes.style = "margin-left: 10px;margin-right: 10px;";
    labelAttributes.content = firstLetterToUpperCase(type) + ":";
    labelAttributes.parentId = "collapseFormoffsetGroup";
    elements.createLabel(labelAttributes);

    const inputAttributes = global.createInputAttributes();
    inputAttributes.id = type + "OffsetInput";
    inputAttributes.type = "number";
    inputAttributes.value = offsetSetting.toString();
    inputAttributes.style = "margin-right: 20px;width: 100px;background-color:lightsteelblue;";
    inputAttributes.parentId = "collapseFormoffsetGroup";
    elements.createInput(inputAttributes);
}