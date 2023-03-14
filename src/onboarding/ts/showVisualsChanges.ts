import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import { getCardChanges,  getChartChanges } from "./basicVisualContent";
import { getLineClusteredColumnComboChartChanges } from "./complexVisualContent";
import { showReportChanges } from "./showReportChanges";

export async function showVisualChanges(selectedVisual: any) {
    const visualData = helpers.getDataOfInteractionVisual(selectedVisual);

    if(visualData && visualData.interactionChangedInfosStatus != global.infoStatus.deleted){
        disable.disableFrame();
        disable.createDisabledArea(selectedVisual);

        const position = helpers.getVisualCardPos(selectedVisual, global.infoCardWidth, global.infoCardMargin);

        const style = helpers.getCardStyle(position.y, position.x, global.infoCardWidth, "");
        if(position.pos === "left"){
            helpers.createCard("showVisualChangesCard", style, "rectLeftBig");
            helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.removeOnboarding, "showVisualChangesCard");
        }else{
            helpers.createCard("showVisualChangesCard", style, "rectRightBig");
            helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.removeOnboarding, "showVisualChangesCard");
        }

        helpers.createCardContent(global.settings.interactionExample.title, "", "showVisualChangesCard");
        helpers.createCardButtons("back to visual", "back to overview");
        
        await createShowVisualChangesInfo(selectedVisual);
    } else {
        showReportChanges();
    }
}

async function createShowVisualChangesInfo(visual: any){
    const visualData = helpers.getDataOfInteractionVisual(visual);
    let visualChangeInfo;

    switch(visualData?.interactionChangedInfosStatus){
        case global.infoStatus.original:
            visualChangeInfo = await getShowVisualChangesText(visual);
            break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
            visualChangeInfo = visualData.changedInteractionChangedInfo;
            break;
        default:
            break;
    }

    document.getElementById("contentText")!.innerHTML = "";
    document.getElementById("contentText")!.innerHTML += visualChangeInfo;
}

export async function getShowVisualChangesText(visual: any){
    const allTargets = global.selectedTargets.map(({ equals }) => equals);
    const allTargetsString = helpers.dataToString(allTargets);
    let visualChangeInfo = "You can see that this visual was filtered by " + allTargetsString + ".<br>";

    const type = helpers.getTypeName(visual);

    switch(type){
        case 'Card':
            visualChangeInfo += await getCardChanges(visual);
            break;
        case 'Line Clustered Column Combo Chart':
            visualChangeInfo += await getLineClusteredColumnComboChartChanges(visual);
            visualChangeInfo += displayCanFilterInfo();
            break;
        case 'Line Chart':
            visualChangeInfo += await getChartChanges(visual, true);
            visualChangeInfo += displayCanFilterInfo();
            break;
        case 'Clustered Bar Chart':
            visualChangeInfo += await getChartChanges(visual, false);
            visualChangeInfo += displayCanFilterInfo();
            break;
        default:
            break;
    }

    return visualChangeInfo;
}

function displayCanFilterInfo(){
    return "<br>You can also change the report filters by selecting a new element of this visual.";
}