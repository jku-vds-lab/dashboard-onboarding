import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { removeElement } from "./elements";
import { disableAll } from "./disableArea";
import { createOnboardingOverlay } from "./onboarding";
import { TraversalElement } from "./traversal";
import { getDataWithId } from "../../componentGraph/helperFunctions";
import { nextInfoCard } from "./infoCards";

export function createIntroCard(count?: number){
    disableAll();
    
    const style = helpers.getCardStyle(global.introCardMargin, 0, global.introCardWidth, "") + `right:0;margin:auto;`;
    helpers.createCard("introCard", style, "");

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.removeOnboarding, "introCard");

    helpers.createCardContent(getIntroTitle(), getIntroText(count), "introCard");

    helpers.createCardButtons("cardButtons", "skip", "", "start");
}

export function removeIntroCard(){
    removeElement("introCard");
    removeElement("disabledPage");
}

function getIntroTitle(){
    if(global.isGuidedTour){
       return "Welcome to the guided tour of " + global.page.displayName; 
    }else{
        return "Welcome to the dashboard exploration of " + global.page.displayName; 
    }
}

 export function getIntroText(count?: number){
    let traversal: TraversalElement[];
    if (global.explorationMode) {
      traversal = global.basicTraversal;
    } else {
      traversal = global.settings.traversalStrategy;
    }
    
    const welcomeData = getDataWithId(
        traversal,
        "welcomeCard",
        ["general"],
        count?count:1
    );
    if (!welcomeData) {
        return;
    }

    if(welcomeData.changedGeneralInfos.length === 0){
        return getBasicIntroText();
    } else {
        return welcomeData.changedGeneralInfos[0];
    }
}

export function getBasicIntroText(){
    if(global.isGuidedTour){
        return "The guided tour will show you the outline of this dashboard.<br>You can navigate through all visualizations with the next and previous buttons.<br>It will introduce you to the different kinds of graphs and elements and it explains how you can interact with them.";
    } else{
        return "In the dashboard exploration mode you can freely skim through the visualizations of this dashboard. You can end the exploration mode at any time by pressing the 'End Dashboard Exploration' button.<br>When clicking on a graph or element an explanation will appear. You can then navigate through the whole dashboard with the next and previous buttons.<br>When you close the explanation bubble you can select a new visualization to get information on that one.";
    }
}

export function getStartFunction(){
    if(global.isGuidedTour){
        return nextInfoCard; 
     }else{
         return createOnboardingOverlay; 
     }
}