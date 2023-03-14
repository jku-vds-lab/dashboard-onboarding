import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { disableAll } from "./disableArea";
import { getInteractionText } from "./interactionExample";
import { createVisualsGroup, orderVisuals } from "./editVisuals";
import { createFiltersGroup } from "./editFilters";
import { createInteractionExampleGroup } from "./editInteractionExample";
import { createReportOffsetGroup } from "./editReportOffset";
import { replacer } from "../../componentGraph/ComponentGraph";

export function createOnboardingEditing(){
    helpers.removeOnboarding();
    helpers.createOnboarding();

    disableAll();

    const style = helpers.getCardStyle(global.editCardMargin, 0, global.editCardWidth, "") + `right:0;margin:auto;`;
    helpers.createCard("editCard", style, "");

    helpers.createCardContent("Edit Onboarding", "", "editCard");
    createEditForm();

    helpers.createCardButtons("cancel", "save");
}

async function createEditForm(){
    const divAttributes = global.createDivAttributes();
    divAttributes.id = "editOnbording";
    divAttributes.style = "margin: 10px;box-shadow: 5px 5px 5px gray,0px 5px 5px gray";
    divAttributes.parentId = "contentText";
    elements.createDiv(divAttributes);

    createVisualsGroup();
    createFiltersGroup();
    createInteractionExampleGroup();
    createReportOffsetGroup();
}

