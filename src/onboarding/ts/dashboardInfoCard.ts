import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { removeElement } from "./elements";
import { disableAll } from "./disableArea";
import Dashboard from "../../componentGraph/Dashboard";
import { createInfoList } from "./visualInfo";
import infoImg from "../assets/info.png";
import layoutImg from "../assets/layout.png";
import dataImg from "../assets/data.png";
import bulletpointImg from "../assets/dot.png";

export function createDashboardInfoCard(){
    global.setShowsDashboardInfo(true);
    disableAll();
    
    const style = helpers.getCardStyle(global.introCardMargin, 0, global.introCardWidth, "") + `right:0;margin:auto;`;
    helpers.createCard("dashboardInfoCard", style, "");

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "dashboardInfoCard");

    const dashboard = global.componentGraph.dashboard;
    const title = setDashboardTitle(dashboard);
    helpers.createCardContent(title, "", "dashboardInfoCard");
    setDashboardInfos();
    if(global.isGuidedTour){
        helpers.createCardButtons("", "next");
    }else{
        helpers.createCardButtons("previous", "next");
    }
}

function setDashboardTitle(dashboard: Dashboard){
    const title = dashboard.title.text;

    let newTitle = "";
    switch(global.settings.dashboardInfo.titleStatus){
        case global.infoStatus.original:
            newTitle = title;
            break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
            newTitle = global.settings.dashboardInfo.changedTitle;
            break;
        default:
            break;
    }
    
    return newTitle;
}

function setDashboardInfos(){
    const dashboardInfos = getDashboardInfos();
    
    createInfoList(dashboardInfos[0], dashboardInfos[1], "contentText");
}

export function getDashboardInfos(){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const images = dashboardInfo[0];
    const infos = dashboardInfo[1];

    const newImages = [];
    const newInfos = [];
    for (let i = 0; i < global.settings.dashboardInfo.infoStatus.length; ++i) {
        switch(global.settings.dashboardInfo.infoStatus[i]){
            case global.infoStatus.original:
                newImages.push(images[i]);
                newInfos.push(infos[i]);
                break;
            case global.infoStatus.changed:
            case global.infoStatus.added:
                newImages.push(bulletpointImg);
                newInfos.push(global.settings.dashboardInfo.changedInfos[i]);
                break;
            default:
                break;
       }
    }
    return [newImages, newInfos];
}

export function removeDashboardInfoCard(){
    global.setShowsDashboardInfo(false);
    removeElement("dashboardInfoCard");
    removeElement("disabledPage");
}

export function getNewDashboardInfo(dashboard: Dashboard){
    const images = [infoImg, dataImg, layoutImg];
    const infos = [dashboard.purpose, dashboard.task, dashboard.layout];

    return [images, infos];
}

export function saveDashboardChanges(newInfo: string[]){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const originalInfos = dashboardInfo[1];

    for (let i = 0; i < newInfo.length; ++i) {
        if(newInfo[i] == "" || newInfo[i] == null){
            global.settings.dashboardInfo.infoStatus[i] = "deleted";
            global.settings.dashboardInfo.changedInfos[i] = "";
        } else if(i >=  global.settings.dashboardInfo.infoStatus.length){
            global.settings.dashboardInfo.infoStatus.push("added");
            global.settings.dashboardInfo.changedInfos.push(newInfo[i]);
        } else if(newInfo[i] == originalInfos[i]){
            global.settings.dashboardInfo.infoStatus[i] = "original";
            global.settings.dashboardInfo.changedInfos[i] = "";
        } else {
            global.settings.dashboardInfo.infoStatus[i] = "changed";
            global.settings.dashboardInfo.changedInfos[i] = newInfo[i];
        }
    }

    if(newInfo.length < global.settings.dashboardInfo.infoStatus.length){
        for (let i = newInfo.length; i < global.settings.dashboardInfo.infoStatus.length; ++i) {
            global.settings.dashboardInfo.infoStatus[i] = "deleted";
            global.settings.dashboardInfo.changedInfos[i] = "";
        }
    }
}

export async function resetDashboardChanges(){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const originalInfos = dashboardInfo[1];

    for (let i = 0; i < global.settings.dashboardInfo.infoStatus.length; ++i) {
        if(i < originalInfos.length){        
            global.settings.dashboardInfo.infoStatus[i] = "original";
            global.settings.dashboardInfo.changedInfos[i] = "";
        } else {
            global.settings.dashboardInfo.infoStatus.splice(i, 1);
            global.settings.dashboardInfo.changedInfos.splice(i, 1);
        }
    }
}