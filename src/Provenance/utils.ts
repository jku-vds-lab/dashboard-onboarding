import { Report } from "report";
import { IExportDataResult } from "powerbi-models";
import { models, VisualDescriptor } from "powerbi-client";
import 'powerbi-report-authoring';
/**
 * Create exact copy of object without referencing on it
 * @param obj Object to copy
 */
export function makeDeepCopy<T>(obj: T): T {
	return typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj;
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

/**
 * Exports underlying data of given visual and handles errors
 * @param visual Visual to get underlying data from
 */
export async function exportData(visual: VisualDescriptor): Promise<IExportDataResult | null> {
	// starting on 12/16/2021, exportData throws error.
	// If call exportData repeatedly a few times then it starts to work.
	// Implement pattern to try 4 times before throwing an error

	let tries = 0;
	let result: models.IExportDataResult | null = null;
	while (tries < 4) {
		try {
			result = await visual.exportData(models.ExportDataType.Summarized);
			break;
		} catch (err) {
			tries++;
			if (tries === 4) {
				console.error(('exportData - ' + visual.title), err);
			}
		}
	}
	return result;
}

/**
 * Extracts current visuals from a dashboard of a report and returns them in an array
 * @param report Report to extract visuals from
 * Only possible if report is loaded
 */
export async function getCurrentVisuals(report: Report): Promise<VisualDescriptor[]> {
	try {
		const vd: VisualDescriptor[] = await report
		.getPages().then(async (pages) => pages.filter((page) => page.isActive)[0]
			.getVisuals().then((visuals) => visuals
				.filter((v) =>  v.type !== 'shape' && v.type !== 'textbox')));
		return vd
	} catch (err) {
		console.error(err);
		return [];
	}
}

/**
 * Get encoding of the visualization
 * @param visual (VisualDescriptor) (https://learn.microsoft.com/ru-ru/javascript/api/powerbi/powerbi-client/visualdescriptor.visualdescriptor)
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
						mapper[toCamelCaseString(attribute)] = role_display_name;
						}
					}));
				}
			}))
		}
	}
	return mapper;
}

/**
 * Get active page of the report
 * @param report (Report)
 */
export async function getReportPage(report: Report){
	const page = await report.getActivePage()
	return page
}