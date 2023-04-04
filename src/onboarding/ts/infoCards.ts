import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import * as disable from "./disableArea";
import { createIntroCard } from "./introCards";
import { createFilterInfoCard, removeFilterInfoCard } from "./filterInfoCards";
import { createVisualInfo } from "./visualInfo";
import { createDashboardInfoCard, getNewDashboardInfo, removeDashboardInfoCard } from "./dashboardInfoCard";
import { createGroupOverlay, createInformationCard, createLookedAtIds, currentId, getCurrentTraversalElementType, groupType, isGroup, lookedAtInGroup, setCurrentId, setTraversalInGroupIndex, setVisualInGroupIndex, TraversalElement, traversalInGroupIndex, traversalStrategy, updateLookedAt, visualInGroupIndex } from "./traversal";
import { textSize } from "./sizes";

export async function createInfoCard(visual: any, count: number, categories: string[]){
    disable.disableFrame();
    disable.createDisabledArea(visual);

    const position = helpers.getVisualCardPos(visual, global.infoCardWidth, global.infoCardMargin);

    const style = helpers.getCardStyle(position.y, position.x, global.infoCardWidth, "");
    if(position.pos === "left"){
        helpers.createCard("infoCard", style, "rectLeftBig");
        helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "infoCard");
    }else{
        helpers.createCard("infoCard", style, "rectRightBig");
        helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "infoCard");
    }

    const visualData = helpers.getDataOfVisual(visual, count);
    helpers.createCardContent(visualData?.title, "", "infoCard");
    createInfoCardButtons(visual.name, categories, count);
    await createVisualInfo(visual, count, categories);
}

export function createInfoCardButtons(id: string, categories: string[], count: number){
    if(currentId === 0 && global.isGuidedTour){
        createCardButtonsWithGroup(id, categories, count, "", "next");
    } else if(currentId === global.settings.traversalStrategy.length-1 && global.isGuidedTour){
        createCardButtonsWithGroup(id, categories, count, "previous", "close");
    } else {
        createCardButtonsWithGroup(id, categories, count, "previous", "next");
    }
}

export function createCardButtonsWithGroup(id: string, categories: string[], count: number, leftButton: string, rightButton: string){
    const traversalElem = global.settings.traversalStrategy[currentId].element;
    if(isGroup(traversalElem)){
        let index = 0;
        let travLength = 0;
        for(let i=0; i < traversalElem.visuals.length; i++){   
            const elemInGroup = traversalElem.visuals[i].find((visInGroup: TraversalElement) => visInGroup.element.id === id && visInGroup.categories.every(category => categories.includes(category)) && visInGroup.count === count);
            if(elemInGroup){
                index = traversalElem.visuals[i].indexOf(elemInGroup!);
                travLength = traversalElem.visuals[i].length -1;
                setVisualInGroupIndex(index);
                setTraversalInGroupIndex(i);
            }
        }

        if(index === 0){
            if(global.explorationMode){
                helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
                helpers.createCardButtons("groupButtons", "back to group", "", "nextInGroup");
            } else {
                helpers.createCardButtons("cardButtons", "", "", "nextInGroup");
            }
        } else if(index === travLength){
            if(global.explorationMode){
                helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
                helpers.createCardButtons("groupButtons", "previousInGroup", "", "back to group");
            } else {
                switch(traversalElem.type){
                    case groupType.all:
                        let traversed = 0;
                        for(const trav of traversalElem.visuals){ 
                            if(trav.every((vis: TraversalElement) => lookedAtInGroup.elements.find(elem => elem.id === vis.element.id && elem.categories.every(category => vis.categories.includes(category)) && elem.count === vis.count))){
                                traversed ++;
                            }
                        }
                        if(traversed === traversalElem.visuals.length){
                            helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
                            helpers.createCardButtons("groupButtons", "", "previousInGroup", "");
                        } else {
                            helpers.createCardButtons("groupButtons", "previousInGroup", "", "back to group");
                        }
                        break;
                    case groupType.atLeastOne:
                        helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
                        helpers.createCardButtons("groupButtons", "previousInGroup", "", "back to group");
                        break;
                    case groupType.onlyOne:
                        helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
                        helpers.createCardButtons("groupButtons", "", "previousInGroup", "");
                        break;
                }
            }
        } else {
            if(global.explorationMode){
                helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
                helpers.createCardButtons("groupButtons", "previousInGroup", "back to group", "nextInGroup");
            } else {
                helpers.createCardButtons("groupButtons", "previousInGroup", "", "nextInGroup");
            }
        }
    } else {
        helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
    }
}

