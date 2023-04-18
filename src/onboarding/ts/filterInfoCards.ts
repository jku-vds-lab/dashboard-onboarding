import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { createFilterDisabledArea, removeFrame } from "./disableArea";
import Filter from "../../componentGraph/Filter";
import { removeElement } from "./elements";
import { createInfoCardButtons } from "./infoCards";

export async function createFilterInfoCard(count: number){
    createFilterDisabledArea();
  
    const style = helpers.getCardStyle(global.infoCardMargin, global.reportWidth! - global.infoCardMargin - global.infoCardWidth, global.infoCardWidth, "");
    helpers.createCard("filterInfoCard", style, "rectLeftBig")

    helpers.createCloseButton("closeButton", "closeButtonPlacementBig", "", helpers.getCloseFunction(), "filterInfoCard");

    const filterData = helpers.getDataWithId("globalFilter", [], count);
    if (!filterData) {
      return;
    }

    helpers.createCardContent(filterData.title, filterData.generalInformation, "filterInfoCard");
    createInfoCardButtons("globalFilter", [], count);
    
    const filters = await getFilterInfos(count);
    if(filters){
       createFilterList(filters, "contentText"); 
    }
}

export function createFilterList(list: string | any[], parentId: string){
    const ul = document.createElement('ul');
    document.getElementById(parentId)?.appendChild(ul);

    for (let i = 0; i < list.length; ++i) {
        const li = document.createElement('li');
        li.innerHTML =  list[i];
        ul.appendChild(li);
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

export async function getFilterInfos(count: number){
    const filterInfos = await helpers.getFilterInfo();

    const filterData = helpers.getDataWithId("globalFilter", [], count);
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

    const filterData = helpers.getDataWithId("globalFilter", [], count);
    if (!filterData) {
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
}

export async function resetFilterChanges(count: number){
    const filterInfos = await helpers.getFilterInfo();

    const filterData = helpers.getDataWithId("globalFilter", [], count);
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
}