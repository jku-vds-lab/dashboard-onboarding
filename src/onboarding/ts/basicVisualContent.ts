import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import infoImg from "../assets/info.png";
import elemClickImg from "../assets/element-click.png";
import dataImg from "../assets/data.png";
import filterImg from "../assets/filter.png";
import interactImg from "../assets/interact.png";

export async function getCardInfo(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const dataName = CGVisual?.encoding.values[0].attribute!;
    const dataValue = await helpers.getSpecificDataInfo(visual, dataName);

    const generalImages = [];
    const generalInfos = [];
    const interactionImages: any[] = [];
    const interactionInfos: string[] =[];
    const insightImages: any[] = [];
    const insightInfos: string[] =[];

    generalImages.push(infoImg);
    generalInfos.push(CGVisual?.description!);

    generalImages.push(dataImg);
    generalInfos.push("This card shows the current value of "+ dataName + ", which is " + dataValue[0] + ". The purpose of this chart is to " + CGVisual?.task + ".");

    const filterText = helpers.getLocalFilterText(CGVisual);
    if(filterText !== ""){
        generalImages.push(filterImg);
        generalInfos.push("This chart has the following filters:<br>" + filterText);
    }
    
    return {generalImages, generalInfos, interactionImages, interactionInfos, insightImages, insightInfos};
}

export async function getCardChanges(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const dataName = CGVisual?.encoding.values[0].attribute!;
    const dataValue = await helpers.getSpecificDataInfo(visual, dataName);

    const visualInteractionInfo = "The displayed data is now " + dataValue[0] + ".";
    
    return visualInteractionInfo;
}

export async function getSlicerInfo(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name);
    const filterName = CGVisual?.encoding.values[0]!;

    const generalImages = [];
    const generalInfos = [];
    const interactionImages = [];
    const interactionInfos =[];
    const insightImages: any[] = [];
    const insightInfos: string[] =[];

    generalImages.push(infoImg);
    generalInfos.push(CGVisual?.description!);

    generalImages.push(dataImg);
    generalInfos.push("With this one you can filter by " + filterName.attribute + ". The purpose of this chart is to " + CGVisual?.task + ".");

    const filterText = helpers.getLocalFilterText(CGVisual);
    if(filterText !== ""){
        generalImages.push(filterImg);
        generalInfos.push("This chart has the following filters:<br>" + filterText);
    }
    
    interactionImages.push(interactImg);
    interactionInfos.push(CGVisual?.interactions.description!);

    interactionImages.push(elemClickImg);
    interactionInfos.push("With clicking on a " + CGVisual?.mark + " you can filter the report by " + filterName.attribute + ".");

    return {generalImages, generalInfos, interactionImages, interactionInfos, insightImages, insightInfos};
}

export async function getSlicerInteractionExample(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name);
    const filterName = CGVisual?.encoding.values[0]!;
    const dataValues = await helpers.getSpecificDataInfo(visual, filterName.attribute);

    const middelOfDataValues = Math.floor(dataValues.length/2);

    const interactionInfo = "Please click on the list element " + dataValues[middelOfDataValues] + ".";

    return interactionInfo;
}

export async function getChartChanges(visual: any, isVertical: boolean) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const legend = CGVisual?.encoding.legends[0].attribute!;
    let axis = "";
    let dataName = "";

    if(!isVertical){
        axis = CGVisual?.encoding.yAxes[0].attribute!;
        dataName = CGVisual?.encoding.xAxes[0].attribute!;
    } else {
        axis = CGVisual?.encoding.xAxes[0].attribute!;
        dataName = CGVisual?.encoding.yAxes[0].attribute!;
    }
    const axisValues = await helpers.getSpecificDataInfo(visual, axis);
    const legendValues = await helpers.getSpecificDataInfo(visual, legend);

    const additionalFilters = global.selectedTargets.filter(function (selectedData: global.Target) {
        return selectedData.target.column != axis && selectedData.target.column != legend;
    });

    let visualInteractionInfo = helpers.getGeneralInteractionInfo(additionalFilters, dataName);

    if(axisValues && legendValues){
        visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
        visualInteractionInfo += " and ";
        visualInteractionInfo += helpers.getTargetInteractionFilter(legend);
    } else if(axisValues){
        visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
    } else if(legendValues){
        visualInteractionInfo += helpers.getTargetInteractionFilter(legend);
    }
    visualInteractionInfo += ".";

    return visualInteractionInfo;
}