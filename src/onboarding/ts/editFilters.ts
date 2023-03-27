import * as global from "./globalVariables";
import * as elements from "./elements";
import { createCollapseButton, getDataWithId, getFilterInfo } from "./helperFunctions";

// export async function createFiltersGroup(){
//     let divAttributes = global.createDivAttributes();
//     divAttributes.id = "filterGroup";
//     divAttributes.style = "padding: 10px;border: 1px solid black;";
//     divAttributes.parentId = "editOnbording";
//     elements.createDiv(divAttributes);

//     const h2Attributes = global.createH2Attributes();
//     h2Attributes.id = "filterLabel";
//     h2Attributes.style = "display: inline-block;margin-bottom: 0px;";
//     h2Attributes.content = "Filter Information:";
//     h2Attributes.parentId = "filterGroup";
//     elements.createH2(h2Attributes);

//     createCollapseButton("collapseButtonFilterGroup", "filterGroup");

//     const buttonAttributes = global.createButtonAttributes();
//     buttonAttributes.id = "resetFilterInfo";
//     buttonAttributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg> Reset`;
//     buttonAttributes.style =  "display: inline-block;";
//     buttonAttributes.classes = global.darkOutlineButtonClass + " positionRight";
//     buttonAttributes.function = resetFilterInfo;
//     buttonAttributes.parentId = "filterGroup";
//     elements.createButton(buttonAttributes);

//     const smallAttributes = global.createSmallAttributes();
//     smallAttributes.id = "filterHelp";
//     smallAttributes.style = "margin-bottom: 10px;";
//     smallAttributes.content = "Here you can change the information about the report filters.";
//     smallAttributes.parentId = "filterGroup";
//     elements.createSmall(smallAttributes);

//     divAttributes = global.createDivAttributes();
//     divAttributes.id = "collapseFormfilterGroup";
//     divAttributes.classes = "collapse collapseForm";
//     divAttributes.parentId = "filterGroup";
//     elements.createDiv(divAttributes);

//     let labelAttributes = global.createLabelAttributes();
//     labelAttributes.id = "titleLabelFilter";
//     labelAttributes.for = "titleInputFilter";
//     labelAttributes.style = "margin-left: 10px;margin-right: 10px;";
//     labelAttributes.content = "Title:";
//     labelAttributes.parentId = "collapseFormfilterGroup";
//     elements.createLabel(labelAttributes);

//     let inputAttributes = global.createInputAttributes();
//     inputAttributes.id = "titleInputFilter";
//     inputAttributes.type = "string";
//     inputAttributes.value =  filterData.title!;
//     inputAttributes.style = "margin-right: 20px;background-color:lightsteelblue;";
//     inputAttributes.parentId = "collapseFormfilterGroup";
//     elements.createInput(inputAttributes);

//     labelAttributes = global.createLabelAttributes();
//     labelAttributes.id = "generalInfoLabelFilter";
//     labelAttributes.for = "generalInfoInputFilter";
//     labelAttributes.style = "display: block;margin-left: 10px;";
//     labelAttributes.content = "General Information:";
//     labelAttributes.parentId = "collapseFormfilterGroup";
//     elements.createLabel(labelAttributes);

//     inputAttributes = global.createInputAttributes();
//     inputAttributes.id = "generalInfoInputFilter";
//     inputAttributes.type = "string";
//     inputAttributes.value =  filterData.generalInformation!;
//     inputAttributes.style = "display: block;width: 95%;margin-left: 10px;background-color:lightsteelblue;";
//     inputAttributes.parentId = "collapseFormfilterGroup";
//     elements.createInput(inputAttributes);

//     labelAttributes = global.createLabelAttributes();
//     labelAttributes.id = "filterInfosLabel";
//     labelAttributes.for = "filterInfosTextarea";
//     labelAttributes.style = "display: block;margin-left: 10px;";
//     labelAttributes.content = "Filter Information:";
//     labelAttributes.parentId = "collapseFormfilterGroup";
//     elements.createLabel(labelAttributes);

