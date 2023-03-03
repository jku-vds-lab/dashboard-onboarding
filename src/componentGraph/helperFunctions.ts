import { IFilterMeasureTarget, IFilterColumnTarget } from "powerbi-models";
import { VisualDescriptor, Page } from "powerbi-client";
import 'powerbi-report-authoring';
import * as helper from "../onboarding/ts/helperFunctions";
import { visuals } from "./ComponentGraph";
import { exportData } from "../Provenance/utils";

/*
Get encoding of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualAttributeMapper(visual: VisualDescriptor): Promise<{ [key: string]: string }> {
	const mapper: { [key: string]: string } = {};

	if (visual.getCapabilities) {
		const capabilities = await visual.getCapabilities();
		if (capabilities.dataRoles) {
			await Promise.all(capabilities.dataRoles.map(async (role) => {
				const dataFields = await visual.getDataFields(role.name);
				if (dataFields.length > 0) {
					await Promise.all(dataFields.map(async (d, idx) => {
						const attribute = await visual.getDataFieldDisplayName(role.name, idx);
						if (role.displayName) {
						const role_display_name = await role.displayName
						mapper[attribute] = role_display_name;
						}
					}));
				}
			}))
		}
	}
	return mapper;
}

/**
 * Takes string and returns multiple word string as one word camel case string
 * @param title String to be camel cased
 */
export function toCamelCaseString(title: string): string {
	return title
		.split(' ')
		.map((t, i) => i === 0 ? t : t[0].toUpperCase() + t.slice(1))
		.join('');
}

/*
Get type of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export function getVisualType(visual: VisualDescriptor): string {
	return visual.type;
}

/*
Get title of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export function getVisualTitle(visual: VisualDescriptor): string  {
	return visual.title;
}

/*
Get description of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualDescription(visual: VisualDescriptor): Promise<string>  {
let description = ""
	const VisualType = visual.type
	switch(VisualType){
		case 'card':
			description = "This element is a card. Cards display the most important facts of a report."
			break;
		case 'slicer':
			description = "This element is a slicer. Slicers act as filters for the report."
			break;
		case 'lineChart':
			description = "This element is a line chart."
			break;
		case 'clusteredBarChart':
			description = "This element is a clusterd bar chart."
			break;
		case 'lineClusteredColumnComboChart':
			description = "This element is a line clustered column combo chart. It can combine lines and bars in one chart."
			break;
		default:
			description = "This type of visual is not supported yet";
			break;
	}
return description
}

/*
Get task of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualTask(visual: VisualDescriptor): Promise<string>  {
	let task = ""
		const VisualType = visual.type
		switch(VisualType){
			case 'card':
				task = "summarize"
				break;
			case 'slicer':
				task = "discover, derive and explore"
				break;
			case 'lineChart':
				task = "show trends"
				break;
			case 'clusteredBarChart':
				task = "show part-to-whole relationship, lookup values and find trends"
				break;
			case 'lineClusteredColumnComboChart':
				task = "compare, lookup values and find trends"
				break;
			default:
				task = "This type of visual is not supported yet";
				break;
		}
	return task
	}

/*
Get data fields of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualDataFields(visual: VisualDescriptor): Promise<Array<string>>{
	const DataFields: Array<string> = [];

	if (visual.getCapabilities) {
		const capabilities = await visual.getCapabilities();
		if (capabilities.dataRoles) {
			await Promise.all(capabilities.dataRoles.map(async (role) => {
				const dataFields = await visual.getDataFields(role.name);
				if (dataFields.length > 0) {
					await Promise.all(dataFields.map(async (d, idx) => {
						const attribute = await visual.getDataFieldDisplayName(role.name, idx);
						DataFields.push(attribute)
					}));
				}
			}))
		}
	}
	return DataFields;
}

/*
Get the global filter
@param page (Page) (https://learn.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/page.page)
*/
export async function getPageFilters(page: Page): Promise<Array<Record<string, unknown>>>{
	const FiltersCollectionArray = []
	const GlobalFilters = await page.getFilters()
	for (const x in GlobalFilters){
		const FiltersCollection = {}
		if ("target" in GlobalFilters[x]){
			if ("table" in GlobalFilters[x]["target"]){
				FiltersCollection["table"] = GlobalFilters[x]["target"]["table"]
			}
		}
		if ("target" in GlobalFilters[x]){
			if ("column" in GlobalFilters[x]["target"]){
				FiltersCollection["attribute"] = GlobalFilters[x]["target"]["column"]
			}
		}
		if ("operator" in GlobalFilters[x]){
			FiltersCollection["operator"] = GlobalFilters[x]["operator"]
		}
		if ("values" in GlobalFilters[x]){
			FiltersCollection["values"] = GlobalFilters[x]["values"]
		}
		if ("conditions" in GlobalFilters[x]){
			FiltersCollection["values"] = GlobalFilters[x]["conditions"]
		}
		FiltersCollectionArray.push(FiltersCollection)
	}
return FiltersCollectionArray
}

