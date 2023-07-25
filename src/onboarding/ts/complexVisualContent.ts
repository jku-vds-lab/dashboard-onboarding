import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";

export async function getLineClusteredColumnComboChartInfo(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const axis = CGVisual?.encoding.xAxes[0]? CGVisual?.encoding.xAxes[0].attribute: null;
    const data = CGVisual?.encoding.yAxes;
    const columnData = data?.filter(yAxis => yAxis.type === "Column y-axis")!;
    const lineData = data?.filter(yAxis => yAxis.type === "Line y-axis")!;

    const generalImages = [] as any[];
    const generalInfos = [] as string[];
    const interactionImages = [] as any[];
    const interactionInfos = [] as string[];
    const insightImages = [] as any[];
    const insightInfos = [] as string[];
        
    generalImages.push("infoImg");
    generalInfos.push(CGVisual?.description!);

    const dataString = helpers.dataToString(CGVisual?.data.attributes!);
    const channelString = helpers.dataToString(CGVisual?.visual_channel.channel!);
    generalImages.push("dataImg");
    generalInfos.push("It displayes " + dataString + ", they are encoded by " + channelString + ". The purpose of this chart is to " + CGVisual?.task + ".");

    if(columnData.length != 0){
        let barInfo = "This graph contains bars.<br>";
        if(axis){
            barInfo += "The bars are separated horizotally by "+ axis + ".<br>";
        }
        if(columnData.length == 1){
            barInfo += "The bars of this chart represents " + columnData[0].attribute + ".";
        }else{
            const columnAttributs = columnData.map(yAxis => yAxis.attribute);
            const dataString = helpers.dataToString(columnAttributs);
            barInfo += "Each " + axis + " has more than one bar. The bars of this chart represent " + dataString + ". They are distinguishable by their color.";
        }
        generalImages.push("barChartImg");
        generalInfos.push(barInfo);
    }

    if(lineData.length != 0){
        let lineInfo = "This graph contains lines.<br>";
        if(axis){
            lineInfo += "The lines show the development of their data over the " + axis + ".<br>";
        }
        if(lineData.length == 1){
            lineInfo += "The line represents the data of " + lineData[0].attribute + ".<br>";
        }else{
            const lineAttributs = lineData.map(yAxis => yAxis.attribute);
            const dataString = helpers.dataToString(lineAttributs);
            lineInfo += "This chart has more than one line. The lines represent " + dataString + ". They are distinguishable by their color.<br>";
        }
        generalImages.push("lineGraphImg");
        generalInfos.push(lineInfo);
    }

    interactionImages.push("interactImg");
    interactionInfos.push(CGVisual?.interactions.description!);

    interactionImages.push("elemClickImg");
    let interactionInfo = "When clicking on a " + CGVisual?.mark + " you can filter the report by " + axis + ".";
    if(CGVisual?.encoding.hasTooltip){
        interactionInfo += "</br>You can hover over a " + CGVisual?.mark + " to get detailed information about its data.";
    }
    interactionInfos.push(interactionInfo);

    if(CGVisual?.encoding.xAxes[0].isVisible){
        generalImages.push("xAxisImg");
        generalInfos.push("The X-axis displayes the values of the " + axis + ".");
        interactionImages.push("axisClickImg");
        interactionInfos.push("When clicking on one of the x-axis-labels you can filter the report by " + axis + ".");
    }
    if(CGVisual?.encoding.yAxes[0].isVisible){
        const dataAttributs = CGVisual?.encoding.yAxes.map(yAxis => yAxis.attribute);
        const dataString = helpers.dataToString(dataAttributs);
        generalImages.push("yAxisImg");
        generalInfos.push("The Y-axes display the values of the " + dataString + ".");
    }
    if(await helpers.isVisible(visual, "legend")){
        generalImages.push("legendImg");
        generalInfos.push("The legend displayes, which data is represented by a " + CGVisual?.mark + " of this chart. It also shows the corresponding color.");
        interactionImages.push("legendClickImg");
        interactionInfos.push("When clicking on one of the labels in the legend you can filter the report by this data.");
    }

    const filterText = helpers.getLocalFilterText(CGVisual);
    if(filterText !== ""){
        generalImages.push("filterImg");
        generalInfos.push("This chart has the following filters:<br>" + filterText);
    }

    return {generalImages, generalInfos, interactionImages, interactionInfos, insightImages, insightInfos};
}

export async function getLineClusteredColumnComboChartInteractionExample(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const axis = CGVisual?.encoding.xAxes[0].attribute;
    const axisValues = await helpers.getSpecificDataInfo(visual, axis!);
    const data = CGVisual?.encoding.yAxes;
    const columnData = data?.filter(yAxis => yAxis.type === "Column y-axis")!;
    const lineData = data?.filter(yAxis => yAxis.type === "Line y-axis")!;

    const middelOfAxisValues = Math.floor(axisValues.length/2);

    let interactionInfo;
    if(lineData.length != 0 && columnData.length == 0){
        interactionInfo = "Please click on the line";
        if(axisValues && lineData){
            interactionInfo += " representing " + lineData[0].attribute + " at the area of " + axisValues[middelOfAxisValues] + ".";
        } else if(axisValues){
            interactionInfo += " at the area of " + axisValues[middelOfAxisValues] + ".";
        } else if(lineData.length == 0){
            interactionInfo += " representing " + lineData[0].attribute +".";
        } else {
            interactionInfo += ".";
        }
    } else {
        interactionInfo = "Please click on the bar representing the ";
        if(axisValues && columnData.length != 0){
            interactionInfo += columnData[0].attribute + " for "+ axisValues[middelOfAxisValues] + ".";
        } else if(axisValues){
            interactionInfo += " data for " + axisValues[middelOfAxisValues] + ".";
        } else if(columnData.length != 0){
            interactionInfo += columnData[0].attribute + ".";
        } else {
            interactionInfo += ".";
        }
    }

    return interactionInfo;
}

export async function getLineClusteredColumnComboChartChanges(visual: any) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(vis => vis.id === visual.name); 
    const axis = CGVisual?.encoding.xAxes[0].attribute!;
    const axisValues = await helpers.getSpecificDataInfo(visual, axis!);
    const dataArray = CGVisual?.encoding.yAxes!;

    const additionalFilters = global.selectedTargets.filter(function (data: { target: { column: string; }; }) {
        return data.target.column != axis && dataArray.filter(yAxis => yAxis.attribute === data.target.column).length == 0;
    });

    const allAttributs = dataArray.map(yAxis => yAxis.attribute);
    const allDataString = helpers.dataToString(allAttributs);

    let visualInteractionInfo = helpers.getGeneralInteractionInfo(additionalFilters, allDataString);

    if(axisValues){
        visualInteractionInfo += helpers.getTargetInteractionFilter(axis);
    }
    visualInteractionInfo += ".";  

    return visualInteractionInfo;
}