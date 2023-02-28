import * as global from "./globalVariables";
import * as elements from "./elements";
import { getClickableStyle } from "./helperFunctions";

export function disableAll(){
    const attributes = global.createDivAttributes();
    attributes.id = "disabledPage";
    attributes.style = getGrayDivStyle(0, 0, global.page.defaultSize.width!, global.page.defaultSize.height!);
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);
    disableFrame();
}

export function disableFrame(){
    removeFrame();
    disableTop();
    disableFilter();
    disableFooter();
    disableLeftOffset();
}

export function disableTop(){
    const attributes = global.createDivAttributes();
    attributes.id = "disabledTop";
    attributes.style = getGrayDivStyle(global.containerPaddingTop - global.settings.reportOffset.top, global.containerPaddingLeft - global.settings.reportOffset.left, global.page.defaultSize.width! + global.settings.reportOffset.left, global.settings.reportOffset.top);
    attributes.parentId = "embed-container";
    elements.createDiv(attributes);
}

export function disableFilter(){
    const attributes = global.createDivAttributes();
    attributes.id = "disabledFilter";
    attributes.style = getGrayDivStyle(global.containerPaddingTop - global.settings.reportOffset.top, global.page.defaultSize.width! + global.containerPaddingLeft, global.filterOpenedWidth + global.settings.reportOffset.right, global.page.defaultSize.height!  + global.settings.reportOffset.top);
    attributes.parentId = "embed-container";
    elements.createDiv(attributes);
}

export function disableFooter(){
    const attributes = global.createDivAttributes();
    attributes.id = "disabledFooter";
    attributes.style = getGrayDivStyle(global.page.defaultSize.height! + global.containerPaddingTop, global.containerPaddingLeft, global.page.defaultSize.width! + global.settings.reportOffset.right + global.filterOpenedWidth, global.footerHeight + global.settings.reportOffset.bottom);
    attributes.parentId = "embed-container";
    elements.createDiv(attributes);
}

export function disableLeftOffset(){
    const attributes = global.createDivAttributes();
    attributes.id = "disabledLeftOffset";
    attributes.style = getGrayDivStyle(global.containerPaddingTop, global.containerPaddingLeft - global.settings.reportOffset.left, global.settings.reportOffset.left, global.page.defaultSize.height! + global.footerHeight + global.settings.reportOffset.bottom);
    attributes.parentId = "embed-container";
    elements.createDiv(attributes);
}

export function removeFrame(){
    elements.removeElement("disabledTop");
    elements.removeElement("disabledFilter");
    elements.removeElement("disabledFooter");
    elements.removeElement("disabledLeftOffset");
}

export function createDisabledArea(visual: any){
    const rightX = visual.layout.x + visual.layout.width;
    const lowerY = visual.layout.y + visual.layout.height;
    const lowerDistance = global.page.defaultSize.height! - lowerY;
    const rightDistance = global.page.defaultSize.width! - rightX;

    let attributes = global.createDivAttributes();
    attributes.id = "disabledUpper";
    attributes.style = getGrayDivStyle(0, 0, global.page.defaultSize.width!, visual.layout.y);
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);

    attributes = global.createDivAttributes();
    attributes.id = "disabledLower";
    attributes.style =  getGrayDivStyle(lowerY, 0, global.page.defaultSize.width!, lowerDistance);
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);

    attributes = global.createDivAttributes();
    attributes.id = "disabledRight";
    attributes.style =  getGrayDivStyle(visual.layout.y, rightX, rightDistance, visual.layout.height);
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);
    
    attributes = global.createDivAttributes();
    attributes.id = "disabledLeft";
    attributes.style =  getGrayDivStyle(visual.layout.y, 0, visual.layout.x, visual.layout.height);
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);
}

export function createFilterDisabledArea(){
    removeFrame();
    elements.removeElement("disabledFilter");
    disableTop();
    disableFooter();
    disableLeftOffset();
    
    const attributes = global.createDivAttributes();
    attributes.id = "disabledLeft";
    attributes.style =  getGrayDivStyle(0, 0, global.page.defaultSize.width!, global.page.defaultSize.height!);
    attributes.parentId = "onboarding";
    elements.createDiv(attributes);
}

function getGrayDivStyle(top: number, left: number, width: number, height: number){
    return getClickableStyle(top, left, width, height) + `background-color:rgb(77, 77, 77);opacity:0.8;`;
}
