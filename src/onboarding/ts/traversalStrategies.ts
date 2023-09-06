import { getTraversalElement } from "./createSettings";
import {
  createGroup,
  createTraversalElement,
  getStandartCategories,
  groupType,
} from "./traversal";
import * as global from "./globalVariables";

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

export async function depthFirstTraversalStrategy() {
  const trav = [];
  // "current visuals", currentVisuals);
  try {
    const traversalElem1 = createTraversalElement("dashboard");
    traversalElem1.element = await getTraversalElement("dashboard");
    traversalElem1.count = 1;
    trav.push(traversalElem1);

    const traversalElem2 = createTraversalElement("globalFilter");
    traversalElem2.element = await getTraversalElement("globalFilter");
    traversalElem2.count = 1;
    trav.push(traversalElem2);

    const groupFilters = createGroup();
    groupFilters.type = groupType.atLeastOne;
    const groupGeneralVis = createGroup();
    groupGeneralVis.type = groupType.atLeastOne;
    const groupOtherVis = createGroup();
    groupOtherVis.type = groupType.all;

    for (const vis of global.currentVisuals) {
      const groupTrav = [];
      const categories = getStandartCategories(vis.type);

      for (const category of categories) {
        const traversalElem = createTraversalElement(vis.type);
        traversalElem.element = await getTraversalElement(vis.name);
        traversalElem.count = 1;
        traversalElem.categories = [category];
        groupTrav.push(traversalElem);
      }
      switch (vis.type) {
        case "card":
        case "multiRowCard":
          groupGeneralVis.visuals.push(groupTrav);
          break;
        case "slicer":
          groupFilters.visuals.push(groupTrav);
          break;
        default:
          groupOtherVis.visuals.push(groupTrav);
      }
    }

    if (groupFilters.visuals.length > 0) {
      const traversalElem3 = createTraversalElement("group");
      traversalElem3.count = 1;
      traversalElem3.element = groupFilters;
      trav.push(traversalElem3);
    }

    if (groupGeneralVis.visuals.length > 0) {
      const traversalElem4 = createTraversalElement("group");
      traversalElem4.count = 2;
      traversalElem4.element = groupGeneralVis;
      trav.push(traversalElem4);
    }

    if (groupOtherVis.visuals.length > 0) {
      const traversalElem5 = createTraversalElement("group");
      traversalElem5.count = 3;
      traversalElem5.element = groupOtherVis;
      trav.push(traversalElem5);
    }
  } catch (error) {
    console.log("Error in testing", error);
  }
  return trav;
}

export async function similarVisTraversalStrategy() {
  const trav = [];
  // "current visuals", currentVisuals);
  try {
    const groupFilters = createGroup();
    groupFilters.type = groupType.onlyOne;
    const groupGeneralVis = createGroup();
    groupGeneralVis.type = groupType.onlyOne;
    const groupOtherVis = createGroup();
    groupOtherVis.type = groupType.all;

    for (const vis of global.currentVisuals) {
      const groupTrav = [];
      const categories = getStandartCategories(vis.type);

      for (const category of categories) {
        const traversalElem = createTraversalElement(vis.type);
        traversalElem.element = await getTraversalElement(vis.name);
        traversalElem.count = 1;
        traversalElem.categories = [category];
        groupTrav.push(traversalElem);
      }
      switch (vis.type) {
        case "card":
        case "multiRowCard":
          groupGeneralVis.visuals.push(groupTrav);
          break;
        case "slicer":
          groupFilters.visuals.push(groupTrav);
          break;
        default:
          groupOtherVis.visuals.push(groupTrav);
      }
    }

    if (groupFilters.visuals.length > 0) {
      const traversalElem3 = createTraversalElement("group");
      traversalElem3.count = 1;
      traversalElem3.element = groupFilters;
      trav.push(traversalElem3);
    }

    if (groupGeneralVis.visuals.length > 0) {
      const traversalElem4 = createTraversalElement("group");
      traversalElem4.count = 2;
      traversalElem4.element = groupGeneralVis;
      trav.push(traversalElem4);
    }

    if (groupOtherVis.visuals.length > 0) {
      const traversalElem5 = createTraversalElement("group");
      traversalElem5.count = 3;
      traversalElem5.element = groupOtherVis;
      trav.push(traversalElem5);
    }
  } catch (error) {
    console.log("Error in testing", error);
  }
  return trav;
}

export async function filterFirstTraversalStrategy() {
  const trav = [];
  // "current visuals", currentVisuals);
  try {
    const traversalElem1 = createTraversalElement("dashboard");
    traversalElem1.element = await getTraversalElement("dashboard");
    traversalElem1.count = 1;
    trav.push(traversalElem1);

    const traversalElem2 = createTraversalElement("globalFilter");
    traversalElem2.element = await getTraversalElement("globalFilter");
    traversalElem2.count = 1;
    trav.push(traversalElem2);

    const groupFilters = createGroup();
    groupFilters.type = groupType.atLeastOne;
    const groupGeneralVis = createGroup();
    groupGeneralVis.type = groupType.atLeastOne;
    const groupOtherVis = createGroup();
    groupOtherVis.type = groupType.all;

    for (const vis of global.currentVisuals) {
      const groupTrav = [];
      const categories = getStandartCategories(vis.type);

      for (const category of categories) {
        const traversalElem = createTraversalElement(vis.type);
        traversalElem.element = await getTraversalElement(vis.name);
        traversalElem.count = 1;
        traversalElem.categories = [category];
        groupTrav.push(traversalElem);
      }
      switch (vis.type) {
        case "card":
        case "multiRowCard":
          groupGeneralVis.visuals.push(groupTrav);
          break;
        case "slicer":
          groupFilters.visuals.push(groupTrav);
          break;
        default:
          groupOtherVis.visuals.push(groupTrav);
      }
    }

    if (groupFilters.visuals.length > 0) {
      const traversalElem3 = createTraversalElement("group");
      traversalElem3.count = 1;
      traversalElem3.element = groupFilters;
      trav.push(traversalElem3);
    }

    if (groupGeneralVis.visuals.length > 0) {
      const traversalElem4 = createTraversalElement("group");
      traversalElem4.count = 2;
      traversalElem4.element = groupGeneralVis;
      trav.push(traversalElem4);
    }

    if (groupOtherVis.visuals.length > 0) {
      const traversalElem5 = createTraversalElement("group");
      traversalElem5.count = 3;
      traversalElem5.element = groupOtherVis;
      trav.push(traversalElem5);
    }
  } catch (error) {
    console.log("Error in testing", error);
  }
  return trav;
}
