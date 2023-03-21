import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { mouseDownHandler } from "./draggableList";

// export function createListOfVisuals(){
//     global.settings.visuals.forEach(function (visual) {
//         const divAttributes = global.createDivAttributes();
//         divAttributes.id = visual.id;
//         divAttributes.classes = "draggable";
//         divAttributes.style = "padding: 5px;border: 1px solid black;border-radius: 5px";
//         divAttributes.content =`<p style="display: inline-block;width:300px;margin-bottom: -5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><svg style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-list mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg> ` 
//         + visual.title + `</p>`;
//         divAttributes.eventType = 'mousedown';
//         divAttributes.eventFunction = mouseDownHandler;
//         divAttributes.parentId = "visualsList";
//         elements.createDiv(divAttributes);
//         createToogleVisabilityButton(visual.id);
//         createCollapseForm(visual.id);
//     });
// }

function createToogleVisabilityButton(visualID: any){
    const visualData = helpers.getDataWithId(visualID);

    if(visualData && visualData.disabled){
        helpers.createDisableButton(visualID);
    }else{
        helpers.createEnableButton(visualID);
    }
}

export function toggleVisability(listElement: { querySelector: (arg0: string) => any; id: any; }){
    const disableElement = listElement.querySelector(".disableVisualButton");
    const visualData = helpers.getDataWithId(listElement.id);

    if(visualData && visualData.disabled){
        disableElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash mb-2" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/></svg>`;
        visualData.disabled = false;
    }else if(visualData){
        disableElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye mb-2" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>`;
        visualData.disabled = true;
    }
}

async function createCollapseForm(visualID: string){
    const visualData = helpers.getDataWithId(visualID);
    if(!visualData){
        return;
    }
    const visualInfos = await getVisualInfos(visualData);

    helpers.createCollapseButton("collapseButton" + visualID, visualID);

    const divAttributes = global.createDivAttributes();
    divAttributes.id = "collapseForm" + visualID;
    divAttributes.classes = "collapse collapseForm";
    divAttributes.style = "margin-top: 5px;padding: 10px;border: 1px solid black;border-radius: 5px;box-shadow: 5px 5px 5px gray,0px 5px 5px gray";
    divAttributes.parentId = visualID;
    elements.createDiv(divAttributes);

    helpers.createTitleForm(visualID, visualData.title!);

    helpers.createInfoForm("general", visualID, visualInfos.generalInfos);
    helpers.createInfoForm("interaction", visualID, visualInfos.interactionInfos);
    helpers.createInfoForm("insight", visualID, visualInfos.insightInfos);
}

export async function getVisualInfos(visualData: global.SettingsVisual){
    const visual = global.allVisuals.find(function (visual) {
        return visual.name == visualData.id;
    });

    const visualInfos = await helpers.getVisualInfos(visual);

    const generalInfos = [];
    const interactionInfos = [];
    const insightInfos = [];

    for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
       switch(visualData.generalInfosStatus[i]){
            case global.infoStatus.original:
                generalInfos.push(visualInfos.generalInfos[i]);
                break;
            case global.infoStatus.changed:
            case global.infoStatus.added:
                generalInfos.push(visualData.changedGeneralInfos[i]);
                break;
            default:
                break;
       }
    }

     for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
        switch(visualData.interactionInfosStatus[i]){
             case global.infoStatus.original:
                interactionInfos.push(visualInfos.interactionInfos[i]);
                 break;
             case global.infoStatus.changed:
             case global.infoStatus.added:
                interactionInfos.push(visualData.changedInteractionInfos[i]);
                 break;
             default:
                 break;
        }
     }

     for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
        switch(visualData.insightInfosStatus[i]){
             case global.infoStatus.original:
                insightInfos.push(visualInfos.insightInfos[i]);
                 break;
             case global.infoStatus.changed:
             case global.infoStatus.added:
                insightInfos.push(visualData.changedInsightInfos[i]);
                 break;
             default:
                 break;
        }
     }

    return {generalInfos, interactionInfos, insightInfos};
}

export function addVisualTextarea(category: any, visualID: string){
    const textareaAttributes = global.createTextareaAttributes();
    switch(category){
        case "general":
            textareaAttributes.class = "generalInfos" + visualID;
            textareaAttributes.parentId = "addGeneralInfo" + visualID;
            break;
        case "insight":
            textareaAttributes.class = "insightInfos" + visualID;
            textareaAttributes.parentId = "addInsightInfo" + visualID;
            break;
        case "interaction":
            textareaAttributes.class = "interactionInfos" + visualID;
            textareaAttributes.parentId = "addInteractionInfo" + visualID;
            break;
        default:
            break;
    }
    textareaAttributes.style = "display: block;width: 95%;margin-bottom: 5px;margin-left: 10px;background-color: lightsteelblue;";
    elements.createTextarea(textareaAttributes, true);
}