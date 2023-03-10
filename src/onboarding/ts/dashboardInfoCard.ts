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
    helpers.createCard("infoCard", style, "");

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "infoCard");

    const dashboard = global.componentGraph.dashboard;
    const title = setDashboardTitle(dashboard);
    helpers.createCardContent(title, "", "infoCard");
    setDashboardInfos(dashboard);
    helpers.createCardButtons("previous", "next");
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
function setDashboardInfos(dashboard: Dashboard){
    const dashboardInfo = getDashboardInfo(dashboard);
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
    
    createInfoList(newImages, newInfos, "contentText");
}

export function removeDashboardInfoCard(){
    global.setShowsDashboardInfo(false);
    removeElement("infoCard");
    removeElement("disabledPage");
}

export function getDashboardInfo(dashboard: Dashboard){
    const images = [infoImg, dataImg, layoutImg];
    const infos = [dashboard.purpose, dashboard.task, dashboard.layout];

    return [images, infos];
}