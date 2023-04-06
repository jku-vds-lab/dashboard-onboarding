import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { getNewDashboardInfo } from "./dashboardInfoCard";
import { replacer } from "../../componentGraph/ComponentGraph";
import { createTraversalElement, findTraversalVisual, Group, isGroup, setBasicTraversalStrategy, traversalStrategy } from "./traversal";

export async function createSettings(){
    const settings = global.createSettingsObject();
    settings.traversalStrategy = await setTraversalStrategy();
    settings.interactionExample = setInteractionExampleInfo();

    global.setSettings(settings);
    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function getTraversalElement(elem: any){
    let traversalElement;
    if(isGroup(elem)){
        const traversalGroupVisuals = await setGroup(elem);
        elem.visuals = traversalGroupVisuals;
        traversalElement = elem;
    } else if(elem === "dashboard"){
        traversalElement = setDashboardInfo();
    } else if(elem === "globalFilter"){
        traversalElement = await setFilterInfo();
    } else {
        traversalElement = await setVisualsInfo(elem);
    }
    return traversalElement;
}

async function setTraversalStrategy(){
    const traversalElem1 = createTraversalElement("dashboard");
    traversalElem1.element = await getTraversalElement("dashboard");
    traversalStrategy.push(traversalElem1);
    for(const vis of global.currentVisuals){
        const traversalElem = createTraversalElement(vis.type);
        traversalElem.element = await getTraversalElement(vis.name);
        traversalStrategy.push(traversalElem);
    }
    const traversalElem2 = createTraversalElement("globalFilter");
    traversalElem2.element = await getTraversalElement("globalFilter");
    traversalStrategy.push(traversalElem2);
    return traversalStrategy;
}

async function setGroup(elem: Group){
    const traversal = []
    for (const trav of elem.visuals) {
        const visuals = [];
        for (const vis of trav) {
            if(vis.element.id === "dashboard"){
                const traversalElem = createTraversalElement("dashboard");
                traversalElem.element = setDashboardInfo();
                visuals.push(traversalElem);
            } else if(vis.element.id === "globalFilter"){
                const traversalElem = createTraversalElement("globalFilter");
                traversalElem.element = await setFilterInfo();
                visuals.push(traversalElem);
            } else {
                const traversalElem = createTraversalElement("");
                traversalElem.element = await setVisualsInfo(vis.element.id)
                visuals.push(traversalElem);
            }
        }
        traversal.push(visuals);
    }
    return traversal;
}

function setDashboardInfo(){
    const settingsDashboardInfo = global.createDashboardInfo();
    settingsDashboardInfo.id = "dashboard";
    settingsDashboardInfo.titleStatus = "original";
    settingsDashboardInfo.changedTitle = "";

    const dashboardInfo = getNewDashboardInfo(global.componentGraph.dashboard);
    for (let i = 0; i < dashboardInfo[1].length; ++i) {
        settingsDashboardInfo.infoStatus.push("original");
        settingsDashboardInfo.changedInfos.push("");
    }

    return settingsDashboardInfo;
}

async function setVisualsInfo(id: string){
    const visual = findTraversalVisual(id);
    const settingsVisual = global.createVisual();
    settingsVisual.id = visual.name;
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name)!; 
    settingsVisual.title = CGVisual.title.text;
    
    const visualInfos = await helpers.getVisualInfos(visual);

    for (let i = 0; i < visualInfos.generalInfos.length; ++i) {
        settingsVisual.generalInfosStatus.push("original");
        settingsVisual.changedGeneralInfos.push("");
    }
    for (let i = 0; i < visualInfos.interactionInfos.length; ++i) {
        settingsVisual.interactionInfosStatus.push("original");
        settingsVisual.changedInteractionInfos.push("");
    }
    for (let i = 0; i < visualInfos.insightInfos.length; ++i) {
        settingsVisual.insightInfosStatus.push("original");
        settingsVisual.changedInsightInfos.push("");
    }

    return settingsVisual;
}

async function setFilterInfo(){
    const settingsFilterVisual = global.createFilterVisual();
    settingsFilterVisual.id = "globalFilter";
    settingsFilterVisual.title = "Filters";
    settingsFilterVisual.generalInformation = "This page has following filters:";

    const filters = await global.page.getFilters();
    for (let i = 0; i < filters.length; ++i) {
        settingsFilterVisual.filterInfosStatus.push("original");
        settingsFilterVisual.changedFilterInfos.push("");
    }

    return settingsFilterVisual;
}

function setInteractionExampleInfo(){
    const settingsInteractionExample = global.createInteractionExample();
    settingsInteractionExample.title = "Interaction Example";
    settingsInteractionExample.generalInfoStatus = "original";
    settingsInteractionExample.changedGeneralInfo = "";
    settingsInteractionExample.nextVisualHint = "Can you see how this visual changed?";
  
    for (const visual of global.currentVisuals) {
        const type = helpers.getTypeName(visual);
        const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name)!;
        switch(type){
            case 'Card': case "Multi Row Card":
                const settingsInteractableVisualCard = global.createInteractableVisualCard();
                settingsInteractableVisualCard.id = visual.name; 
                settingsInteractableVisualCard.title = CGVisual.title.text;

                settingsInteractableVisualCard.clickInfosStatus = null;
                settingsInteractableVisualCard.changedClickInfo = null;
                settingsInteractableVisualCard.interactionChangedInfosStatus = "original";
                settingsInteractableVisualCard.changedInteractionChangedInfo = "";

                settingsInteractionExample.visuals.push(settingsInteractableVisualCard);
                break;
            case 'Slicer':
                const settingsInteractableVisualSlicer = global.createInteractableVisualSlicer();
                settingsInteractableVisualSlicer.id = visual.name;
                settingsInteractableVisualSlicer.title = CGVisual.title.text;

                settingsInteractableVisualSlicer.clickInfosStatus = "origninal";
                settingsInteractableVisualSlicer.changedClickInfo = "";
                settingsInteractableVisualSlicer.interactionChangedInfosStatus = null;
                settingsInteractableVisualSlicer.changedInteractionChangedInfo = null;

                settingsInteractionExample.visuals.push(settingsInteractableVisualSlicer);
                break;
            default:
                const settingsInteractableVisual = global.createInteractableVisual();
                settingsInteractableVisual.id = visual.name;
                settingsInteractableVisual.title = CGVisual.title.text;

                settingsInteractableVisual.clickInfosStatus = "original";
                settingsInteractableVisual.changedClickInfo = "";
                settingsInteractableVisual.interactionChangedInfosStatus = "original";
                settingsInteractableVisual.changedInteractionChangedInfo = "";

                settingsInteractionExample.visuals.push(settingsInteractableVisual);
                break;
        }
    }

    return settingsInteractionExample;
}