export function removeInfoCard(){
    elements.removeElement("infoCard");
    elements.removeElement("disabledUpper");
    elements.removeElement("disabledLower");
    elements.removeElement("disabledRight");
    elements.removeElement("disabledLeft");
    disable.removeFrame();
}

export function nextInfoCard(){
    if(currentId == global.settings.traversalStrategy.length-1){
        setCurrentId(0);
    } else {
        setCurrentId(currentId + 1);
    } 

    lookedAtInGroup.groupId = "";
    lookedAtInGroup.elements = [];

    getCurrentTraversalElementType();
    
    // if(global.showsDashboardInfo){
    //     global.setCurrentVisualIndex(0);
    //     removeDashboardInfoCard();
    //     createInfoCard(global.currentVisuals[global.currentVisualIndex]);
    // } else if(global.currentVisualIndex == global.currentVisuals.length -1) {
    //     global.setCurrentVisualIndex(global.currentVisualIndex + 1);
    //     removeInfoCard();
    //     createFilterInfoCard();
    // } else{
    //     removeFilterInfoCard();
    //     removeInfoCard();
    //     if(!global.isGuidedTour && global.currentVisualIndex == global.currentVisuals.length){
    //         createDashboardInfoCard();
    //     }else{
    //         global.setCurrentVisualIndex(global.currentVisualIndex + 1);
    //         createInfoCard(global.currentVisuals[global.currentVisualIndex]);
    //     }
    // }
}

export function previousInfoCard(){
    if(currentId == 0){
        setCurrentId(global.settings.traversalStrategy.length-1);
    } else {
        setCurrentId(currentId - 1);
    } 

    lookedAtInGroup.groupId = "";
    lookedAtInGroup.elements = [];

    getCurrentTraversalElementType();

    // if(global.showsDashboardInfo){
    //     if(global.isGuidedTour){
    //         removeDashboardInfoCard();
    //         createIntroCard();
    //     } else {
    //         global.setCurrentVisualIndex(global.currentVisuals.length);
    //         removeDashboardInfoCard();
    //         createFilterInfoCard();
    //     }
    // } else if(global.currentVisualIndex == 0){
    //     removeInfoCard();
    //     createDashboardInfoCard();
    // }else{
    //     removeFilterInfoCard();
    //     if(global.isGuidedTour && global.currentVisualIndex == global.currentVisuals.length){
    //         disable.disableFilter();
    //     }
    //     global.setCurrentVisualIndex(global.currentVisualIndex - 1);
    //     removeInfoCard();
    //     createInfoCard(global.currentVisuals[global.currentVisualIndex]);
    // }   
}

export function nextInGroup(){
    const currentElement = global.settings.traversalStrategy[currentId].element;

    setVisualInGroupIndex(visualInGroupIndex + 1);

    const traversal = currentElement.visuals[traversalInGroupIndex];
    const visual = traversal[visualInGroupIndex];

    const lookedAt = createLookedAtIds(visual.element.id, visual.categories, visual.count);
    updateLookedAt(lookedAt);

    if(currentElement.id === "dashboard"){
        createInformationCard("dashboard", visual.count);
    } else if(currentElement.id === "globalFilter"){
        createInformationCard("globalFilter", visual.count);
    } else {
        createInformationCard("visual", visual.count, undefined, visual.element.id, visual.categories);
    }
}

