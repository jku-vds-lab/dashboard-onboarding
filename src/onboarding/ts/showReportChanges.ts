import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import * as elements from "./elements";
import { removeInteractionCard } from "./interactionExample";
import { divisor } from "./sizes";

export function showReportChanges(){
    disable.removeFrame();
    removeInteractionCard();
    removeShowChangesCard();
    removeHintCard()

    createInteractionOverlay();
    createHintCard();

    const style = `overflow: auto;position:fixed;top:10px;left:50%;margin-left:` + -(global.interactionCardWidth/2) + `px;width:`+ global.interactionCardWidth + `px;height:` + global.interactionCardHeight + `px;pointer-events:auto;border-radius:10px;background-color:lightsteelblue;z-index: 99 !important;`;
    helpers.createCard("showChangesCard", style, "");

    helpers.addContainerOffset();

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.removeOnboarding, "showChangesCard");

    helpers.createCardContent(global.settings.interactionExample.title, createShowReportChangesInfo(), "showChangesCard");

    helpers.createCardButtons("", "back to visual");
}

function createShowReportChangesInfo(){
    let reportChangesInfo;

    switch(global.settings.interactionExample.generalInfoStatus){
        case global.infoStatus.original:
            reportChangesInfo = getShowReportChangesText();
            break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
            reportChangesInfo = global.settings.interactionExample.changedGeneralInfo;
            break;
        case global.infoStatus.deleted:
            reportChangesInfo = "You can now click on one of the cards or graphs to get detailed information about its changes.";
            break;
        default:
            break;
    }
    return reportChangesInfo;
}

export function getShowReportChangesText(){
    const allTargets = global.selectedTargets.map(({ equals }) => equals);
    const allTargetsString = helpers.dataToString(allTargets);
    return "Can you see how the whole report changed?<br>All the visualizations were filtered by "+ allTargetsString
    + ".<br>You can now click on one of the cards or graphs to get detailed information about its changes.";
}

export function createInteractionOverlay(){
    const visuals = global.currentVisuals.filter(function (visual) {
        return visual.type !== "slicer"
    });
    visuals.forEach(function (visual) {
        createInteractionVisualOverlay(visual);
    });
}

export function createInteractionVisualOverlay(visual: any){
    const style = helpers.getClickableStyle(visual.layout.y/divisor, visual.layout.x/divisor, visual.layout.width/divisor, visual.layout.height/divisor);
    const attributes = global.createDivAttributes();
    attributes.id = visual.name;
    attributes.style = style;
    attributes.clickable = true;
    attributes.selectedTargets = global.selectedTargets;
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);
}


function createHintCard(){
    if(global.settings.interactionExample.nextVisualHint != ""){
        const nextVisual = helpers.getNextVisual();

        const visualWithBorder = document.getElementById(nextVisual.name);
        visualWithBorder!.className += ` greenBorder`;
        
        const position = helpers.getVisualCardPos(nextVisual, global.hintCardWidth, global.hintCardMargin);
    
        const style = helpers.getClickableStyle(position.y, position.x, global.hintCardWidth, "") + `border-radius:10px;background-color:lightgreen;opacity: 0.85;z-index: 99 !important;`;
        if(position.pos === "left"){
            helpers.createCard("hintCard", style, "rectLeftSmall");
            helpers.createCloseButton("hintCloseButton", "closeButtonPlacementSmall", "", removeHintCard , "hintCard");
        }else{
            helpers.createCard("hintCard", style, "rectRightSmall");
            helpers.createCloseButton("hintCloseButton", "closeButtonPlacementSmall", "", removeHintCard, "hintCard");
        }
    
        helpers.createBasicCardContent(global.settings.interactionExample.nextVisualHint!, "hintCard");
    }
}

export function removeShowChangesCard(){
    elements.removeElement("showChangesCard");
}

export function removeHintCard(){
    const visualsWithBorder = document.getElementsByClassName("greenBorder");
    if (visualsWithBorder.length != 0){
        visualsWithBorder[0].className += " noBorder";
    }
    elements.removeElement("hintCard");
}