export async function saveOnboardingChanges(){
    global.settings.reportOffset.top = helpers.saveIntInput("topOffsetInput");
    global.settings.reportOffset.bottom = helpers.saveIntInput("bottomOffsetInput");
    global.settings.reportOffset.left = helpers.saveIntInput("leftOffsetInput");
    global.settings.reportOffset.right = helpers.saveIntInput("rightOffsetInput");

    global.setContainerPaddingTop(global.report.iframe.offsetTop + global.settings.reportOffset.top);
    global.setContainerPaddingLeft(global.report.iframe.offsetLeft + global.settings.reportOffset.left);

    orderVisuals();

    for (const visual of global.allVisuals) {
        const visualData = helpers.getDataOfVisual(visual);
        if(!visualData){
            return;
        }

        const titleInput = document.getElementById("titleInput" + visual.name) as HTMLInputElement | null;
        visualData.title = titleInput?.value;

        const visualInfos = await helpers.getVisualInfos(visual);

        const generalInfosTextareas = document.getElementsByClassName("generalInfos" + visual.name);
        for (let i = 0; i < generalInfosTextareas.length; ++i) {
            const textarea = generalInfosTextareas[i] as HTMLTextAreaElement | null;
            const newGeneralInfo = textarea?.value.replaceAll('\n', "<br>");
            if(newGeneralInfo == "" || newGeneralInfo == null){
                visualData.generalInfosStatus[i] = "deleted";
                visualData.changedGeneralInfos[i] = "";
            } else if(i >= visualData.generalInfosStatus.length){
                visualData.generalInfosStatus.push("added");
                visualData.changedGeneralInfos.push(newGeneralInfo);  
            } else if(newGeneralInfo == visualInfos.generalInfos[i]){
                visualData.generalInfosStatus[i] = "original";
                visualData.changedGeneralInfos[i] = "";
            } else {
                visualData.generalInfosStatus[i] = "changed";
                visualData.changedGeneralInfos[i] = newGeneralInfo;
            }
        }

        const interactionInfosTextareas = document.getElementsByClassName("interactionInfos" + visual.name);
        for (let i = 0; i < interactionInfosTextareas.length; ++i) {
            const textarea = interactionInfosTextareas[i] as HTMLTextAreaElement | null;
            const newInteractionInfo = textarea?.value.replaceAll('\n', "<br>");
            if(newInteractionInfo == "" || newInteractionInfo == null){
                visualData.interactionInfosStatus[i] = "deleted";
                visualData.changedInteractionInfos[i] = "";
            } else if(i >= visualData.interactionInfosStatus.length){
                visualData.interactionInfosStatus.push("added");
                visualData.changedInteractionInfos.push(newInteractionInfo);
            } else if(newInteractionInfo == visualInfos.interactionInfos[i]){
                visualData.interactionInfosStatus[i] = "original";
                visualData.changedInteractionInfos[i] = "";
            } else {
                visualData.interactionInfosStatus[i] = "changed";
                visualData.changedInteractionInfos[i] = newInteractionInfo;
            }
        }

        const insightInfosTextareas = document.getElementsByClassName("insightInfos" + visual.name);
        for (let i = 0; i < insightInfosTextareas.length; ++i) {
            const textarea = insightInfosTextareas[i] as HTMLTextAreaElement | null;
            const newInsightInfo = textarea?.value.replaceAll('\n', "<br>"); 
            if(newInsightInfo == ""  || newInsightInfo == null){
                visualData.insightInfosStatus[i] = "deleted";
                visualData.changedInsightInfos[i] = "";
            } else if(i >= visualData.insightInfosStatus.length){
                visualData.insightInfosStatus.push("added");
                visualData.changedInsightInfos.push(newInsightInfo);
            } else if(newInsightInfo == visualInfos.insightInfos[i]){
                visualData.insightInfosStatus[i] = "original";
                visualData.changedInsightInfos[i] = "";
            } else {
                visualData.insightInfosStatus[i] = "changed";
                visualData.changedInsightInfos[i] = newInsightInfo;
            }
        }
    }

    const filterInfos = await helpers.getFilterInfo();

    const filterTitleInput = document.getElementById("titleInputFilter") as HTMLInputElement | null;
    global.settings.filterVisual.title = filterTitleInput?.value;

    const filterGeneralInfoInput = document.getElementById("generalInfoInputFilter") as HTMLInputElement | null;
    global.settings.filterVisual.generalInformation = filterGeneralInfoInput?.value;

    const filterInfosTextareas = document.getElementsByClassName("filterInfos");
    for (let i = 0; i < filterInfosTextareas.length; ++i) {
        const textarea = filterInfosTextareas[i] as HTMLTextAreaElement | null;
        const newFilterInfo = textarea?.value.replaceAll('\n', "<br>");
        if(newFilterInfo == "" || newFilterInfo == null){
            global.settings.filterVisual.filterInfosStatus[i] = "deleted";
            global. settings.filterVisual.changedFilterInfos[i] = "";
        } else if(i >=  global.settings.filterVisual.filterInfosStatus.length){
            global.settings.filterVisual.filterInfosStatus.push("added");
            global.settings.filterVisual.changedFilterInfos.push(newFilterInfo);
        } else if(newFilterInfo == filterInfos[i]){
            global.settings.filterVisual.filterInfosStatus[i] = "original";
            global.settings.filterVisual.changedFilterInfos[i] = "";
        } else {
            global.settings.filterVisual.filterInfosStatus[i] = "changed";
            global.settings.filterVisual.changedFilterInfos[i] = newFilterInfo;
        }
    }
    
    const interactionExampleTitleInput = document.getElementById("titleInputInteractionExample") as HTMLInputElement | null;
    global.settings.interactionExample.title = interactionExampleTitleInput?.value;

    const generalInfosTextarea = document.getElementById("generalInfoInputInteractionExample") as HTMLTextAreaElement | null;
    const newGeneralInfo = generalInfosTextarea?.value.replaceAll('\n', "<br>");
    const compareNewGeneralInfo = newGeneralInfo?.replaceAll(/\s+/g, "");
    const originalGeneralInfo = helpers.getGeneralInfoInteractionExampleText().replaceAll('\n', "<br>").replaceAll(/\s+/g, "");
    if(newGeneralInfo == "" || newGeneralInfo == null){
        global.settings.interactionExample.generalInfoStatus = "deleted";
        global.settings.interactionExample.changedGeneralInfo = ""; 
    } else if( originalGeneralInfo == compareNewGeneralInfo){
        global.settings.interactionExample.generalInfoStatus = "original";
        global.settings.interactionExample.changedGeneralInfo = "";
    } else {
        global.settings.interactionExample.generalInfoStatus = "changed";
        global.settings.interactionExample.changedGeneralInfo = newGeneralInfo;
    }

    const hintInput = document.getElementById("hintInputInteractionExample") as HTMLInputElement | null;
    global.settings.interactionExample.nextVisualHint = hintInput?.value;
  
    for (const visual of global.allVisuals) {
        const visualData = helpers.getDataOfInteractionVisual(visual);
        if(!visualData){
            return;
        }

        if(visualData.clickInfosStatus){
            const clickInfosTextarea = document.getElementById("interactionExampleInteractionInfosTextarea" + visual.name)as HTMLTextAreaElement | null;
            const newClickInfo = clickInfosTextarea?.value.replaceAll('\n', "<br>");
            const clickInfo = await getInteractionText(visual);
            if(newClickInfo == "" || newClickInfo == null){
                visualData.clickInfosStatus = "deleted";
                visualData.changedClickInfo = ""; 
            } else if(newClickInfo == clickInfo){
                visualData.clickInfosStatus = "original";
                visualData.changedClickInfo = "";
            } else {
                visualData.clickInfosStatus = "changed";
                visualData.changedClickInfo = newClickInfo;
            }
        }

        if(visualData.interactionChangedInfosStatus){
            const changedInfosTextarea = document.getElementById("interactionExampleChangedInfosTextarea" + visual.name)as HTMLTextAreaElement | null;
            const newChangedInfo = changedInfosTextarea?.value.replaceAll('\n', "<br>");
            const changedInfo = await helpers.getInteractionExampleChangesText(visual);
            if(newChangedInfo == "" || newChangedInfo == null){
                visualData.interactionChangedInfosStatus = "deleted";
                visualData.changedInteractionChangedInfo = ""; 
            } else if(newChangedInfo == changedInfo){
                visualData.interactionChangedInfosStatus = "original";
                visualData.changedInteractionChangedInfo = "";
            } else {
                visualData.interactionChangedInfosStatus = "changed";
                visualData.changedInteractionChangedInfo = newChangedInfo;
            }
        }
    }

    localStorage.setItem('settings', JSON.stringify(global.settings, replacer));

    helpers.removeOnboarding();
}