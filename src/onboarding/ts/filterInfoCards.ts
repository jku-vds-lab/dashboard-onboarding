import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { createFilterDisabledArea, removeFrame } from "./disableArea";
import Filter from "../../componentGraph/Filter";
import { removeElement } from "./elements";
import { createInfoCardButtons } from "./infoCards";
import { replacer } from "../../componentGraph/ComponentGraph";
import { TraversalElement } from "./traversal";

export async function createFilterInfoCard(count: number){
    createFilterDisabledArea();
  
    const style = helpers.getCardStyle(global.infoCardMargin, global.reportWidth! - global.infoCardMargin - global.infoCardWidth, global.infoCardWidth, "");
    helpers.createCard("filterInfoCard", style, "rectLeftBig")

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "filterInfoCard");

    let traversal: TraversalElement[];
    if(global.explorationMode){
        traversal = global.basicTraversal;
    } else {
        traversal = global.settings.traversalStrategy;
    }

    const filterData = helpers.getDataWithId(traversal, "globalFilter", ["general", "interaction", "insight"], count);
    if (!filterData) {
      return;
    }

    helpers.createCardContent(filterData.title, filterData.generalInformation, "filterInfoCard");
    createInfoCardButtons(traversal, "globalFilter", [], count);
    
    const filters = await getFilterInfos(traversal, count);
    if(filters){
       createFilterList(traversal, filters, "contentText", count); 
    }
}

export function createFilterList(traversal: TraversalElement[], list: string | any[], parentId: string, count: number){
    document.getElementById("contentText")!.innerHTML = "";
    const visualData = helpers.getDataWithId(traversal, "globalFilter", ["general", "interaction", "insight"], count);
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
            const ul = document.createElement('ul');
            document.getElementById(parentId)?.appendChild(ul);

            for (let i = 0; i < list.length; ++i) {
                const li = document.createElement('li');
                li.innerHTML =  list[i];
                ul.appendChild(li);
            }
    }
}

export function getFilterDescription(filter: Filter){
    let valueText = "";
    let filterText = "";
    if(filter.operation){
        if(filter.values.length != 0){
            valueText = " Its current value is " + helpers.dataToString(filter.values) + ".";
        }
        filterText = "The operation " + filter.operation + " is execuded for " + filter.attribute + "." + valueText;
    }else{
        filterText = "There is a filter for " + filter.attribute + ".";
    }
    return filter.attribute + ": " + filterText;
}

export async function getFilterInfos(traversal: TraversalElement[], count: number){
    const filterInfos = await helpers.getFilterInfo();

    const filterData = helpers.getDataWithId(traversal, "globalFilter", ["general", "interaction", "insight"], count);
    if (!filterData) {
      return;
    }

    const newFilters = [];
    for (let i = 0; i < filterData.filterInfosStatus.length; ++i) {
        switch(filterData.filterInfosStatus[i]){
            case global.infoStatus.original:
                newFilters.push(filterInfos[i]);
                break;
            case global.infoStatus.changed:
            case global.infoStatus.added:
                newFilters.push(filterData.changedFilterInfos[i]);
                break;
            default:
                break;
       }
    }
    return newFilters;
}

export function removeFilterInfoCard(){
    removeElement("filterInfoCard");
    removeElement("disabledLeft");
    removeFrame();
}

export async function saveFilterChanges(newInfo: string[], count:number){
    const filterInfos = await helpers.getFilterInfo();

    const filterData = helpers.getDataWithId(global.settings.traversalStrategy, "globalFilter", ["general", "interaction", "insight"], count);
    if (!filterData) {
        const editedElem = global.editedTexts.find(editedElem => editedElem.idParts[0] === "globalFilter" && editedElem.count === count);
        const index = global.editedTexts.indexOf(editedElem!);
        global.editedTexts.splice(index, 1);
      return;
    }

    for (let i = 0; i < newInfo.length; ++i) {
        if(newInfo[i] == "" || newInfo[i] == null){
            filterData.filterInfosStatus[i] = "deleted";
            filterData.changedFilterInfos[i] = "";
        } else if(i >= filterData.filterInfosStatus.length){
            filterData.filterInfosStatus.push("added");
            filterData.changedFilterInfos.push(newInfo[i]);
        } else if(newInfo[i] == filterInfos[i]){
            filterData.filterInfosStatus[i] = "original";
            filterData.changedFilterInfos[i] = "";
        } else {
            filterData.filterInfosStatus[i] = "changed";
            filterData.changedFilterInfos[i] = newInfo[i];
        }
    }

    if(newInfo.length < filterData.filterInfosStatus.length){
        for (let i = newInfo.length; i <    filterData.filterInfosStatus.length; ++i) {
            filterData.filterInfosStatus[i] = "deleted";
            filterData.changedFilterInfos[i] = "";
        }
    }

    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function resetFilterChanges(count: number){
    const filterInfos = await helpers.getFilterInfo();

    let info = filterInfos.join("\r\n");
    info = info.replaceAll("<br>", " \n");
    const textBox = document.getElementById("textBox")! as HTMLTextAreaElement; 
    textBox.value = info;

    const editedElem = global.editedTexts.find(editedElem => editedElem.idParts[0] === "globalFilter" && editedElem.count === count);
    const index = global.editedTexts.indexOf(editedElem!);
    global.editedTexts.splice(index, 1);

    const filterData = helpers.getDataWithId(global.settings.traversalStrategy, "globalFilter", ["general", "interaction", "insight"], count);
    if (!filterData) {
      return;
    }

    for (let i = 0; i < filterData.filterInfosStatus.length; ++i) {
        if(i < filterInfos.length){        
            filterData.filterInfosStatus[i] = "original";
            filterData.changedFilterInfos[i] = "";
        } else {
            filterData.filterInfosStatus.splice(i, 1);
            filterData.changedFilterInfos.splice(i, 1);
        }
    }

    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function getFilterInfoInEditor(count: number){
    let infos = [];

    const editedElem = global.editedTexts.find(edited => edited.idParts[0] === "globalFilter" && edited.idParts.length === 1);
    
    if(editedElem){
        infos = editedElem.newInfos;
    } else {
        const filterInfos = await helpers.getFilterInfo();

        const filterData = helpers.getDataWithId(global.settings.traversalStrategy, "globalFilter", ["general", "interaction", "insight"], count);
        if (!filterData) {
            infos = filterInfos;
        } else {
            for (let i = 0; i < filterData.filterInfosStatus.length; ++i) {
                switch(filterData.filterInfosStatus[i]){
                    case global.infoStatus.original:
                        infos.push(filterInfos[i]);
                        break;
                    case global.infoStatus.changed:
                    case global.infoStatus.added:
                        infos.push(filterData.changedFilterInfos[i]);
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