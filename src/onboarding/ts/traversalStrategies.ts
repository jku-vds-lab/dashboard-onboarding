import { getTraversalElement } from "./createSettings";
import { createTraversalElement } from "./traversal";
import * as global from "./globalVariables";

export async function depthFirstTraversalStrategy() {
    const trav = [];
    const traversalElem = createTraversalElement("dashboard");
    traversalElem.element = await getTraversalElement("dashboard");
    trav.push(traversalElem);
    for (const vis of global.currentVisuals) {
      const traversalElem2 = createTraversalElement(vis.type);
      traversalElem2.element = await getTraversalElement(vis.name);
      traversalElem2.categories = ["general"];
      trav.push(traversalElem2);
      const traversalElem3 = createTraversalElement(vis.type);
      traversalElem3.element = await getTraversalElement(vis.name);
      traversalElem3.categories = ["insight"];
      trav.push(traversalElem3);
      const traversalElem4 = createTraversalElement(vis.type);
      traversalElem4.element = await getTraversalElement(vis.name);
      traversalElem4.categories = ["interaction"];
      trav.push(traversalElem4);
    }
    const traversalElem1 = createTraversalElement("globalFilter");
    traversalElem1.element = await getTraversalElement("globalFilter");
    trav.push(traversalElem1);
    return trav;
}

export async function martiniGlassTraversalStrategy() {
    const trav = [];
    const traversalElem = createTraversalElement("dashboard");
    traversalElem.element = await getTraversalElement("dashboard");
    trav.push(traversalElem);
    for (const vis of global.currentVisuals) {
        const traversalElem2 = createTraversalElement(vis.type);
        traversalElem2.element = await getTraversalElement(vis.name);
        traversalElem2.categories = ["general"];
        trav.push(traversalElem2);
    }
    for (const vis of global.currentVisuals) {
        const traversalElem3 = createTraversalElement(vis.type);
        traversalElem3.element = await getTraversalElement(vis.name);
        traversalElem3.categories = ["insight"];
        trav.push(traversalElem3);
    }
    for (const vis of global.currentVisuals) {
        const traversalElem4 = createTraversalElement(vis.type);
        traversalElem4.element = await getTraversalElement(vis.name);
        traversalElem4.categories = ["interaction"];
        trav.push(traversalElem4);
    }
    const traversalElem1 = createTraversalElement("globalFilter");
    traversalElem1.element = await getTraversalElement("globalFilter");
    trav.push(traversalElem1);
    return trav;
}