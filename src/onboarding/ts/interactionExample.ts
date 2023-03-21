import * as infoCard from "./infoCards";
import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import * as elements from "./elements";
import { getSlicerInteractionExample } from "./basicVisualContent";
import { getBarChartInteractionExample } from "./barChartVisualContent";
import { getLineChartInteractionExample } from "./lineChartVisualContent";
import { getLineClusteredColumnComboChartInteractionExample } from "./complexVisualContent";
import { findCurrentTraversalVisual } from "./traversal";

export function startInteractionExample(){
    global.setInteractionMode(true);
    infoCard.removeInfoCard();
    const visual = findCurrentTraversalVisual();
        if(visual){
            createInteractionCard(visual);
        }
}

export async function createInteractionCard(visual: any){
    disable.disableFrame();
    disable.createDisabledArea(visual);

    const position = helpers.getVisualCardPos(visual, global.infoCardWidth, global.infoCardMargin);

    const style = helpers.getCardStyle(position.y, position.x, global.infoCardWidth, "");
    if(position.pos === "left"){
        helpers.createCard("interactionCard", style, "rectLeftBig");
        helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "interactionCard");
    }else{
        helpers.createCard("interactionCard", style, "rectRightBig");
        helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "interactionCard");
    }
    helpers.createCardContent(global.settings.interactionExample.title, "", "interactionCard");
    helpers.createCardButtons("", "", "back to visual");

    await createInteractionInfo(visual);
}

async function createInteractionInfo(visual: any){
    const visualData = helpers.getDataOfInteractionVisual(visual);
    let interactionInfo;

    switch(visualData?.clickInfosStatus){
        case global.infoStatus.original:
            interactionInfo = await getInteractionText(visual);
            break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
            interactionInfo = visualData.changedClickInfo;
            break;
        default:
            interactionInfo = "Please click on an element of the visualization to filter the report."
            break;
    }

    if(!interactionInfo){
        interactionInfo = "Please click on an element of the visualization to filter the report."
    }

    document.getElementById("contentText")!.innerHTML = interactionInfo;
}

export async function getInteractionText(visual: any){
    const type = helpers.getTypeName(visual);
    let interactionInfo;

    switch(type){
        case 'Line Clustered Column Combo Chart':
            interactionInfo = await getLineClusteredColumnComboChartInteractionExample(visual);
            break;
        case 'Line Chart':
            interactionInfo = await getLineChartInteractionExample(visual);
            break;
        case 'Clustered Bar Chart':
            interactionInfo = await getBarChartInteractionExample(visual);
            break;
        case 'Slicer':
            interactionInfo = await getSlicerInteractionExample(visual);
            break;
        default:
            break;
    }

    return interactionInfo;
}

export function removeInteractionCard(){
    elements.removeElement("interactionCard");
    elements.removeElement("disabledUpper");
    elements.removeElement("disabledLower");
    elements.removeElement("disabledRight");
    elements.removeElement("disabledLeft");
    disable.removeFrame();
}