export function previousInGroup(){
    const currentElement = global.settings.traversalStrategy[currentId].element;

    setVisualInGroupIndex(visualInGroupIndex - 1);

    const traversal = currentElement.visuals[traversalInGroupIndex];
    const visual = traversal[visualInGroupIndex];

    const lookedAt = createLookedAtIds(visual.element.id, visual.categories, visual.count);
    updateLookedAt(lookedAt);

    if(currentElement.id === "dashboard"){
        createInformationCard("dashboard", visual.count);
    } else if(currentElement.id === "globalFilter"){
        createInformationCard("globalFilter", visual.count);
    } else {
        createInformationCard("visual", visual.count, undefined, visual.element.id, visual.categories);
    }
}

export async function getVisualInfo(idParts: string[], count: number){
    const info = [];
    const visualData = helpers.getDataWithId(idParts[0], count);
    if (!visualData) {
      return;
    }
    const visual = global.allVisuals.find(function (visual) {
        return visual.name == visualData.id;
    });
    const visualInfos = await helpers.getVisualInfos(visual);

    if(idParts.length > 1 && idParts[1] == "Insight"){
      for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
        switch(visualData.insightInfosStatus[i]){
             case global.infoStatus.original:
                 info.push(visualInfos.insightInfos[i]);
                 break;
             case global.infoStatus.changed:
             case global.infoStatus.added:
                 info.push(visualData.changedInsightInfos[i]);
                 break;
             default:
                 break;
        }
      }
    } else if(idParts.length > 1 && idParts[1] == "Interaction"){
      for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
        switch(visualData.interactionInfosStatus[i]){
             case global.infoStatus.original:
                 info.push(visualInfos.interactionInfos[i]);
                 break;
             case global.infoStatus.changed:
             case global.infoStatus.added:
                 info.push(visualData.changedInteractionInfos[i]);
                 break;
             default:
                 break;
        }
      }
    } else {
      for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
        switch(visualData.generalInfosStatus[i]){
             case global.infoStatus.original:
                 info.push(visualInfos.generalInfos[i]);
                 break;
             case global.infoStatus.changed:
             case global.infoStatus.added:
                 info.push(visualData.changedGeneralInfos[i]);
                 break;
             default:
                 break;
        }
      }
    }
    return info;
}

