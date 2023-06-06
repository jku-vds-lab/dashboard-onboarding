import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { removeElement } from "./elements";
import { disableAll } from "./disableArea";
import Dashboard from "../../componentGraph/Dashboard";
import { createInfoList } from "./visualInfo";
import infoImg from "../assets/info.png";
import layoutImg from "../assets/layout.png";
import dataImg from "../assets/data.png";
import bulletpointImg from "../assets/dot.png";
import { createInfoCardButtons } from "./infoCards";
import { TraversalElement, currentId } from "./traversal";
import { replacer } from "../../componentGraph/ComponentGraph";

export function createDashboardInfoCard(count: number){
    global.setShowsDashboardInfo(true);
    disableAll();
    
    const style = helpers.getCardStyle(global.introCardMargin, 0, global.introCardWidth, "") + `right:0;margin:auto;`;
    helpers.createCard("dashboardInfoCard", style, "");

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "dashboardInfoCard");

    let traversal: TraversalElement[];
    if(global.explorationMode){
        traversal = global.basicTraversal;
    } else {
        traversal = global.settings.traversalStrategy;
    }

    const dashboard = global.componentGraph.dashboard;
    const title = setDashboardTitle(traversal, dashboard, count);
    helpers.createCardContent(title, "", "dashboardInfoCard");
    setDashboardInfos(traversal, count);
    createInfoCardButtons(traversal, "dashboard", [], count);
}

function setDashboardTitle(traversal: TraversalElement[], dashboard: Dashboard, count:number){
    const title = dashboard.title.text;

    const dashboardData = helpers.getDataWithId(traversal, "dashboard", ["general", "interaction", "insight"], count);
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

function setDashboardInfos(traversal: TraversalElement[], count: number){
    document.getElementById("contentText")!.innerHTML = "";
    const visualData = helpers.getDataWithId(traversal, "dashboard", ["general", "interaction", "insight"], count);
    if(!visualData){
        return;
    }

    switch(visualData.mediaType){
        case "Video":
            const attributes = global.createDivAttributes();
            attributes.id = "videoContainer";
            attributes.style = "position: relative;padding-bottom: 56.25%;height: 0;";
            attributes.parentId = "contentText";
            elements.createDiv(attributes);
            const videoAttributes = global.createYoutubeVideoAttributes();
            videoAttributes.id = "video";
            videoAttributes.style = `position: absolute; top: 0; left: 0; width: 100%; height: 100%;`;
            videoAttributes.src = visualData.videoURL; //"https://www.youtube.com/embed/V5sBTOhRuKY"
            videoAttributes.parentId = "videoContainer";
            elements.createYoutubeVideo(videoAttributes);
            break;
        default:
            const dashboardInfos = getDashboardInfos(traversal, count);
            
            if(dashboardInfos){
                createInfoList(dashboardInfos[0], dashboardInfos[1], "contentText");
            }
    }
}

export function getDashboardInfos(traversal: TraversalElement[], count: number){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const images = dashboardInfo[0];
    const infos = dashboardInfo[1];

    const dashboardData = helpers.getDataWithId(traversal, "dashboard", ["general", "interaction", "insight"], count);
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

    const dashboardData = helpers.getDataWithId(global.settings.traversalStrategy, "dashboard", ["general", "interaction", "insight"], count);
    if (!dashboardData) {
        const editedElem = global.editedTexts.find(editedElem => editedElem.idParts[0] === "dashboard" && editedElem.count === count);
        const index = global.editedTexts.indexOf(editedElem!);
        global.editedTexts.splice(index, 1);
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
    
    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function resetDashboardChanges(count: number){
    const dashboard = global.componentGraph.dashboard;
    const dashboardInfo = getNewDashboardInfo(dashboard);
    const originalInfos = dashboardInfo[1];

    let info = originalInfos.join("\r\n");
    info = info.replaceAll("<br>", " \n");
    const textBox = document.getElementById("textBox")! as HTMLTextAreaElement; 
    textBox.value = info;

    const editedElem = global.editedTexts.find(editedElem => editedElem.idParts[0] === "dashboard" && editedElem.count === count);
    const index = global.editedTexts.indexOf(editedElem!);
    global.editedTexts.splice(index, 1);

    const dashboardData = helpers.getDataWithId(global.settings.traversalStrategy, "dashboard", ["general", "interaction", "insight"], count);
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

    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export function getDashboardInfoInEditor(count: number){
    let infos = [];

    const editedElem = global.editedTexts.find(edited => edited.idParts[0] === "dashboard" && edited.idParts.length === 1);
    
    if(editedElem){
        infos = editedElem.newInfos;
    } else {
        const dashboard = global.componentGraph.dashboard;
        const dashboardInfo = getNewDashboardInfo(dashboard);
        const dashboardInfos = dashboardInfo[1];

        const dashboardData = helpers.getDataWithId(global.settings.traversalStrategy, "dashboard", ["general", "interaction", "insight"], count);
        if (!dashboardData) {
            infos = dashboardInfos;
        } else {
            for (let i = 0; i < dashboardData.infoStatus.length; ++i) {
                switch(dashboardData.infoStatus[i]){
                    case global.infoStatus.original:
                        infos.push(dashboardInfos[i]);
                        break;
                    case global.infoStatus.changed:
                    case global.infoStatus.added:
                        infos.push(dashboardData.changedInfos[i]);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    let info = infos.join("\r\n");
    info = info.replaceAll("<br>", " \n");
    const textBox = document.getElementById("textBox")! as HTMLTextAreaElement; 
    textBox.value = info;
}