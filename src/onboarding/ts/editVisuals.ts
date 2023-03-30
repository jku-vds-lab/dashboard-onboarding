import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
//import { createListOfVisuals } from "./listOfVisuals";

//export function createVisualsGroup(){
//    let divAttributes = global.createDivAttributes();
//     divAttributes.id = "visualsGroup";
//     divAttributes.style = "padding: 10px;border: 1px solid black;";
//     divAttributes.parentId = "editOnbording";
//     elements.createDiv(divAttributes);

//     const h2Attributes = global.createH2Attributes();
//     h2Attributes.id = "visualsLabel";
//     h2Attributes.style = "display: inline-block;margin-bottom: 0px;";
//     h2Attributes.content = "Visuals:";
//     h2Attributes.parentId = "visualsGroup";
//     elements.createH2(h2Attributes);

//     const buttonAttributes = global.createButtonAttributes();
//     buttonAttributes.id = "resetVisualsInfo";
//     buttonAttributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg> Reset`;
//     buttonAttributes.style =  "display: inline-block;";
//     buttonAttributes.classes = global.darkOutlineButtonClass + " positionRight";
//     buttonAttributes.function = resetVisualsInfo;
//     buttonAttributes.parentId = "visualsGroup";
//     elements.createButton(buttonAttributes);

//     const smallAttributes = global.createSmallAttributes();
//     smallAttributes.id = "visualsHelp";
//     smallAttributes.style = "margin-bottom: 10px;";
//     smallAttributes.content = "Here you can change the properies of the visuals. You can change the order of the visuals by moving the list elements up and down. It is possible to skip visuals in the onboarding and edit the content of the info bubbles.";
//     smallAttributes.parentId = "visualsGroup";
//     elements.createSmall(smallAttributes);

//     divAttributes = global.createDivAttributes();
//     divAttributes.id = "visualsList";
//     divAttributes.parentId = "visualsGroup";
//     elements.createDiv(divAttributes);

//     createListOfVisuals();
// } 

// async function resetVisualsInfo(){
//     elements.removeAllElementsOfClass("draggable");

//     global.allVisuals.forEach(async function (visual: { name: any; }) {
//         const visualData = helpers.getDataOfVisual(visual);
//         if(visualData == undefined){
//             return;
//         }

//         const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name)!; 
//         visualData.title = CGVisual.title.text;
//         visualData.disabled = false;

//         const visualInfos = await helpers.getVisualInfos(visual);

//         for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
//             if(i < visualInfos.generalInfos.length){
//                 visualData.generalInfosStatus[i] = "original";
//                 visualData.changedGeneralInfos[i] = "";
//             } else {
//                 visualData.generalInfosStatus.splice(i, 1);
//                 visualData.changedGeneralInfos.splice(i, 1);
//             }
//         }

//         for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
//             if(i < visualInfos.interactionInfos.length){
//                 visualData.interactionInfosStatus[i] = "original";
//                 visualData.changedInteractionInfos[i] = "";
//             } else {
//                 visualData.interactionInfosStatus.splice(i, 1);
//                 visualData.changedInteractionInfos.splice(i, 1);
//             }
//         }

//         for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
//             if(i < visualInfos.insightInfos.length){
//                 visualData.insightInfosStatus[i] = "original";
//                 visualData.changedInsightInfos[i] = "";
//             } else {
//                 visualData.insightInfosStatus.splice(i, 1);
//                 visualData.changedInsightInfos.splice(i, 1);
//             }
//         }

//     });

//     helpers.orderSettingsVisuals(global.allVisuals);

//     createListOfVisuals();
// }

// export function orderVisuals(){
//     const newOrderVisuals: any[] = [];
//     const draggables = document.getElementsByClassName("draggable");
//     [].forEach.call(draggables, function (draggable: any) {
//         const visual = global.allVisuals.find(function (visual: any) {
//             return visual.name == draggable.id;
//         });
//         const visualData = global.settings.traversal.find(function (visualData: global.SettingsVisual) {
//             return visualData.id == visual.name;
//         });
//         if(visualData && !visualData.disabled){
//          newOrderVisuals.push(visual);
//         }
//     })
//     global.setVisuals(newOrderVisuals);

//     const allVisuals = [...global.allVisuals];
//     allVisuals.sort(function(a, b){ 
//         return global.currentVisuals.indexOf(a) - global.currentVisuals.indexOf(b);
//     });
    
//     helpers.orderSettingsVisuals(allVisuals)
// }