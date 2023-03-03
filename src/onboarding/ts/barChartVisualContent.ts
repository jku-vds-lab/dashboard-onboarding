import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import infoImg from "../assets/info.png";
import yAxisImg from "../assets/y-axis.png";
import xAxisImg from "../assets/x-axis.png";
import legendImg from "../assets/legend.png";
import barChartImg from "../assets/bar-chart.png";
import elemClickImg from "../assets/element-click.png";
import axisClickImg from "../assets/axis-click.png";
import legendClickImg from "../assets/legend-click.png";
import dataImg from "../assets/data.png";
import filterImg from "../assets/filter.png";
import interactImg from "../assets/interact.png";

export async function getClusteredBarChartInfo(visual: any) {
    const generalImages = [];
    const generalInfos = [];
    const interactionImages = [];
    const interactionInfos =[];
    const insightImages: any[] = [];
    const insightInfos: string[] =[];

    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const axis = CGVisual?.encoding.yAxes[0].attribute;
    const legend = CGVisual?.encoding.legends[0].attribute;
    const dataName = CGVisual?.encoding.xAxes[0].attribute;

    generalImages.push(infoImg);
    generalInfos.push(CGVisual?.description!);

    const dataString = helpers.dataToString(CGVisual?.data.attributes!);
    const channelString = helpers.dataToString(CGVisual?.visual_channel.channel!);
    generalImages.push(dataImg);
    generalInfos.push("It displayes " + dataString + ", they are encoded by " + channelString + ". The purpose of this chart is to " + CGVisual?.task + ".");

    let barInfo = "";
    if(axis){
        barInfo += "The " + CGVisual?.mark + "s are separated vertically by "+ axis + ".<br>";
    }
    if(legend){
        barInfo += "Each " + axis + " has more than one " + CGVisual?.mark + ". This " + CGVisual?.mark + "s represent the " + legend + " and are distinguishable by their color.";
    }
    generalImages.push(barChartImg);
    generalInfos.push(barInfo);

    interactionImages.push(interactImg);
    interactionInfos.push(CGVisual?.interactions.description!);

    let interactionInfo = "With clicking on a " + CGVisual?.mark + " you can filter the report by ";
    if(axis && !legend){
        interactionInfo += axis + ".";
    } else if(!axis && legend){
        interactionInfo += legend + ".";
    }else{
        interactionInfo += axis + " and " + legend + ".";
    }  
    if(CGVisual?.encoding.hasTooltip){
        interactionInfo += "</br>You can hover over a " + CGVisual?.mark + " to get detailed information about its data.";
    }
    interactionImages.push(elemClickImg);
    interactionInfos.push(interactionInfo);
   
    if(CGVisual?.encoding.yAxes[0].isVisible){
        generalImages.push(yAxisImg);
        generalInfos.push("The Y-axis displayes the values of the " + axis + ".");
        interactionImages.push(axisClickImg);
        interactionInfos.push("When clicking on one of the y-axis-labels you can filter the report by " + axis + ".");
    }
    if(CGVisual?.encoding.xAxes[0].isVisible){
        generalImages.push(xAxisImg);
        generalInfos.push("The X-axis displayes the values of the " + dataName + ".");
    }
    if(CGVisual?.encoding.legends[0].isVisible){
        generalImages.push(legendImg);
        generalInfos.push("The legend displayes the values of the " + legend + " and its corresponding color.");
        interactionImages.push(legendClickImg);
        interactionInfos.push("When clicking on one of the labels in the legend you can filter the report by " + legend + ".");
    }

    const filterText = helpers.getLocalFilterText(CGVisual);
    if(filterText !== ""){
        generalImages.push(filterImg);
        generalInfos.push("This chart has the following filters:<br>" + filterText);
    }

    return {generalImages, generalInfos, interactionImages, interactionInfos, insightImages, insightInfos};
}

export async function getBarChartInteractionExample(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const axis = CGVisual?.encoding.yAxes[0].attribute;
    const legend = CGVisual?.encoding.legends[0].attribute;
    const dataName = CGVisual?.encoding.xAxes[0].attribute;
    const axisValues = await helpers.getSpecificDataInfo(visual, axis!);
    const legendValues = await helpers.getSpecificDataInfo(visual, legend!);

    const middelOfAxisValues = Math.floor(axisValues.length/2);

    let interactionInfo = "Please click on the " + CGVisual?.mark + " representing the " + dataName;
    if(axisValues && legendValues){
        interactionInfo += " for " + axisValues[middelOfAxisValues] + " and "+ legendValues[0] + ".";
    } else if(axisValues){
        interactionInfo += " for " + axisValues[middelOfAxisValues] + ".";
    } else if(legendValues){
        interactionInfo += " for " + legendValues[0] + ".";
    } else {
        interactionInfo += ".";
    }

    return interactionInfo;
}