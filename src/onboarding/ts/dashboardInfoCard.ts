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
import { createInfoCardButtons } from "./infoCards";
import { currentId } from "./traversal";

export function createDashboardInfoCard(count: number){
    global.setShowsDashboardInfo(true);
    disableAll();
    
    const style = helpers.getCardStyle(global.introCardMargin, 0, global.introCardWidth, "") + `right:0;margin:auto;`;
    helpers.createCard("dashboardInfoCard", style, "");

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "dashboardInfoCard");

    const dashboard = global.componentGraph.dashboard;
    const title = setDashboardTitle(dashboard, count);
    helpers.createCardContent(title, "", "dashboardInfoCard");
    setDashboardInfos(count);
    createInfoCardButtons("dashboard", [], count);
}

function setDashboardTitle(dashboard: Dashboard, count:number){
    const title = dashboard.title.text;

    const dashboardData = helpers.getDataWithId("dashboard", [], count);
    if (!dashboardData) {
      return;
    }

    let newTitle = "";
    switch(dashboardData.titleStatus){
        case global.infoStatus.original:
            newTitle = title;
            break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
            newTitle = dashboardData.changedTitle;
            break;
        default:
            break;
    }
    
    return newTitle;
}

function setDashboardInfos(count: number){
    const dashboardInfos = getDashboardInfos(count);
    
    if(dashboardInfos){
        createInfoList(dashboardInfos[0], dashboardInfos[1], "contentText");
    }
}

export function getDashboardInfos(count: number){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const images = dashboardInfo[0];
    const infos = dashboardInfo[1];

    const dashboardData = helpers.getDataWithId("dashboard",[], count);
    if (!dashboardData) {
      return;
    }

    const newImages = [];
    const newInfos = [];
    for (let i = 0; i < dashboardData.infoStatus.length; ++i) {
        switch(dashboardData.infoStatus[i]){
            case global.infoStatus.original:
                newImages.push(images[i]);
                newInfos.push(infos[i]);
                break;
            case global.infoStatus.changed:
            case global.infoStatus.added:
                newImages.push(bulletpointImg);
                newInfos.push(dashboardData.changedInfos[i]);
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

export function saveDashboardChanges(newInfo: string[], count: number){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const originalInfos = dashboardInfo[1];

    const dashboardData = helpers.getDataWithId("dashboard",[], count);
    if (!dashboardData) {
      return;
    }

    for (let i = 0; i < newInfo.length; ++i) {
        if(newInfo[i] == "" || newInfo[i] == null){
            dashboardData.infoStatus[i] = "deleted";
            dashboardData.changedInfos[i] = "";
        } else if(i >=  dashboardData.infoStatus.length){
            dashboardData.infoStatus.push("added");
            dashboardData.changedInfos.push(newInfo[i]);
        } else if(newInfo[i] == originalInfos[i]){
            dashboardData.infoStatus[i] = "original";
            dashboardData.changedInfos[i] = "";
        } else {
            dashboardData.infoStatus[i] = "changed";
            dashboardData.changedInfos[i] = newInfo[i];
        }
    }

    if(newInfo.length < dashboardData.infoStatus.length){
        for (let i = newInfo.length; i < dashboardData.infoStatus.length; ++i) {
            dashboardData.infoStatus[i] = "deleted";
            dashboardData.changedInfos[i] = "";
        }
    }
}

export async function resetDashboardChanges(count: number){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const originalInfos = dashboardInfo[1];

    const dashboardData = helpers.getDataWithId("dashboard", [], count);
    if (!dashboardData) {
      return;
    }

    for (let i = 0; i < dashboardData.infoStatus.length; ++i) {
        if(i < originalInfos.length){        
            dashboardData.infoStatus[i] = "original";
            dashboardData.changedInfos[i] = "";
        } else {
            dashboardData.infoStatus.splice(i, 1);
            dashboardData.changedInfos.splice(i, 1);
        }
    }
}