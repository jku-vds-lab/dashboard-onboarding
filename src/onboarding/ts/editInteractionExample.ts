import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { getInteractionText } from "./interactionExample";

export async function createInteractionExampleGroup(){
    let divAttributes = global.createDivAttributes();
    divAttributes.id = "interactionExampleGroup";
    divAttributes.style = "padding: 10px;border: 1px solid black;";
    divAttributes.parentId = "editOnbording";
    elements.createDiv(divAttributes);

    const h2Attributes = global.createH2Attributes();
    h2Attributes.id = "interactionExampleLabel";
    h2Attributes.style = "display: inline-block;margin-bottom: 0px;";
    h2Attributes.content = "Interaction Example:";
    h2Attributes.parentId = "interactionExampleGroup";
    elements.createH2(h2Attributes);

    helpers.createCollapseButton("collapseButtonInteractionExampleGroup", "interactionExampleGroup");

    const buttonAttributes = global.createButtonAttributes();
    buttonAttributes.id = "resetInteractionExampleInfo";
    buttonAttributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg> Reset`;
    buttonAttributes.style =  "display: inline-block;";
    buttonAttributes.classes = global.darkOutlineButtonClass + " positionRight";
    buttonAttributes.function = resetInteractionExampleInfo;
    buttonAttributes.parentId = "interactionExampleGroup";
    elements.createButton(buttonAttributes);

    const smallAttributes = global.createSmallAttributes();
    smallAttributes.id = "interactionExampleHelp";
    smallAttributes.style = "margin-bottom: 10px;";
    smallAttributes.content = "Here you can change the information of the interaction example.";
    smallAttributes.parentId = "interactionExampleGroup";
    elements.createSmall(smallAttributes);

    divAttributes = global.createDivAttributes();
    divAttributes.id = "collapseForminteractionExampleGroup";
    divAttributes.classes = "collapse collapseForm";
    divAttributes.parentId = "interactionExampleGroup";
    elements.createDiv(divAttributes);

    let labelAttributes = global.createLabelAttributes();
    labelAttributes.id = "titleLabelInteractionExample";
    labelAttributes.for = "titleInputInteractionExample";
    labelAttributes.style = "margin-left: 10px;margin-right: 10px;";
    labelAttributes.content = "Title:";
    labelAttributes.parentId = "collapseForminteractionExampleGroup";
    elements.createLabel(labelAttributes);

    let inputAttributes = global.createInputAttributes();
    inputAttributes.id = "titleInputInteractionExample";
    inputAttributes.type = "string";
    inputAttributes.value = global.settings.interactionExample.title!;
    inputAttributes.style = "margin-right: 20px;background-color:lightsteelblue;";
    inputAttributes.parentId = "collapseForminteractionExampleGroup";
    elements.createInput(inputAttributes);

    labelAttributes = global.createLabelAttributes();
    labelAttributes.id = "generalInfoLabelInteractionExample";
    labelAttributes.for = "generalInfoInputInteractionExample";
    labelAttributes.style = "display: block;margin-left: 10px;";
    labelAttributes.content = "General Information:";
    labelAttributes.parentId = "collapseForminteractionExampleGroup";
    elements.createLabel(labelAttributes);

    const textareaAttributes = global.createTextareaAttributes();
    textareaAttributes.id = "generalInfoInputInteractionExample";
    textareaAttributes.value = helpers.getInteractionExampleGeneralInfo();
    textareaAttributes.style = "display: block;width: 95%;margin-left: 10px;background-color:lightsteelblue;";
    textareaAttributes.parentId = "collapseForminteractionExampleGroup";
    elements.createTextarea(textareaAttributes, false);

    labelAttributes = global.createLabelAttributes();
    labelAttributes.id = "hintLabelInteractionExample";
    labelAttributes.for = "hintInputInteractionExample";
    labelAttributes.style = "display: block;margin-left: 10px;";
    labelAttributes.content = "Hint for the changes of the next visual:";
    labelAttributes.parentId = "collapseForminteractionExampleGroup";
    elements.createLabel(labelAttributes);

    inputAttributes = global.createInputAttributes();
    inputAttributes.id = "hintInputInteractionExample";
    inputAttributes.type = "string";
    inputAttributes.value = global.settings.interactionExample.nextVisualHint!;
    inputAttributes.style = "display: block;width: 95%;margin-left: 10px;background-color:lightsteelblue;";
    inputAttributes.parentId = "collapseForminteractionExampleGroup";
    elements.createInput(inputAttributes);

    labelAttributes = global.createLabelAttributes();
    labelAttributes.id = "interactionExampleVisualsInfoLabel";
    labelAttributes.for = "interactionExampleInfosTextarea";
    labelAttributes.style = "display: block;margin-left: 10px;";
    labelAttributes.content = "Interaction informations for all visuals:";
    labelAttributes.parentId = "collapseForminteractionExampleGroup";
    elements.createLabel(labelAttributes);

    global.allVisuals.forEach(function (visual: any) {
        const divAttributes = global.createDivAttributes();
        divAttributes.id = "interactionExample" + visual.name;
        divAttributes.style = "padding: 5px;border: 1px solid black;border-radius: 5px";
        divAttributes.content = helpers.getVisualTitle(visual);
        divAttributes.parentId = "collapseForminteractionExampleGroup";
        elements.createDiv(divAttributes);
        createInteractionExampleCollapseForm(visual);
    });
}

async function resetInteractionExampleInfo(){
    const titleInput = document.getElementById("titleInputInteractionExample") as HTMLInputElement | null;
    if(titleInput == null){
        return;
    }
    titleInput.value = "Interaction Example";
    global.settings.interactionExample.title = "Interaction Example";

    const generalInfosTextarea = document.getElementById("generalInfoInputInteractionExample") as HTMLTextAreaElement | null;
    const originalGeneralInfo = helpers.getGeneralInfoInteractionExampleText();
    if(generalInfosTextarea == null){
        return;
    }
    generalInfosTextarea.value = originalGeneralInfo;
    global.settings.interactionExample.generalInfoStatus = "original";
    global.settings.interactionExample.changedGeneralInfo = "";

    const nextHintInput = document.getElementById("hintInputInteractionExample") as HTMLInputElement | null;
    if(nextHintInput == null){
        return;
    }
    nextHintInput.value = "Can you see how this visual changed?";
    global.settings.interactionExample.nextVisualHint = "Can you see how this visual changed?";
  
    for (const visual of global.allVisuals) {
        const visualData = helpers.getDataOfInteractionVisual(visual)

        if(visualData && visualData.clickInfosStatus){
            const clickInfosTextarea = document.getElementById("interactionExampleInteractionInfosTextarea" + visual.name)as HTMLTextAreaElement | null;
            const clickInfo = await getInteractionText(visual);
            if(clickInfosTextarea == null || clickInfo == null){
                return;
            }
            clickInfosTextarea.value = clickInfo;
            visualData.clickInfosStatus = "original";
            visualData.changedClickInfo = "";
        }

        if(visualData && visualData.interactionChangedInfosStatus){
            const changedInfosTextarea = document.getElementById("interactionExampleChangedInfosTextarea" + visual.name)as HTMLTextAreaElement | null;
            const changedInfo = await helpers.getInteractionExampleChangesText(visual);
            if(changedInfosTextarea == null){
                return;
            }
            changedInfosTextarea.value = changedInfo;
            visualData.interactionChangedInfosStatus = "original";
            visualData.changedInteractionChangedInfo = "";
        }
    }
}

async function createInteractionExampleCollapseForm(visual: any){
    const visualData = helpers.getDataOfInteractionVisual(visual);

    helpers.createCollapseButton("collapseButtonInteractionExample" + visual.name, "interactionExample" + visual.name);

    const divAttributes = global.createDivAttributes();
    divAttributes.id = "collapseForminteractionExample" + visual.name;
    divAttributes.classes = "collapse collapseForm";
    divAttributes.style = "margin-top: 5px;padding: 10px;border: 1px solid black;border-radius: 5px;box-shadow: 5px 5px 5px gray,0px 5px 5px gray";
    divAttributes.parentId = "interactionExample" + visual.name;
    elements.createDiv(divAttributes);

    if(visualData && visualData.clickInfosStatus){
        const labelAttributes = global.createLabelAttributes();
        labelAttributes.id = "interactionExampleInteractionInfosLabel" + visual.name;
        labelAttributes.for = "interactionExampleInteractionInfosTextarea" + visual.name;
        labelAttributes.style = "display: block;margin-left: 10px;";
        labelAttributes.content = "Interaction information to click:";
        labelAttributes.parentId = "collapseForminteractionExample" + visual.name;
        elements.createLabel(labelAttributes);

        const interactionInfo = await helpers.getInteractionExampleInteractionInfo(visual, visualData);
        const textareaAttributes = global.createTextareaAttributes();
        textareaAttributes.id = "interactionExampleInteractionInfosTextarea" + visual.name;
        textareaAttributes.class = "interactionExampleInteractionInfos" + visual.name;
        textareaAttributes.value = interactionInfo!;
        textareaAttributes.style = "display: block;width: 95%;margin-bottom: 5px;margin-left: 10px;background-color: lightsteelblue;";
        textareaAttributes.parentId = "collapseForminteractionExample" + visual.name;
        elements.createTextarea(textareaAttributes, false);
    }

    if(visualData && visualData.interactionChangedInfosStatus){
        const labelAttributes = global.createLabelAttributes();
        labelAttributes.id = "interactionExampleChangedInfosLabel" + visual.name;
        labelAttributes.for = "interactionExampleChangedInfosTextarea" + visual.name;
        labelAttributes.style = "display: block;margin-left: 10px;";
        labelAttributes.content = "Changed interaction information:";
        labelAttributes.parentId = "collapseForminteractionExample" + visual.name;
        elements.createLabel(labelAttributes);

        const changedInfo = await helpers.getInteractionExampleChangedInfo(visual, visualData);
        const textareaAttributes = global.createTextareaAttributes();
        textareaAttributes.id = "interactionExampleChangedInfosTextarea" + visual.name;
        textareaAttributes.class = "interactionExampleChangedInfos" + visual.name;
        textareaAttributes.value = changedInfo!;
        textareaAttributes.style = "display: block;width: 95%;margin-bottom: 5px;margin-left: 10px;background-color: lightsteelblue;";
        textareaAttributes.parentId = "collapseForminteractionExample" + visual.name;
        elements.createTextarea(textareaAttributes, false);
    }
}
