import { createDashboardInfoCard, removeDashboardInfoCard } from "./dashboardInfoCard";
import { removeFrame } from "./disableArea";
import { createFilterInfoCard, removeFilterInfoCard } from "./filterInfoCards";
import { currentVisuals } from "./globalVariables";
import { removeOnboardingOverlay } from "./helperFunctions";
import { createInfoCard, removeInfoCard } from "./infoCards";
import { removeIntroCard } from "./introCards";
import { createOverlayForVisuals } from "./onboarding";

export const traversialStrategy: any[] = [];
export let currentId=0;

export interface Group{
    type: groupType;
    visuals: string[];
}

function isGroup(object: any): object is Group {
    return object.type && Object.values(groupType).includes(object.type);
}


export enum groupType {
    all = "all",
    atLeastOne = "atLeastOne",
    onlyOne = "onlyOne"
}

export function createGroup(){
    const group: Group = {
        type: groupType.all,
        visuals: []
    }
    return group;
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


export function findVisualInTraversal(id: string){
    let index = traversialStrategy.indexOf(id);
    if(index  == -1){
       const groups =  traversialStrategy.find(object => isGroup(object));
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