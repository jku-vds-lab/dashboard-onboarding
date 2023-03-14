import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { createIntroCard, removeIntroCard } from "./introCards";
import { createInfoCard, removeInfoCard } from "./infoCards";
import { removeFrame } from "./disableArea";
import { removeInteractionCard, startInteractionExample } from "./interactionExample";
import { createSettings } from "./createSettings";
import { showReportChanges } from "./showReportChanges";
import { createDashboardInfoCard, removeDashboardInfoCard } from "./dashboardInfoCard";
import { reportDivisor, resize, textSize } from "./sizes";
import { createFilterInfoCard, removeFilterInfoCard } from "./filterInfoCards";
import { showVisualChanges } from "./showVisualsChanges";
import { setBasicTraversalStrategy } from "./traversal";

export async function onLoadReport(){
    await helpers.getActivePage();
    await helpers.getVisuals();
    await helpers.createComponentGraph();
    await helpers.getSettings();
    setBasicTraversalStrategy();
    
    helpers.createEditOnboardingButtons();
    helpers.createOnboardingButtons();

    resize();

    elements.addStylesheet("/onboarding/css/onboarding.css");

    createGuidedTour();
}

export async function onReloadReport() {
    const oldPage = global.page.name;
    await helpers.getActivePage();

    if(global.page.name !== oldPage && global.page.displayName !== "Info"){
        await helpers.getVisuals();
        await createSettings();
        helpers.resizeEmbed(global.filterOpenedWidth);
    }
}

export async function onDataSelected(event: { detail: { dataPoints: any[]; }; }) {
    if(global.interactionMode){
        const selectedData = event.detail.dataPoints[0];
        if(selectedData){
            global.setSelectedTargets(selectedData.identity);
            showReportChanges();
        } 
    }else{
        helpers.recreateInteractionExampleButton();
    }
}

export async function reloadOnboarding(){
    await resize();
    await reloadOnboardingAt();
}

export async function reloadOnboardingAt(){
    if(document.getElementById("introCard")){
        await startOnboardingAt("intro");
    } else if(document.getElementById("dashboardInfoCard")){
        await startOnboardingAt("dashboard");
    } else if(document.getElementById("filterInfoCard")){
        await startOnboardingAt("globalFilter");
    } else if(document.getElementById("interactionCard")){
        await startOnboardingAt("interaction");
    } else if(document.getElementById("showChangesCard")){
        await startOnboardingAt("reportChanged");
    } else if(document.getElementById("showVisualChangesCard")){
        await startOnboardingAt("visualChanged", helpers.getVisualIndex(global.interactionSelectedVisual.name));
    } else if(document.getElementById("infoCard")){
        await startOnboardingAt("visual", global.currentVisualIndex);
    } else if(global.hasOverlay && !global.interactionMode){
        await startOnboardingAt("explorationOverlay");
    }
}

export async function startOnboardingAt(type: string, visualId?: number){
    helpers.reloadOnboarding();

    switch(type){
        case "intro":
            createIntroCard();
            break;
        case "dashboard":
            createDashboardInfoCard();
            break;
        case "globalFilter":
            await createFilterInfoCard();
            break;
        case "interaction":
            await startInteractionExample();
            break;
        case "reportChanged":
            helpers.removeContainerOffset();
            showReportChanges();
            break;
        case "visualChanged":
            await showVisualChanges(global.currentVisuals[visualId!]);
            break;
        case "visual":
            await createInfoCard(global.currentVisuals[visualId!]);
            break;
        case "explorationOverlay":
            createOnboardingOverlay()
            break;
    }
}

export function createGuidedTour(){
    helpers.removeOnboarding();

    global.setIsGuidedTour(true);
    helpers.createOnboarding();
    createIntroCard();
}

export function createDashboardExploration(){
    if(global.explorationMode){
        helpers.removeOnboarding();
    }else{
        helpers.removeOnboarding();
        
        helpers.startExplorationMode();
        helpers.createOnboarding();
        createIntroCard();
    }
}

export function startGuidedTour(){
    //global.setCurrentVisualIndex(0);
    removeIntroCard();

    createDashboardInfoCard();
}

export function createOnboardingOverlay(){
    global.setHasOverlay(true);

    const attributes = global.createButtonAttributes();
    attributes.id = "dashboardExplaination";
    attributes.content = "Dashboard Explaination";
    attributes.style =  `font-size: ${textSize}rem; ` + global.onboardingButtonStyle;
    attributes.classes = "col-2 " +  global.darkOutlineButtonClass;
    attributes.function = createDashboardInfoOnButtonClick;
    attributes.parentId = "onboarding-header";
    elements.createButton(attributes);

    global.setInteractionMode(false);
    removeFrame();
    removeIntroCard();
    removeInfoCard();
    removeDashboardInfoCard();
    removeFilterInfoCard();
    removeInteractionCard();

    global.currentVisuals.forEach(function (visual: any) {
        const style = helpers.getClickableStyle(visual.layout.y/reportDivisor, visual.layout.x/reportDivisor, visual.layout.width/reportDivisor, visual.layout.height/reportDivisor);
        createOverlay(visual.name, style);
    });

    const style = helpers.getClickableStyle(-global.settings.reportOffset.top, global.reportWidth!, global.filterOpenedWidth, global.reportHeight!);
    createOverlay("filter", style);
}

export function createOverlayForVisuals(visuals: any[]){
    global.setHasOverlay(true);
    global.setInteractionMode(false);
    removeFrame();
    removeIntroCard();
    removeInfoCard();
    removeDashboardInfoCard();
    removeFilterInfoCard();
    removeInteractionCard();

    visuals.forEach(function (visual: any) {
        let style = helpers.getClickableStyle(visual.layout.y/reportDivisor, visual.layout.x/reportDivisor, visual.layout.width/reportDivisor, visual.layout.height/reportDivisor);
        style += "border-color: green";
        createOverlay(visual.name, style);
    });
}

function createDashboardInfoOnButtonClick(){
    helpers.removeOnboardingOverlay();
    createDashboardInfoCard();
}

function createOverlay(id: string, style: string){
    const attributes = global.createDivAttributes();
    attributes.id = id;
    attributes.style = style;
    attributes.clickable = true;
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);
}