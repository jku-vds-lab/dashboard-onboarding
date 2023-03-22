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
import { replacer } from "../../componentGraph/ComponentGraph";
import { getTraversalElement } from "./createSettings";

export let traversalStrategy: any[] = [];
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
export function setTraversalStrategy(newTraversalStrategy: any[]){
    traversalStrategy = newTraversalStrategy;
}

export function setBasicTraversalStrategy(){
    traversalStrategy.push("dashboard");
    for(const vis of currentVisuals){
        traversalStrategy.push(vis.name);
    }
    traversalStrategy.push("globalFilter");
}

export function setTestAllGroupsTraversalStrategy(){
    traversalStrategy.push("dashboard");
    traversalStrategy.push(currentVisuals[0].name);
    traversalStrategy.push(currentVisuals[1].name);
    const group = createGroup();
    group.visuals.push(currentVisuals[2].name);
    group.visuals.push(currentVisuals[3].name);
    group.visuals.push(currentVisuals[4].name);
    traversalStrategy.push(group);
    traversalStrategy.push(currentVisuals[5].name);
    traversalStrategy.push(currentVisuals[6].name);
    traversalStrategy.push("globalFilter");
}

export function setTestAtLeastOneGroupsTraversalStrategy(){
    traversalStrategy.push("dashboard");
    traversalStrategy.push(currentVisuals[0].name);
    traversalStrategy.push(currentVisuals[1].name);
    const group = createGroup();
    group.type = groupType.atLeastOne;
    group.visuals.push(currentVisuals[2].name);
    group.visuals.push(currentVisuals[3].name);
    group.visuals.push(currentVisuals[4].name);
    traversalStrategy.push(group);
    traversalStrategy.push(currentVisuals[5].name);
    traversalStrategy.push(currentVisuals[6].name);
    traversalStrategy.push("globalFilter");
}

export function setTestOnlyOneGroupsTraversalStrategy(){
    traversalStrategy.push("dashboard");
    traversalStrategy.push(currentVisuals[0].name);
    traversalStrategy.push(currentVisuals[1].name);
    const group = createGroup();
    group.type = groupType.onlyOne;
    group.visuals.push(currentVisuals[2].name);
    group.visuals.push(currentVisuals[3].name);
    group.visuals.push(currentVisuals[4].name);
    traversalStrategy.push(group);
    traversalStrategy.push(currentVisuals[5].name);
    traversalStrategy.push(currentVisuals[6].name);
    traversalStrategy.push("globalFilter");
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
    const currentElement = global.settings.traversalStrategy[currentId];

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
    const currentElement = global.settings.traversalStrategy[currentId];
    createInformationCard("group", currentElement.visuals, undefined);
}


export function findVisualIndexInTraversal(id: string){
    let index = global.settings.traversalStrategy.indexOf(id);
    if(index  == -1){
       const groups =  global.settings.traversalStrategy.filter(object => isGroup(object));
       for(const group of groups){
            const indexInGroup = group.visuals.indexOf(id);
            if(indexInGroup != -1){
                index = global.settings.traversalStrategy.indexOf(group);
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
    const traversalElem = global.settings.traversalStrategy[currentId];
    
    if(!isGroup(traversalElem) && traversalElem !== "dashboard" && traversalElem !== "globalFilter"){
        return currentVisuals.find((vis: any) => vis.name === traversalElem);
    }

    return null;
}

export function findCurrentTraversalVisualIndex(){
    const traversalElem = global.settings.traversalStrategy[currentId];
    
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
    const currentElement = traversalStrategy[currentId];
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

export async function updateTraversal(newTraversalStrategy: any[]){
    const traversalElements = [];
    const oldTraversalSettings = global.settings.traversalElements;

    for (const elem of newTraversalStrategy) {
        if(isGroup(elem)){
            for(const groupElem of elem.visuals){
                const oldSetting = oldTraversalSettings.find(elemSetting => elemSetting.id === elem);
                if(oldSetting){
                    traversalElements.push(oldSetting);
                } else {
                    traversalElements.push(await getTraversalElement(groupElem));
                }
            }
        }else{
            const oldSetting = oldTraversalSettings.find(elemSetting => elemSetting.id === elem);
            if(oldSetting){
                traversalElements.push(oldSetting);
            } else {
                traversalElements.push(await getTraversalElement(elem));
            }
        }
    }

    setTraversalStrategy(newTraversalStrategy);
    global.settings.traversalStrategy = newTraversalStrategy;
    global.settings.traversalElements = traversalElements;
    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export function updateLookedAt(id: string){
    const currentElement = global.settings.traversalStrategy[currentId];
    if(isGroup(currentElement)){
        if(currentElement.id === lookedAtInGroup.groupId){
            lookedAtInGroup.elements.push(id);
        } else {
            lookedAtInGroup.groupId = currentElement.id;
            lookedAtInGroup.elements = [id];
        }
    } else {
        lookedAtInGroup.groupId = "";
        lookedAtInGroup.elements = [];
    }
}