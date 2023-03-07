import * as global from "./globalVariables";

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
export const textSizeOriginal = 1;
export const headlineSizeOriginal = 2.5;
export const filterOpenedWidthOriginal = 250;

export let divisor=1;
export let reportWidthOriginal:number;
export let reportHeightOriginal:number;
export let textSize = textSizeOriginal;
export let headlineSize = headlineSizeOriginal;

export function setDivisor(newDivisor: number){
    divisor = newDivisor;
}
export function setReportWidthDivision(newReportWidth: number){
    reportWidthOriginal = newReportWidth;
    global.setReportWidth(newReportWidth/divisor);
}
export function setReportHeightDivision(newReportHeight: number){
    reportHeightOriginal = newReportHeight;
    global.setReportHeight(newReportHeight/divisor);
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
    textSize = textSizeOriginal/divisor;
    headlineSize = headlineSizeOriginal/divisor;
}

export async function resize(){
    setSizeVariables();
    document.getElementById("editButton")!.style.fontSize = textSize + "rem";
    document.getElementById("guidedTour")!.style.fontSize = textSize + "rem";
    document.getElementById("dashboardExploration")!.style.fontSize = textSize + "rem";

    setReportWidthDivision(global.page.defaultSize.width!);
    setReportHeightDivision(global.page.defaultSize.height!);
    if(divisor>2){
        global.setFilterOpenedWidth(global.filterClosedWidth);
        document.getElementById("reportContainer")!.className = "col-12";
        document.getElementById("provDiv")!.className = "col-12";
    } else{
        global.setFilterOpenedWidth(filterOpenedWidthOriginal);
    }
    document.getElementsByTagName("iframe")[0].style.width = `${global.reportWidth! + global.filterOpenedWidth + global.settings.reportOffset.left}px`;
    document.getElementsByTagName("iframe")[0].style.height = `${global.reportHeight! + global.footerHeight + global.settings.reportOffset.top}px`;
    try {
        const newZoom = 1/divisor;
        await global.report.setZoom(newZoom);
    }
    catch (errors) {
        console.log(errors);
    }
}