/*
Get the local filter
@param visual visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualFilters(visual: VisualDescriptor): Promise<Array<Record<string, unknown>>>{
	const FiltersCollectionArray = []
	const LocalFilters = await visual.getFilters()
	for (const x in LocalFilters){
		const FiltersCollection = {}
		if ("target" in LocalFilters[x]){
			if ("table" in LocalFilters[x]["target"]){
				FiltersCollection["table"] = LocalFilters[x]["target"]["table"]
			}
		}
		if ("target" in LocalFilters[x]){
			if ("column" in LocalFilters[x]["target"]){
				FiltersCollection["attribute"] = LocalFilters[x]["target"]["column"]
			}
			if ("measure" in LocalFilters[x]["target"]){
				FiltersCollection["attribute"] = LocalFilters[x]["target"]["measure"]
			}
		}
		if ("logicalOperator" in LocalFilters[x]){
			FiltersCollection["operator"] = LocalFilters[x]["logicalOperator"]
		}
		if ("operator" in LocalFilters[x]){
			FiltersCollection["operator"] = LocalFilters[x]["operator"]
		}
		if ("values" in LocalFilters[x]){
			FiltersCollection["values"] = LocalFilters[x]["values"]
		}
		if ("conditions" in LocalFilters[x]){
			FiltersCollection["values"] = LocalFilters[x]["conditions"]
		}
		FiltersCollectionArray.push(FiltersCollection)
	}
return FiltersCollectionArray
}

/*
Get mark of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export function getVisualMark(visual: VisualDescriptor): string {
	let mark = ""
		const VisualType = visual.type
		switch(VisualType){
			case 'card':
				mark = "Value"
				break;
			case 'slicer':
				mark = "Value"
				break;
			case 'lineChart':
				mark = "Line"
				break;
			case 'clusteredBarChart':
				mark = "Bar"
				break;
			case 'lineClusteredColumnComboChart':
				mark = "Line or Bar"
				break;
			default:
				mark = "This type of visual is not supported yet";
				break;
		}
	return mark
	}

/*
Get visual channel of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualChannel(visual: VisualDescriptor): Promise<Array<string> > {
	const visual_channel = []
		const VisualType = visual.type
		if (VisualType === 'lineChart' || VisualType === 'clusteredBarChart' || VisualType === 'lineClusteredColumnComboChart') {
			visual_channel.push('position')
			const encoding = await getVisualAttributeMapper(visual)
			if (Object.values(encoding).includes("Legend") || Object.values(encoding).includes("Column y-axis")) {
				visual_channel.push('color')
			}
		}
	return visual_channel
}

/*
Get insight of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualInsight(visual: VisualDescriptor): Promise<Array<string> > {
	const insights = new Array<string>();
	const VisualType = visual.type
		switch(VisualType){
			case 'card':
				const dataName = await getFieldMeasure(visual, "Values");
    			const dataValue = await helper.getSpecificDataInfo(visual, dataName);
				insights[0] = "You can see that the value of " + dataName + " is " + dataValue + ".";
				break;
			case 'slicer':
				break;
			case 'lineClusteredColumnComboChart':
				await getLineClusteredColumnComboChartInsights(visual, insights);
				break;
			case 'lineChart':
				await getDefaultInsights(visual, insights);
				break;
			case 'clusteredBarChart':
				await getDefaultInsights(visual, insights);
				break;
			default:
				insights[0] = "This type of visual is not supported yet";
				break;
		}
	return insights;
}

/*
Get interactions of the visualization
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
*/
export async function getVisualInteractions(visual: VisualDescriptor): Promise<Record<string, string[]>> {
	const interactions = {}

	interactions["interaction_attribute"] =  await getVisualDataFields(visual);

	const crossInteractionVisuals = visuals.filter(currentVisual => currentVisual.name != visual.name)
	interactions["interaction_charts"] = crossInteractionVisuals.map(currentVisual => currentVisual.name);

	return interactions;
}

