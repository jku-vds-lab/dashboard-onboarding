import * as global from "./globalVariables";
import { getElementWidth, resizeEmbed, toggleFilter } from "./helperFunctions";

export const infoCardMarginOriginal = 10;
export const infoCardWidthOriginal = 500;
export const introCardMarginOriginal = 60;
export const introCardWidthOriginal = 500;
export const interactionCardWidthOriginal = 500;
export const interactionCardHeightOriginal = 300;
export const hintCardMarginOriginal = 5;
export const hintCardWidthOriginal = 200;
export const editCardMarginOriginal = 0;
export const editCardWidthOriginal = 500;
export const explainGroupCardWidthOriginal = 500;
export const explainGroupCardHeightOriginal = 150;
export const textSizeOriginal = 1;
export const headlineSizeOriginal = 2.5;
export const filterOpenedWidthOriginal = 250;

export let divisor=1;
export let reportDivisor = 1;
export let newWidth = 0;
export let reportWidthOriginal:number;
export let reportHeightOriginal:number;
export let textSize = textSizeOriginal;
export let headlineSize = headlineSizeOriginal;

export function setWidth(width: number){
    newWidth = width;
}
export function setReportWidthDivision(newReportWidth: number){
    reportWidthOriginal = newReportWidth;
    global.setReportWidth(newReportWidth/reportDivisor);
}
export function setReportHeightDivision(newReportHeight: number){
    reportHeightOriginal = newReportHeight;
    global.setReportHeight(newReportHeight/reportDivisor);
}

export function setSizeVariables(){
    global.setInfoCardMargin(infoCardMarginOriginal/divisor);
    global.setInfoCardWidth (infoCardWidthOriginal/divisor);
    global.setIntroCardMargin(introCardMarginOriginal/divisor);
    global.setIntroCardWidth(introCardWidthOriginal/divisor);
    global.setInteractionCardWidth(interactionCardWidthOriginal/divisor);
    global.setInteractionCardHeight(interactionCardHeightOriginal/divisor);
    global.setHintCardMargin(hintCardMarginOriginal/divisor);
    global.setHintCardWidth(hintCardWidthOriginal/divisor);
    global.setEditCardMargin(editCardMarginOriginal/divisor);
    global.setEditCardWidth(editCardWidthOriginal/divisor);
    global.setExplainGroupCardWidth(explainGroupCardWidthOriginal/divisor);
    global.setExplainGroupCardHeight(explainGroupCardHeightOriginal/divisor);
    textSize = textSizeOriginal/divisor;
    headlineSize = headlineSizeOriginal/divisor;
}

export async function resize(){
    calcReportWidth();

    closeFilterForSmallReport();
    setSizeVariables();

    resizeHeaderButtons();

    setReportWidthDivision(global.page.defaultSize.width!);
    setReportHeightDivision(global.page.defaultSize.height!);

    resizeReport();

    resizeEmbed(global.filterOpenedWidth);

    global.setContainerPaddingTop(global.report.iframe.offsetTop + global.settings.reportOffset.top);
    global.setContainerPaddingLeft(global.report.iframe.offsetLeft + global.settings.reportOffset.left);

    await toggleFilter(global.openedFilter);
    await zoom();
}

function calcDivisors(filterWidth: number){
    if(newWidth == 0){
        divisor = 1;
        reportDivisor = 1;
    } else {
        divisor = (global.page.defaultSize.width! + filterWidth)/newWidth;
        reportDivisor = global.page.defaultSize.width!/(newWidth - filterWidth);
    }
}

async function zoom(){
    try {
        const newZoom = 1/reportDivisor;
        await global.report.setZoom(newZoom);
    }
    catch (errors) {
        console.log(errors);
    }
}

function closeFilterForSmallReport(){
    if(divisor>2){
        global.setOpenedFilter(false);
        global.setFilterOpenedWidth(global.filterClosedWidth);
        document.getElementById("reportContainer")!.className = "col-12";
        document.getElementById("provDiv")!.className = "col-12";
        setWidth(getElementWidth(document.getElementById("reportContainer")!));
        calcDivisors(global.filterClosedWidth);
        document.getElementById("provDiv")!.style.paddingTop = "10px";
    } else {
        global.setOpenedFilter(true);
        global.setFilterOpenedWidth(filterOpenedWidthOriginal);
    }
}

function resizeReport(){
    document.getElementsByTagName("iframe")[0].style.width = `${global.reportWidth! + global.filterOpenedWidth + global.settings.reportOffset.left}px`;
    document.getElementsByTagName("iframe")[0].style.height = `${global.reportHeight! + global.footerHeight + global.settings.reportOffset.top}px`;
    document.getElementById("reportContainer")!.style.height = `${global.reportHeight! + global.footerHeight + global.settings.reportOffset.top}px`;
}

function resizeHeaderButtons(){
    const editButton = document.getElementById("editButton")
    if(editButton){
        editButton.style.fontSize = textSize + "rem";
    }
    document.getElementById("guidedTour")!.style.fontSize = textSize + "rem";
    document.getElementById("dashboardExploration")!.style.fontSize = textSize + "rem";
}

function calcReportWidth(){
    document.getElementById("reportContainer")!.className = "col-10";
    document.getElementById("provDiv")!.className = "col-2";
    setWidth(getElementWidth(document.getElementById("reportContainer")!));
    calcDivisors(filterOpenedWidthOriginal);
}