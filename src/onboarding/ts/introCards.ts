import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { removeElement } from "./elements";
import { disableAll } from "./disableArea";
import { startGuidedTour, createOnboardingOverlay } from "./onboarding";

export function createIntroCard(){
    disableAll();
    
    const style = helpers.getCardStyle(global.introCardMargin, 0, global.introCardWidth, "") + `right:0;margin:auto;`;
    helpers.createCard("introCard", style, "");

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.removeOnboarding, "introCard");

    helpers.createCardContent(getIntroTitle(), getIntroText(), "introCard");

    helpers.createCardButtons("skip", "", "start");
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

function getIntroText(){
    if(global.isGuidedTour){
        return "The guided tour will show you the outline of this dashboard.<br>You can navigate through all visualizations with the next and previous buttons.<br>It will introduce you to the different kinds of graphs and elements and it explains how you can interact with them.";
    } else{
        return "In the dashboard exploration mode you can freely skim through the visualizations of this dashboard. You can end the exploration mode at any time by pressing the 'End Dashboard Exploration' button.<br>When clicking on a graph or element an explanation will appear. You can then navigate through the whole dashboard with the next and previous buttons.<br>When you close the explanation bubble you can select a new visualization to get information on that one.";
    }
}

export function getStartFunction(){
    if(global.isGuidedTour){
        return startGuidedTour; 
     }else{
         return createOnboardingOverlay; 
     }
}