import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { getDashboardInfo } from "./dashboardInfoCard";
import { replacer } from "../../componentGraph/ComponentGraph";

export async function createSettings(){
    const settings = global.createSettingsObject();
    settings.dashboardInfo = setDashboardInfo();
    settings.visuals = await setVisualsInfo();
    settings.filterVisual = await setFilterInfo();
    settings.interactionExample = setInteractionExampleInfo();

    global.setSettings(settings);

    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}


function setDashboardInfo(){
    const settingsDashboardInfo = global.createDashboardInfo();
    settingsDashboardInfo.titleStatus = "original";
    settingsDashboardInfo.changedTitle = "";

    const dashboardInfo = getDashboardInfo(global.componentGraph.dashboard);
    for (let i = 0; i < dashboardInfo[1].length; ++i) {
        settingsDashboardInfo.infoStatus.push("original");
        settingsDashboardInfo.changedInfos.push("");
    }

    return settingsDashboardInfo;
}

async function setVisualsInfo(){
    const settingsVisuals = [] as global.SettingsVisual[];
    for (const visual of global.currentVisuals) {
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
 
        settingsVisuals.push(settingsVisual);
    }

    return settingsVisuals;
}

async function setFilterInfo(){
    const settingsFilterVisual = global.createFilterVisual();
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