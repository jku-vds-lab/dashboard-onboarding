import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { removeElement } from "./elements";
import { disableAll } from "./disableArea";
import Dashboard from "../../componentGraph/Dashboard";
import { createInfoList } from "./visualInfo";
import infoImg from "../assets/info.png";
import layoutImg from "../assets/layout.png";
import dataImg from "../assets/data.png";

export function createDashboardInfoCard(){
    global.setShowsDashboardInfo(true);
    disableAll();
    
    const style = helpers.getCardStyle(global.introCardMargin, 0, global.introCardWidth, "") + `right:0;margin:auto;`;
    helpers.createCard("infoCard", style, "");

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "infoCard");

    const dashboard = global.componentGraph.dashboard;
    helpers.createCardContent(dashboard.title.text, "", "infoCard");
    getDashboardInfo(dashboard, "contentText");

    helpers.createCardButtons("previous", "next");
}

export function removeDashboardInfoCard(){
    global.setShowsDashboardInfo(false);
    removeElement("infoCard");
    removeElement("disabledPage");
}

export function getDashboardInfo(dashboard: Dashboard, parentId: string){
    const images = [infoImg, dataImg, layoutImg];
    const infos = [dashboard.purpose, dashboard.task, dashboard.layout];
    createInfoList(images, infos, parentId);
}