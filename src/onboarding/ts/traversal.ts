import { createDashboardInfoCard, removeDashboardInfoCard } from "./dashboardInfoCard";
import { removeFrame } from "./disableArea";
import { removeElement } from "./elements";
import { createFilterInfoCard, removeFilterInfoCard } from "./filterInfoCards";
import { currentVisuals } from "./globalVariables";
import { removeOnboardingOverlay } from "./helperFunctions";
import { createInfoCard, removeInfoCard } from "./infoCards";
import { removeIntroCard } from "./introCards";
import { createOverlayForVisuals } from "./onboarding";
import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";

export const traversialStrategy: any[] = [];
export const lookedAtInGroup = createLookedAtInGroup();
export let currentId=0;

export interface Group{
    id: string;
    type: groupType;
    visuals: any[];
}

export interface LookedAtInGroup{
    groupId: string;
    elements: string[];
}

export function isGroup(object: any): object is Group {
    return object.type && Object.values(groupType).includes(object.type);
}

export enum groupType {
    all = "all",
    atLeastOne = "atLeastOne",
    onlyOne = "onlyOne"
}

export function createGroup(){
    const group: Group = {
        id: "group",
        type: groupType.all,
        visuals: []
    }
    return group;
}

export function createLookedAtInGroup(){
    const lookedAtInGroup: LookedAtInGroup = {
        groupId: "",
        elements: []
    }
    return lookedAtInGroup;
}

export function setCurrentId(newId: number){
    currentId = newId;
}

export function setBasicTraversalStrategy(){
    traversialStrategy.push("dashboard");
    for(const vis of currentVisuals){
        traversialStrategy.push(vis.name);
    }
    traversialStrategy.push("globalFilter");
}

export function setTestAllGroupsTraversalStrategy(){
    traversialStrategy.push("dashboard");
    traversialStrategy.push(currentVisuals[0].name);
    traversialStrategy.push(currentVisuals[1].name);
    const group = createGroup();
    group.visuals.push(currentVisuals[2].name);
    group.visuals.push(currentVisuals[3].name);
    group.visuals.push(currentVisuals[4].name);
    traversialStrategy.push(group);
    traversialStrategy.push(currentVisuals[5].name);
    traversialStrategy.push(currentVisuals[6].name);
    traversialStrategy.push("globalFilter");
}

export function setTestAtLeastOneGroupsTraversalStrategy(){
    traversialStrategy.push("dashboard");
    traversialStrategy.push(currentVisuals[0].name);
    traversialStrategy.push(currentVisuals[1].name);
    const group = createGroup();
    group.type = groupType.atLeastOne;
    group.visuals.push(currentVisuals[2].name);
    group.visuals.push(currentVisuals[3].name);
    group.visuals.push(currentVisuals[4].name);
    traversialStrategy.push(group);
    traversialStrategy.push(currentVisuals[5].name);
    traversialStrategy.push(currentVisuals[6].name);
    traversialStrategy.push("globalFilter");
}

export function setTestOnlyOneGroupsTraversalStrategy(){
    traversialStrategy.push("dashboard");
    traversialStrategy.push(currentVisuals[0].name);
    traversialStrategy.push(currentVisuals[1].name);
    const group = createGroup();
    group.type = groupType.onlyOne;
    group.visuals.push(currentVisuals[2].name);
    group.visuals.push(currentVisuals[3].name);
    group.visuals.push(currentVisuals[4].name);
    traversialStrategy.push(group);
    traversialStrategy.push(currentVisuals[5].name);
    traversialStrategy.push(currentVisuals[6].name);
    traversialStrategy.push("globalFilter");
}

export function createInformationCard(type: string, visuals?: any[], visualId?:string){
    removeFrame();
    removeIntroCard();
    removeInfoCard();
    removeDashboardInfoCard();
    removeFilterInfoCard();
    removeOnboardingOverlay();

    switch(type){
        case "dashboard":
            createDashboardInfoCard();
            break;
        case "globalFilter":
            createFilterInfoCard();
            break;
        case "group":
            createExplainGroupCard();
            createOverlayForVisuals(visuals!);
            break;
        case "visual":
            createInfoCard(currentVisuals.find(vis => vis.name === visualId));
            break;
    }
}

export function getCurrentTraversalElementType(){
    const currentElement = traversialStrategy[currentId];

    if(isGroup(currentElement)){
        createInformationCard("group", currentElement.visuals, undefined);
    } else if(currentElement === "dashboard"){
        createInformationCard("dashboard");
    } else if(currentElement === "globalFilter"){
        createInformationCard("globalFilter");
    } else {
        createInformationCard("visual", undefined, currentElement);
    }
}

export function createGroupOverlay(){
    const currentElement = traversialStrategy[currentId];
    createInformationCard("group", currentElement.visuals, undefined);
}


export function findVisualIndexInTraversal(id: string){
    let index = traversialStrategy.indexOf(id);
    if(index  == -1){
       const groups =  traversialStrategy.filter(object => isGroup(object));
       for(const group of groups){
            const indexInGroup = group.visuals.indexOf(id);
            if(indexInGroup != -1){
                index = traversialStrategy.indexOf(group);
                return index;
            }
       }
       index = 0;
    }
    return index;
}

export function findTraversalVisual(id:string){
    if(!isGroup(id) && id !== "dashboard" && id !== "globalFilter"){
        return currentVisuals.find((vis: any) => vis.name === id);
    }

    return null;
}

export function findCurrentTraversalVisual(){
    const traversalElem = traversialStrategy[currentId];
    
    if(!isGroup(traversalElem) && traversalElem !== "dashboard" && traversalElem !== "globalFilter"){
        return currentVisuals.find((vis: any) => vis.name === traversalElem);
    }

    return null;
}

export function findCurrentTraversalVisualIndex(){
    const traversalElem = traversialStrategy[currentId];
    
    if(!isGroup(traversalElem) && traversalElem !== "dashboard" && traversalElem !== "globalFilter"){
        return currentVisuals.findIndex((vis: any) => vis.name === traversalElem);
    }

    return 0;
}

export function removeExplainGroupCard(){
    removeElement("explainGroupCard");
}

export function createExplainGroupCard(){
    const style = `overflow: auto;position:fixed;top:10px;left:50%;margin-left:` + -(global.explainGroupCardWidth/2) + `px;width:`+ global.explainGroupCardWidth + `px;height:` + global.explainGroupCardHeight + `px;pointer-events:auto;border-radius:10px;background-color:lightsteelblue;z-index: 99 !important;`;
    helpers.createCard("explainGroupCard", style, "");
    helpers.addContainerOffset(global.explainGroupCardHeight);
    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.removeOnboarding, "explainGroupCard");
    helpers.createCardContent("", createExplainGroupText(), "explainGroupCard");
}

function createExplainGroupText(){
    const currentElement = traversialStrategy[currentId];
    let explaination = "Please click on one of the highlighted visualisations to get its explaination.";

    switch(currentElement.type){
        case groupType.all:
            explaination += " You can look at the visualisations in any order but you will have to look at all of them before you can continue.";
            break;
        case groupType.atLeastOne:
            explaination += " You can look at one visualisation or multiple and then continue.";
            break;
        case groupType.onlyOne:
            explaination += " You can look at one of the viualisation and then continue.";
            break;
    }

    return explaination;
}