import { createTraversalElement } from "../onboarding/ts/traversal";
import { getTraversalElement } from "../onboarding/ts/createSettings";
import { visuals, getComponentGraph} from "../componentGraph/ComponentGraph";


const lookup: any = {
    "id": "name"
}

type Dict = {
    [key: string]: number;
  };

export async function setProvenanceTraversalStrategy(prov: any){
    //explain the dashboard first
    const trav = [];
    const traversalElem1 = createTraversalElement("dashboard");
    traversalElem1.element = await getTraversalElement("dashboard");
    trav.push(traversalElem1);
    // explain global filters
    const traversalGlobalFilterElem = createTraversalElement("globalFilter");
    traversalGlobalFilterElem.element = await getTraversalElement("globalFilter");
    trav.push(traversalGlobalFilterElem);
    // explain cards
    const card = visuals.filter(v => v.type === 'card')
    for (const val of card){
        const traversalCardElem = createTraversalElement(val.type);
        traversalCardElem.element = await getTraversalElement(val.name);
        trav.push(traversalCardElem);
    }
    // explain the remaining five visulas according to the clicks frequency
    const labels = []

    for (const key in prov) {
      labels.push((prov[key].label.split('-')[0]).split(' (')[0])
    }
    const counts: Dict = {};

    for (const num of labels) {
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    const _sort = (a: string, b:string) => {
        return counts[b] - counts[a]
    }
    const vis = Object.fromEntries(visuals.map(i => [i.title, i]))
    const sorted = Object.keys(counts).sort(_sort).filter((i) => i !== 'Page Reloaded' && i !== 'Root' && i !== 'Data Changed')
    const charts_for_traversal = []

    for (const k in sorted) {
        const obj = Object.keys(vis).filter((key)=>key===sorted[k]).reduce((cur, key) => { return Object.assign(cur, { [key]: vis[key] })}, {})
        const chart_for_traversal = Object.keys(obj).map(key => obj[key])[0];
        charts_for_traversal.push(chart_for_traversal)
        const traversalElem = createTraversalElement(chart_for_traversal.type);
        traversalElem.element = await getTraversalElement(chart_for_traversal.name);
        trav.push(traversalElem);
    }

    for (const vis of visuals){
        if (!charts_for_traversal.includes(vis) && vis.type !== 'card'){
            const traversalElem = createTraversalElement(vis.type);
            traversalElem.element = await getTraversalElement(vis.name);
            trav.push(traversalElem);
        }
    }
    return trav
}

function getRoot(prov: any){
    for(const key in prov){
        if (prov[key].label === 'Root'){
            return key;
        }
    }
}

function treeTraversal(prov: any){
    const rootNode = getRoot(prov);
    const traversal = [];
    // traverse the tree like a DFS
    const stack = [];
    stack.push(rootNode);
    while(stack.length > 0){
        const node: any = stack.pop();
        const children: any = prov[node].children;
        for (const child of children){
            const traversalElem = [prov[node].label, prov[child].label];
            traversal.push(traversalElem);
            stack.push(child);
        }
    }
    return traversal; 
}

function getVisuals(visual: any){
    // get description, title, type, task, mark, attributes from the visual
    const description = visual.description;
    const title = visual.title;
    const type = visual.type;
    const task = visual.task;
    const mark = visual.mark;
    const attributes = visual.data.attributes;
    const visualElem = {
        "description": description,
        "title": title.text,
        "type": type,
        "task": task,
        "mark": mark,
        "attributes": attributes
    }
    return visualElem;
}

export async function setProvenanceTraversalStrategyLLM(prov: any){
    const transitions: Array<Array<string>> = treeTraversal(prov);
    const cg = getComponentGraph().dashboard;
    const body: any = {}
    body["layout"] = cg.layout;
    body.purpose = cg.purpose;
    body["task"] = cg.task;
    body["visuals"] = []

    for (const visual of cg.visualizations){
        const visualElem = getVisuals(visual);
        body["visuals"].push(visualElem);
    }
    body["interactions"] = [{"sequence":transitions}]
    // endpoints:chatgpt, dfs, bfs
    const resp = await fetch('http://localhost:8000/provenance/chatgpt', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    const data = await resp.json();
    const trav = [];
    console.log('DATA ORDER', data.order)
    for (const val of data.order){
        const traversal_visual = visuals.filter(v => v.type === val.type && v.title == val.title)[0]
        const traversaElem = createTraversalElement(traversal_visual.type);
        traversaElem.element = await getTraversalElement(traversal_visual.name);
        trav.push(traversaElem);
    }
    console.log('TRAVERSAL (LLM/DFS/BFS) STRATEGY', trav)
    return trav;
}