/*
Get measure of the data field
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
@param fieldName (string)
*/
export async function getFieldMeasure(visual: VisualDescriptor, fieldName: string): Promise<string> {
    let measure = "";
    const fields = await visual.getDataFields(fieldName) as IFilterMeasureTarget[];
    if(fields.length != 0){
        measure = fields[0].measure;
    }
    return measure;
}

/*
Get column of the data field
@param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
@param fieldName (string)
*/
export async function getFieldColumn(visual: VisualDescriptor, fieldName: string): Promise<string>{
    let column = "";
    const fields = await visual.getDataFields(fieldName) as IFilterColumnTarget[];
    if(fields.length != 0){
        column = fields[0].column;
    }
    return column;
}

export async function getSpecificDataPoint(visualData: Map<string, string>[], legendName: string, selectedLegendValue: string, dataName: string, axisName:string, selectedAxisValue:string){
	const axisData = visualData.filter(dataMap => dataMap.get(axisName) === selectedAxisValue);

	switch(axisData.length){
		case 0:
			return "0";
		case 1:
			return axisData[0].get(selectedLegendValue);
		default:
			const legendData = axisData.filter(dataMap => dataMap.get(legendName) === selectedLegendValue);
			switch(legendData.length){
				case 0:
					return "0";
				case 1:
					return legendData[0].get(dataName);
				default:
					let sum = 0;
					for(const dataPoint of legendData){
						const data = dataPoint.get(dataName);
						if(data){
							sum += parseInt(data);
						}
					}
					return sum;	
			}
	}
}

export async function getHighestCategory(visualData: Map<string, string>[], dataName:string, legendValues:string[], legendName: string){
	const sums = [];

	for (const legendValue of legendValues) {
		const legendData = visualData.filter(dataMap => dataMap.get(legendName) === legendValue);	
		let sum = 0;	
		for (const dataPoint of legendData) {
			const data = dataPoint.get(dataName);
			if(data){
				sum += parseInt(data);
			}
		}	
		sums.push(sum);
	}

	const position = sums.indexOf((Math.max(...sums)));
	return legendValues[position];
}

export async function getHighestValue(visualData: Map<string, string>[], dataName:string, legendValues:string[], legendName:string, axisName:string, axisValues:string[]){
	let max = Number.MIN_SAFE_INTEGER;
	let highestCategory = "";
	let highestAxis = "";

	for (const legendValue of legendValues) {
		const legendData = visualData.filter(dataMap => dataMap.get(legendName) === legendValue);
		const sums = [];
		for (const axisValue of axisValues) {
			const axisData = legendData.filter(dataMap => dataMap.get(axisName) === axisValue);
			let sum = 0;
			for (const axisDataPoint of axisData) {
				const data = axisDataPoint.get(dataName);
				if(data){
					sum += parseInt(data);
				}
			}
			sums.push(sum);
		}
		const localMax = Math.max(...sums);
		if(localMax > max){
			max = localMax;
			highestCategory = legendValue;
			const position = sums.indexOf(max);
			if(axisValues[position]){
				highestAxis = axisValues[position];
			}
		}
	}

    return [max, highestCategory, highestAxis];
}