export async function saveVisualChanges(newInfo: string[], idParts: string[], count: number){
    const visualData = helpers.getDataWithId(idParts[0], count);
    if (!visualData) {
      return;
    }
    
    const originalInfo = await getOriginalVisualInfos(idParts);
    if(!originalInfo){
        return;
    }

    if(idParts.length > 1 && idParts[1] == "Insight"){
        for (let i = 0; i < newInfo.length; ++i) {
            if(newInfo.length == 0 || newInfo == null){
                visualData.insightInfosStatus[0] = "deleted";
                visualData.changedInsightInfos[0] = "";
                return;
            } else if(i >= originalInfo.length){
                visualData.insightInfosStatus.push("added");
                visualData.changedInsightInfos.push(newInfo[i]);  
            } else if(newInfo[i] == originalInfo[i]){
                visualData.insightInfosStatus[i] = "original";
                visualData.changedInsightInfos[i] = "";
            } else {
                visualData.insightInfosStatus[i] = "changed";
                visualData.changedInsightInfos[i] = newInfo[i];
            }
        }

        if(newInfo.length < visualData.insightInfosStatus.length){
            for (let i = newInfo.length; i < visualData.insightInfosStatus.length; ++i) {
                visualData.insightInfosStatus[i] = "deleted";
                visualData.changedInsightInfos[i] = "";
            }
        }
    } else if(idParts.length > 1 && idParts[1] == "Interaction"){
        for (let i = 0; i < newInfo.length; ++i) {
            if(newInfo.length == 0 || newInfo == null){
                visualData.interactionInfosStatus[0] = "deleted";
                visualData.changedInteractionInfos[0] = "";
                return;
            } else if(i >= originalInfo.length){
                visualData.interactionInfosStatus.push("added");
                visualData.changedInteractionInfos.push(newInfo[i]);  
            } else if(newInfo[i] == originalInfo[i]){
                visualData.interactionInfosStatus[i] = "original";
                visualData.changedInteractionInfos[i] = "";
            } else {
                visualData.interactionInfosStatus[i] = "changed";
                visualData.changedInteractionInfos[i] = newInfo[i];
            }
        }

        if(newInfo.length < visualData.interactionInfosStatus.length){
            for (let i = newInfo.length; i < visualData.interactionInfosStatus.length; ++i) {
                visualData.interactionInfosStatus[i] = "deleted";
                visualData.changedInteractionInfos[i] = "";
            }
        }
    } else {

        for (let i = 0; i < newInfo.length; ++i) {
            if(newInfo.length == 0 || newInfo == null){
                visualData.generalInfosStatus[0] = "deleted";
                visualData.changedGeneralInfos[0] = "";
                return;
            } else if(i >= originalInfo.length){
                visualData.generalInfosStatus.push("added");
                visualData.changedGeneralInfos.push(newInfo[i]);  
            } else if(newInfo[i] == originalInfo[i]){
                visualData.generalInfosStatus[i] = "original";
                visualData.changedGeneralInfos[i] = "";
            } else {
                visualData.generalInfosStatus[i] = "changed";
                visualData.changedGeneralInfos[i] = newInfo[i];
            }
        }

        if(newInfo.length < visualData.generalInfosStatus.length){
            for (let i = newInfo.length; i <visualData.generalInfosStatus.length; ++i) {
                visualData.generalInfosStatus[i] = "deleted";
                visualData.changedGeneralInfos[i] = "";
            }
        }
    }
}

async function getOriginalVisualInfos(idParts: string[]){
    let info;
    const visual = global.currentVisuals.find(vis => vis.name === idParts[0]);
    const visualInfos = await helpers.getVisualInfos(visual);

    if(idParts.length > 1 && idParts[1] == "Insight"){
        info = visualInfos.insightInfos;
    } else if(idParts.length > 1 && idParts[1] == "Interaction"){
        info = visualInfos.interactionInfos;
    } else {
        info = visualInfos.generalInfos;
    }
    return info;
  }

export async function resetVisualChanges(idParts: string[],count: number){
    const visualData = helpers.getDataWithId(idParts[0], count);
    if (!visualData) {
      return;
    }
    const originalInfo = await getOriginalVisualInfos(idParts);
    if(!originalInfo){
        return;
    }

    if(idParts.length > 1 && idParts[1] == "Insight"){
        for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
            if(i < originalInfo.length){        
                visualData.insightInfosStatus[i] = "original";
                visualData.changedInsightInfos[i] = "";
            } else {
                visualData.insightInfosStatus.splice(i, 1);
                visualData.changedInsightInfos.splice(i, 1);
            }
        }
    } else if(idParts.length > 1 && idParts[1] == "Interaction"){
        for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
            if(i < originalInfo.length){        
                visualData.interactionInfosStatus[i] = "original";
                visualData.changedInteractionInfos[i] = "";
            } else {
                visualData.interactionInfosStatus.splice(i, 1);
                visualData.changedInteractionInfos.splice(i, 1);
            }
        }
    } else {
        for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
            if(i < originalInfo.length){        
                visualData.generalInfosStatus[i] = "original";
                visualData.changedGeneralInfos[i] = "";
            } else {
                visualData.generalInfosStatus.splice(i, 1);
                visualData.changedGeneralInfos.splice(i, 1);
            }
        }
    }
}