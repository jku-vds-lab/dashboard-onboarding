import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { getNewDashboardInfo } from "./dashboardInfoCard";
import { replacer } from "../../componentGraph/ComponentGraph";
import { findTraversalVisual, Group, isGroup, traversialStrategy } from "./traversal";

export async function createSettings(){
    const settings = global.createSettingsObject();
    settings.traversal = await setTraversal();
    settings.interactionExample = setInteractionExampleInfo();

    global.setSettings(settings);

    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

async function setTraversal(){
    const traversalElements = [];

    for (const elem of traversialStrategy) {
        if(isGroup(elem)){
            const traversalGroupVisuals = setGroup(elem);
            elem.visuals = await traversalGroupVisuals;
            traversalElements.push(elem);
        } else if(elem === "dashboard"){
            traversalElements.push(setDashboardInfo());
        } else if(elem === "globalFilter"){
            traversalElements.push(await setFilterInfo());
        } else {
            traversalElements.push(await setVisualsInfo(elem));
        }
    }

    return traversalElements;
}

async function setGroup(elem: Group){
    const traversalVisuals = []
    for (const vis of elem.visuals) {
        if(vis === "dashboard"){
            traversalVisuals.push(setDashboardInfo());
        } else if(vis === "globalFilter"){
            traversalVisuals.push(await setFilterInfo());
        } else {
            traversalVisuals.push(await setVisualsInfo(vis));
        }
    }
    return traversalVisuals;
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
            case 'Card':
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