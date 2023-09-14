import * as helpers from "./../../componentGraph/helperFunctions";
import * as global from "./globalVariables";
import { getNewDashboardInfo } from "./dashboardInfoCard";
import { replacer } from "../../componentGraph/ComponentGraph";
import {
  createTraversalElement,
  findTraversalVisual,
  Group,
  isGroup,
  TraversalElement,
  traversalStrategy,
} from "./traversal";
import { VisualDescriptor } from "powerbi-client";
import { reportId } from "../../Config";
import { store } from "../../UI/redux/store";

let visualIndex: number;

export function createSettings() {
  const settings = global.createSettingsObject();
  settings.traversalStrategy = setTraversalStrategy();
  settings.interactionExample = setInteractionExampleInfo();
  settings.allVisuals = global.allVisuals.map((visual: VisualDescriptor) => {
    return visual.name;
  });
  settings.reportId = reportId;

  global.setSettings(settings);
  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export function getTraversalElement(elem: any) {
  let traversalElement;
  try {
    if (isGroup(elem)) {
      const traversalGroupVisuals = setGroup(elem);
      elem.visuals = traversalGroupVisuals;
      traversalElement = elem;
    } else if (elem === "dashboard") {
      traversalElement = setDashboardInfo();
    } else if (elem === "globalFilter") {
      traversalElement = setFilterInfo();
    } else {
      traversalElement = setVisualsInfo(elem);
    }
  } catch (error) {
    console.log("Error in getTraversalElement", error);
  }

  return traversalElement;
}

 function setTraversalStrategy() {
  const traversalElem1 = createTraversalElement("dashboard");
  traversalElem1.element = getTraversalElement("dashboard");
  traversalStrategy.push(traversalElem1);
  for (const vis of global.currentVisuals) {
    const traversalElem = createTraversalElement(vis.type);
    traversalElem.element = getTraversalElement(vis.name);
    traversalStrategy.push(traversalElem);
  }
  const traversalElem2 = createTraversalElement("globalFilter");
  traversalElem2.element = getTraversalElement("globalFilter");
  traversalStrategy.push(traversalElem2);
  return traversalStrategy;
}

function setGroup(elem: Group) {
  const traversal: TraversalElement[][] = [];
  for (const trav of elem.visuals) {
    const visuals: TraversalElement[] = [];
    for (const vis of trav) {
      const i = traversal.findIndex((trav) => getIndex(trav, vis) > -1);

      if (i > -1 && visualIndex > -1) {
        traversal[i][visualIndex].categories.push(vis.categories[0]);
      } else {
        if (vis.element.id === "dashboard") {
          const traversalElem = createTraversalElement("dashboard");
          traversalElem.count = vis.count;
          traversalElem.categories = vis.categories;
          traversalElem.element = setDashboardInfo();
          visuals.push(traversalElem);
        } else if (vis.element.id === "globalFilter") {
          const traversalElem = createTraversalElement("globalFilter");
          traversalElem.count = vis.count;
          traversalElem.categories = vis.categories;
          traversalElem.element = setFilterInfo();
          visuals.push(traversalElem);
        } else {
          const traversalElem = createTraversalElement("");
          traversalElem.count = vis.count;
          traversalElem.categories = vis.categories;
          traversalElem.element = setVisualsInfo(vis.element.id);
          visuals.push(traversalElem);
        }
      }
    }
    if (visuals.length > 0) {
      traversal.push(visuals);
    }
  }
  return traversal;
}

function getIndex(trav: TraversalElement[], vis: TraversalElement) {
  visualIndex = trav.findIndex(
    (visual) =>
      visual.count === vis.count && visual.element.id === vis.element.id
  );
  return visualIndex;
}

function setDashboardInfo() {
  const settingsDashboardInfo = global.createDashboardInfo();

  return settingsDashboardInfo;
}

function setVisualsInfo(id: string) {
  try {
    const visual = findTraversalVisual(id);
    if (!visual) {
      return;
    }
    const settingsVisual = global.createVisual();

    settingsVisual.id = visual.name;

    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    )!;
    settingsVisual.title = CGVisual.title.title;

    return settingsVisual;
  } catch (error) {
    console.error("Error in setVisualsInfo", error);
  }
}

function setFilterInfo() {
  const settingsFilterVisual = global.createFilterVisual();
  return settingsFilterVisual;
}

function setInteractionExampleInfo() {
  const settingsInteractionExample = global.createInteractionExample();
  settingsInteractionExample.title = "Interaction Example";
  settingsInteractionExample.generalInfoStatus = "original";
  settingsInteractionExample.changedGeneralInfo = "";
  settingsInteractionExample.nextVisualHint =
    "Can you see how this visual changed?";

  for (const visual of global.currentVisuals) {
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    )!;
    switch (visual.type) {
      case "card":
      case "multiRowCard":
        const settingsInteractableVisualCard =
          global.createInteractableVisualCard();
        settingsInteractableVisualCard.id = visual.name;
        settingsInteractableVisualCard.title = CGVisual.title.title;

        settingsInteractableVisualCard.clickInfosStatus = null;
        settingsInteractableVisualCard.changedClickInfo = null;
        settingsInteractableVisualCard.interactionChangedInfosStatus =
          "original";
        settingsInteractableVisualCard.changedInteractionChangedInfo = "";

        settingsInteractionExample.visuals.push(settingsInteractableVisualCard);
        break;
      case "slicer":
        const settingsInteractableVisualSlicer =
          global.createInteractableVisualSlicer();
        settingsInteractableVisualSlicer.id = visual.name;
        settingsInteractableVisualSlicer.title = CGVisual.title.title;

        settingsInteractableVisualSlicer.clickInfosStatus = "origninal";
        settingsInteractableVisualSlicer.changedClickInfo = "";
        settingsInteractableVisualSlicer.interactionChangedInfosStatus = null;
        settingsInteractableVisualSlicer.changedInteractionChangedInfo = null;

        settingsInteractionExample.visuals.push(
          settingsInteractableVisualSlicer
        );
        break;
      default:
        const settingsInteractableVisual = global.createInteractableVisual();
        settingsInteractableVisual.id = visual.name;
        settingsInteractableVisual.title = CGVisual.title.title;

        settingsInteractableVisual.clickInfosStatus = "original";
        settingsInteractableVisual.changedClickInfo = "";
        settingsInteractableVisual.interactionChangedInfosStatus = "original";
        settingsInteractableVisual.changedInteractionChangedInfo = "";

        settingsInteractionExample.visuals.push(settingsInteractableVisual);
        break;
    }
  }

  return settingsInteractionExample;
}