export async function getData(visual: any, categories: string[]){
    const exportedData = await exportData(visual);
	if(!exportedData){
		return null;
	}
	const visualData = exportedData.data;
	const data = [];

    const headers = visualData.slice(0, visualData.indexOf('\r')).split(',');
    const rows = visualData.slice(visualData.indexOf('\n') + 1).split(/\r?\n/);
    rows.pop();

	if(categories.length > 0){
		for (const row of rows) {
			const values = row.split(',');
			for (const category of categories) {
				const rowData = new Map<string, string>();
				for (let i = 0; i < headers.length; i++) {
					if(categories.includes(headers[i])){
						if(headers[i] === category){
				 			rowData.set("Category", category);
				 			rowData.set("Value", values[i]);
				 		}
					} else {
				 		rowData.set(headers[i], values[i]);
					}
				}
				data.push(rowData);
        	}
		}
	} else {
		for (const row of rows) {
			const values = row.split(',');
			const rowData = new Map<string, string>();
			for (let i = 0; i < headers.length; i++) {
				rowData.set(headers[i], values[i]);
			}
			data.push(rowData);
		}
    }

	return data;
}

export async function getLineClusteredColumnComboChartInsights(visual: any, insights: string[]){
	const axis = await helper.getFieldColumn(visual, "Category");
	const axisValues = await helper.getSpecificDataInfo(visual, axis);
	const columnSeries = await helper.getFieldMeasures(visual, "Series");
	const columnValues = await helper.getFieldMeasures(visual, "Y");
	const lineValues = await helper.getFieldMeasures(visual, "Y2");

	const columnData = columnSeries.concat(columnValues);
	const allData = columnData.concat(lineValues);

	const middelOfXValues = Math.floor(axisValues.length/2);
	const middelOfYValues = Math.floor(allData.length/2);

	const visualData = await getData(visual, allData);
	if(!visualData){
		return;
	}

	const value = await getSpecificDataPoint(visualData, "Category", allData[middelOfYValues], "Value", axis, axisValues[middelOfXValues]);
	const highestCategory = await getHighestCategory(visualData, "Value", allData, "Category");
	const highestValue = await getHighestValue(visualData, "Value", allData, "Category", axis, axisValues);

	insights[0] = "A value of " + value + " " + allData[middelOfYValues] + " was measured for " + axisValues[middelOfXValues] + ".";
	insights[1] = "On average " + highestCategory + " has higher values than any other category.";
	insights[2] = "The highest value " + highestValue[0] + " was measured for " + highestValue[1] + " and " + highestValue[2] + ".";
}

export async function getDefaultInsights(visual: any, insights: string[]){
	const axes = await helper.getFieldColumns(visual, "Category");
	const axisValues = await helper.getSpecificDataInfo(visual, axes[0]);
	const dataName = await helper.getFieldMeasure(visual, "Y");
	const legend = await helper.getFieldColumn(visual, "Series");
	const legendValues = await helper.getSpecificDataInfo(visual, legend);

	const middelOfYValues = Math.floor(axisValues.length/2);
	const middelOfLegendValues = Math.floor(legendValues.length/2);

	const visualData = await getData(visual, []);
	if(!visualData){
		return;
	}

	const value = await getSpecificDataPoint(visualData, legend, legendValues[middelOfLegendValues], dataName, axes[0], axisValues[middelOfYValues]);
	const highestCategory = await getHighestCategory(visualData, dataName, legendValues, legend);
	const highestValue = await getHighestValue(visualData, dataName, legendValues, legend, axes[0], axisValues);

	insights[0] = "A value of " + value + " " + dataName + " was measured for " + axisValues[middelOfYValues] + " and " + legendValues[middelOfLegendValues] + ".";
	insights[1] = "On average " + highestCategory + " has higher values than any other category.";
	insights[2] = "The highest value of " + highestValue[0] + " " + dataName + " was measured for " + highestValue[1] + " and " + highestValue[2] + ".";
}