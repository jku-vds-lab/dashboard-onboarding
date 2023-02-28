import { Report } from "report";
import { setupProvenance } from "./Provenance";
import { IAppState } from "./interfaces";
import { exportData, toCamelCaseString, getCurrentVisuals, makeDeepCopy, getVisualAttributeMapper, getReportPage} from "./utils";
import { Provenance } from "@visdesignlab/trrack";
import 'powerbi-report-authoring';
import { IExportDataResult } from "powerbi-models";
import { componentGraph } from "../onboarding/ts/globalVariables";

export const provenance: Provenance<IAppState, string, void> = {} as Provenance<IAppState, string, void>;
/**
 * Sets provenance
 * @param newProvenance: any
 */
function setProvenance(newProvenance: any) {
	Object.keys(newProvenance).forEach((key) => {
		provenance[key as keyof Provenance<IAppState, string, void>] = newProvenance[key];
	});
}
/**
 * Captures and returns a base64-serialization string, which represents the current state of the report.
 * @param report Report
 */
async function makeBookmark(report: Report){
	const capturedBookmark = await report.bookmarksManager.capture({
		allPages: true,
		personalizeVisuals: true
	}); 

	return capturedBookmark.state
}

class Provectories {
	private readonly appState: IAppState;
	private readonly report: Report;

	constructor(report: Report) {
		this.appState = {};
		this.report = report;
		this.init();
	}

	/**
	 * Sets the selected attribute of given visuals extracted from the click-event
	 * Only possible if report is loaded
	 * @param event click-event from dashboard eventlistener
	 */
	setVisSelected(event: any): string {
		const { dataPoints } = event.detail;
		const { type, title } = event.detail.visual;
		const visuals = this.appState;
		let label = `${title} (${type}) - `;
		// clears non slicer values when non slicer selection
		if (type !== 'slicer') {
			Object.keys(visuals).forEach((key) => {
				const visDesc = visuals[key];
				visDesc.selected = visDesc.type !== 'slicer' ? null : visDesc.selected;
			});
		}
		// asign selected values
		const visDesc = visuals[toCamelCaseString(title)];
		if (dataPoints.length > 0) {
			const selections: { [key: string]: string[] } = {};

			dataPoints.forEach((point: any) => {
				point.identity.forEach((i: any) => {
					selections[i.target.column] = [...(selections[i.target.column] ? selections[i.target.column] : []), i.equals];
				});
			});

			Object.keys(selections).forEach((key, i) => {
				label += `${i > 0 ? '. ' : ''}${key}: `;
				visDesc.selected = { ...visDesc.selected, [key]: Array.from(new Set(selections[key])) };
				selections[key].forEach((value, j) => {
					label += `${j > 0 ? ', ' : ''}${value}`;
				})
			})
			return label + ' selected';
		}
		visDesc.selected = null;
		return label + 'deselected';
	}

	/**
	 * Sets thex current state of all visuals of the dashboard on given appState
	 * Only possible if report is loaded
	 * @param appState appState object of which the visuals should be set
	 */
	async setVisState(appState: IAppState): Promise<IAppState> {
		const visuals = await getCurrentVisuals(this.report);
		const exportedData: { [visualTitle: string]: IExportDataResult | null } = {};
		// go through all async calls at the beginning so the exportData doesn't change
		// because of another dashboard event
		await Promise.all(visuals.map(async (v) => {
			exportedData[toCamelCaseString(v.title)] = await exportData(v);
		}));

		Object.keys(exportedData).forEach(async (key) => {
			const result = exportedData[key];
			if (!result) {
				return;
			}
			// vectorize data string && remove last row (empty)
			const data = result.data.replaceAll("\n", "").split('\r').map((d) => d.split(',')).slice(0, -1);
			const groupedData: { [key: string]: any[] } = {};
			const { visState, categoryMapper } = appState[key];

			// group data columnwise
			data[0].forEach((header, index) => {
				const key = toCamelCaseString(header);
				groupedData[key] = [];
				const currSet = groupedData[key];

				data.forEach((row, idx) => {
					// skip headers and empty values
					if (idx === 0 || !row[index]) {
						return;
					}
					const cell = row[index];
					const number = cell.match(/\d+/);
					currSet.push(number ? parseInt(number[0]) : cell);
				});
			});

			// assign to visual state in right format
			Object.keys(groupedData).forEach((key) => {
				const currArr: string[] | number[] = Array.from(groupedData[key]);
				visState[key] = categoryMapper[key] === 'Y' ?
					(currArr as number[]) : Array.from(new Set(currArr as string[]));
			});
		});
		return appState;
	}