//     const filterInfos = await getFilterInfos();

//     for (let i = 0; i < filterInfos.length; ++i) {
//         createFilterTextfield(filterInfos, i);
//     }

//     createFilterAddButton();
// }

// async function getFilterInfos(){
//     const filterStatus = filterData.filterInfosStatus;
//     const changedFilterInfos =   filterData.changedFilterInfos;
//     const originalFilterInfos = await getFilterInfo();

//     const filterInfos = [];

//     for (let i = 0; i < filterStatus.length; ++i) {
//        switch(filterStatus[i]){
//             case global.infoStatus.original:
//                 filterInfos.push(originalFilterInfos[i]);
//                 break;
//             case global.infoStatus.changed:
//             case global.infoStatus.added:
//                 filterInfos.push(changedFilterInfos[i]);
//                 break;
//             default:
//                 break;
//        }
//     }

//     return filterInfos;
// }

function addFilterTextarea(){
    const textareaAttributes = global.createTextareaAttributes();
    textareaAttributes.class = "filterInfos";
    textareaAttributes.style = "display: block;width: 95%;margin-bottom: 5px;margin-left: 10px;background-color: lightsteelblue;";
    textareaAttributes.parentId = "addFilterInfo";
    elements.createTextarea(textareaAttributes, true);
}

// async function resetFilterInfo(){
//     const titleInputFilter = document.getElementById("titleInputFilter") as HTMLInputElement | null;
//     if(titleInputFilter == null){
//         return;
//     }
//     titleInputFilter.value = "Filters";
//      filterData.title = "Filters";

//     const generalInfoInputFilter = document.getElementById("generalInfoInputFilter") as HTMLInputElement | null;
//     if(generalInfoInputFilter == null){
//         return;
//     }
//     generalInfoInputFilter.value = "This page has following filters:";
//      filterData.generalInformation = "This page has following filters:";

//     const filterInfos = await getFilterInfo();

//     elements.removeElement("addFilterInfo");
//     elements.removeAllElementsOfClass("filterInfos");
//     for (let i = 0; i <  filterData.filterInfosStatus.length; ++i) {
//         if(i < filterInfos.length){
//             createFilterTextfield(filterInfos, i);
            
//              filterData.filterInfosStatus[i] = "original";
//              filterData.changedFilterInfos[i] = "";
//         } else {
//              filterData.filterInfosStatus.splice(i, 1);
//              filterData.changedFilterInfos.splice(i, 1);
//         }
//     }
    
//     createFilterAddButton();
// }

// function createFilterAddButton(){
//     const addButtonAttributes = global.createButtonAttributes();
//     addButtonAttributes.id = "addFilterInfo";
//     addButtonAttributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg> Add`;
//     addButtonAttributes.style =  "margin: auto;display: block;";
//     addButtonAttributes.classes = global.darkOutlineButtonClass;
//     addButtonAttributes.function = addFilterTextarea;
//     addButtonAttributes.parentId = "collapseFormfilterGroup";
//     elements.createButton(addButtonAttributes);
// }

// function createFilterTextfield(filterInfos: any[], index: string | number){
//     const filterInfo = filterInfos[index].replaceAll("<br>", '\r\n');
//     const textareaAttributes = global.createTextareaAttributes();
//         textareaAttributes.id = index + "filterInfosTextarea";
//         textareaAttributes.class = "filterInfos";
//         textareaAttributes.value = filterInfo;
//         textareaAttributes.style = "display: block;width: 95%;margin-bottom: 5px;margin-left: 10px;background-color: lightsteelblue;";
//         textareaAttributes.parentId = "collapseFormfilterGroup";
//         elements.createTextarea(textareaAttributes, false);
// }

export async function saveFilterChanges(newInfo: string[], count:number){
    const filterInfos = await getFilterInfo();

    const filterData = getDataWithId("globalFilter", count);
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
    const filterInfos = await getFilterInfo();

    const filterData = getDataWithId("globalFilter", count);
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