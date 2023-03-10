import Dashboard from './Dashboard';
import { Report, Page } from "powerbi-client";
import { setComponentGraph } from '../onboarding/ts/globalVariables';

export let report: Report;
export let page: Page;
export let visuals: any[];

class ComponentGraph {
    dashboard: Dashboard;
  
    constructor(newReport: Report, newPage: Page, newVisuals: any[]) {
      this.dashboard = new Dashboard();
      report = newReport;
      page = newPage;
      visuals = newVisuals;
    }

    async setComponentGraphData(){
      await this.dashboard.setDashboardData();
      localStorage.setItem("componentGraph", JSON.stringify({"dashboard": this.dashboard}, replacer));
      setComponentGraph(getComponentGraph());
    }
  }

  //how to create component graph and test if it is correct:
  //let graph = new ComponentGraph(report, page, visuals);
  //await graph.setComponentGraphData();
  //getComponentGraph();

  //how to update a veriable of the component graph:
  //let componentGraph = getComponentGraph();
  //componentGraph.dashboard.task = "test";
  //saveComponentGraph(componentGraph);

export default ComponentGraph;

export function saveComponentGraph(graph: any){
  localStorage.setItem("componentGraph", JSON.stringify(graph, replacer));
  setComponentGraph(getComponentGraph());
}

export function getComponentGraph(){
  const componentGraph = JSON.parse(localStorage.getItem("componentGraph")!, reviver);
  return componentGraph;
}

function replacer(key: string, value: any) {
  if(value instanceof Map) {
    return Object.fromEntries(value);
  } else {
    return value;
  }
}

function reviver(key: string, value: any) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}