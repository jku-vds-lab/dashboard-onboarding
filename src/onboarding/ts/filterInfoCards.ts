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

    const filterData = helpers.getDataWithId("globalFilter", count);
    if (!filterData) {
      return;
    }

    helpers.createCardContent(filterData.title, filterData.generalInformation, "filterInfoCard");
    createInfoCardButtons();
    
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

    const filterData = helpers.getDataWithId("globalFilter", count);
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