import { getTraversalElement } from "./createSettings";
import {
  createGroup,
  createTraversalElement,
  createTraversalOfGroupNodes,
  getStandartCategories,
  getTraversalElem,
  groupType,
} from "./traversal";
import * as global from "./globalVariables";
import { currentVisuals } from "./globalVariables";
import { IGroupNode } from "../../UI/nodes-canvas/nodes/groupNode";

export async function basicTraversalStrategy() {
  const trav = [];
  const traversalElem = createTraversalElement("dashboard");
  traversalElem.element = await getTraversalElement("dashboard");
  trav.push(traversalElem);
  for (const vis of global.allVisuals) {
    const categories = getStandartCategories(vis.type);
    const traversalElem2 = createTraversalElement(vis.type);
    traversalElem2.element = await getTraversalElement(vis.name);
    traversalElem2.categories = categories;
    trav.push(traversalElem2);
  }
  const traversalElem1 = createTraversalElement("globalFilter");
  traversalElem1.element = await getTraversalElement("globalFilter");
  trav.push(traversalElem1);
  return trav;
}

export async function depthFirstTraversalStrategyOriginal() {
  const trav = [];
  const traversalElem = createTraversalElement("dashboard");
  traversalElem.element = await getTraversalElement("dashboard");
  trav.push(traversalElem);
  for (const vis of global.currentVisuals) {
    const categories = getStandartCategories(vis.type);
    for (const category of categories) {
      const traversalElem2 = createTraversalElement(vis.type);
      traversalElem2.element = await getTraversalElement(vis.name);
      traversalElem2.categories = [category];
      trav.push(traversalElem2);
    }
  }
  const traversalElem1 = createTraversalElement("globalFilter");
  traversalElem1.element = await getTraversalElement("globalFilter");
  trav.push(traversalElem1);
  return trav;
}

export async function martiniGlassTraversalStrategyOriginal() {
  const trav = [];
  const traversalElem = createTraversalElement("dashboard");
  traversalElem.element = await getTraversalElement("dashboard");
  trav.push(traversalElem);
  for (const vis of global.currentVisuals) {
    console.log("Global", global);
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
export async function martiniGlassTraversalStrategy() {
  const trav = [];
  try {
    debugger;
    const group = createGroup();
    const groupTrav1 = [];

    for (const vis of global.currentVisuals) {
      const traversalElem = createTraversalElement(vis.type);
      traversalElem.element = await getTraversalElement(vis.name);
      traversalElem.categories = ["general"];
      groupTrav1.push([traversalElem]);
    }

    group.visuals.push(groupTrav1);

    const traversalElem4 = createTraversalElement("group");
    traversalElem4.element = group;
    trav.push(traversalElem4);
  } catch (error) {
    console.log("Error in Martini", error);
  }

  return trav;
}

export async function depthFirstTraversalStrategy() {
  const trav = [];
  console.log("current visuals", currentVisuals);
  try {
    const group = createGroup();
    const groupTrav1 = [];

    const traversalElem1 = createTraversalElement("dashboard");
    traversalElem1.element = await getTraversalElement("dashboard");
    trav.push(traversalElem1);

    const traversalElemv11 = createTraversalElement(currentVisuals[0].type);
    traversalElemv11.element = await getTraversalElement(
      currentVisuals[0].name
    );
    traversalElemv11.categories = ["general"];
    groupTrav1.push(traversalElemv11);

    const traversalElemv11ia = createTraversalElement(currentVisuals[1].type);
    traversalElemv11ia.element = await getTraversalElement(
      currentVisuals[1].name
    );
    traversalElemv11ia.categories = ["insight"];
    groupTrav1.push(traversalElemv11ia);

    group.visuals.push(groupTrav1);
    group.type = groupType.all;

    const traversalElem4 = createTraversalElement("group");
    traversalElem4.element = group;
    trav.push(traversalElem4);
  } catch (error) {
    console.log("Error in testing", error);
  }
  debugger;
  return trav;
}