	/**	
	* Initialize appState
	* Only possible if report is loaded
	*/
	async initAppState() {
		const visuals = await getCurrentVisuals(this.report);
		await Promise.all(visuals.map(async (v) => { // get initial slicer selection
			let selected: null | { [key: string]: string[] } = null
			if (v.type === 'slicer') {
				const slicerState = await v.getSlicerState();
				selected = {};
				if (slicerState.filters.length > 0) {
					slicerState.filters.forEach((filter: any) => {
						if (!selected![filter.target.column]) {
							selected![filter.target.column] = [];
						}
						selected![filter.target.column].push(...filter.values.map((vals: string | number) => vals));
					});
				}
			}
			const categoryMapper = await getVisualAttributeMapper(v);
			// console.log(
			// 	'visual type:::', await getVisualType(v), '\n',
			// 	'visual task:::', await getVisualTask(v), '\n',
			// 	'visual description:::', await getVisualDescription(v), '\n',
			// 	'visual title:::', await getVisualTitle(v), '\n',
			// 	'visual data:::', await getVisualDataFields(v), '\n',
			// 	'visual interactions:::', await getVisualnteractions(v), '\n',
			// 	'visual mark:::', await getVisualMark(v), '\n',
			// 	'visual channel:::', await getVisualChannel(v), '\n',
			// 	'visual encoding:::', categoryMapper, '\n',
			// 	'visual insight:::', await getVisualInsight(v), '\n'
			// )
			const title = toCamelCaseString(v.title);
			if (this.appState && !this.appState[title]) {
				this.appState[toCamelCaseString(title)] = { selected, type: v.type, visState: {}, categoryMapper };
			}
		}));
	}

	/**
	 * initializes provenance, click-event handler and the appState
	 */
	async init(): Promise<void> {
		await this.initAppState();
		const appState = await this.setVisState(this.appState);
		const { actions, provenance } = setupProvenance(appState);

		setProvenance(provenance);
		const activePage = (await this.report.getActivePage()).name;
		/* The dataSelected event is raised when a specific data point is selected. However, it does not work for slicers, because
		the worflow is as follows: dataSelected event -> rendered event -> state is updated */
		this.report?.on("dataSelected", async (event: {detail:{dataPoints:any[]}}) => {
			/* used closure to check if the current page equals the page provenance is initialized on
			otherwise the provenance would make no sense for this case */
			if (activePage === (await this.report.getActivePage()).name) {
				const label = this.setVisSelected(event);
				const bookmark = {bookmark: await makeBookmark(this.report), report: this.report};
				/* function call is done in provenance for better performance on the dashboard */
				const onDashboardClick = async () => {
					const appState = await this.setVisState(makeDeepCopy(this.appState));
					return { newState: appState, label, updateProv: false, eventType: 'dataSelected', bookmark, graph: null };
				};
				actions.event(onDashboardClick);
			} else {
				console.log("Not on the tracked page");
			}
		});
		/* The rendered event is raised when a report is fully rendered. It works for slicers. */
		this.report?.on("rendered", async () => {
			if (activePage === (await this.report.getActivePage()).name) {
				await new Promise(r => setTimeout(r, 150));
				const label = 'null';
				const bookmark = {bookmark: await makeBookmark(this.report), report: this.report};

				const onDashboardClick = async () => {
					const appState = await this.setVisState(makeDeepCopy(this.appState));
					return { newState: appState, label, updateProv: true, eventType: 'rendered', bookmark, graph: null };
				};
				actions.event(onDashboardClick);
			} else {
				console.log("Not on the tracked page");
			}
		});

		/* Once the report is loaded, initial bookmark is generated */
		const bookmark = {bookmark: await makeBookmark(this.report), report: this.report};
		const onDashboardClick = async () => {
			const appState = await this.setVisState(makeDeepCopy(this.appState));
			return { newState: appState, label: 'root', updateProv: true, eventType: 'loaded', bookmark, graph: componentGraph };
		};
		actions.event(onDashboardClick);
		
	}
}

export function provectories(report: Report): void {
	new Provectories(report);
}