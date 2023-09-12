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
import { Level } from "../../UI/redux/expertise";

let visualIndex: number;

export async function createSettings() {
  const settings = global.createSettingsObject();
  settings.traversalStrategy = await setTraversalStrategy();
  settings.interactionExample = setInteractionExampleInfo();
  settings.allVisuals = global.allVisuals.map((visual: VisualDescriptor) => {
    return visual.name;
  });
  settings.reportId = reportId;

  global.setSettings(settings);
  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function getTraversalElement(elem: any) {
  let traversalElement;
  try {
    if (isGroup(elem)) {
      const traversalGroupVisuals = await setGroup(elem);
      elem.visuals = traversalGroupVisuals;
      traversalElement = elem;
    } else if (elem === "dashboard") {
      traversalElement = setDashboardInfo();
    } else if (elem === "globalFilter") {
      traversalElement = await setFilterInfo();
    } else {
      traversalElement = await setVisualsInfo(elem);
    }
  } catch (error) {
    console.log("Error in getTraversalElement", error);
  }

  return traversalElement;
}

async function setTraversalStrategy() {
  const traversalElem1 = createTraversalElement("dashboard");
  traversalElem1.element = await getTraversalElement("dashboard");
  traversalStrategy.push(traversalElem1);
  for (const vis of global.currentVisuals) {
    const traversalElem = createTraversalElement(vis.type);
    traversalElem.element = await getTraversalElement(vis.name);
    traversalStrategy.push(traversalElem);
  }
  const traversalElem2 = createTraversalElement("globalFilter");
  traversalElem2.element = await getTraversalElement("globalFilter");
  traversalStrategy.push(traversalElem2);
  return traversalStrategy;
}

async function setGroup(elem: Group) {
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
          traversalElem.element = await setFilterInfo();
          visuals.push(traversalElem);
        } else {
          const traversalElem = createTraversalElement("");
          traversalElem.count = vis.count;
          traversalElem.categories = vis.categories;
          traversalElem.element = await setVisualsInfo(vis.element.id);
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
  settingsDashboardInfo.id = "dashboard";
  settingsDashboardInfo.titleStatus = "original";
  settingsDashboardInfo.changedTitle = "";

  const dashboardInfo = getNewDashboardInfo(global.componentGraph.dashboard);
  for (let i = 0; i < dashboardInfo[1].length; ++i) {
    settingsDashboardInfo.infoStatus.push("original");
    settingsDashboardInfo.changedInfos.push("");
  }

  return settingsDashboardInfo;
}

async function setVisualsInfo(id: string) {
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

    const visualInfos = await helpers.getVisualInfos(visual.type, { Domain: Level.Medium, Vis: Level.Medium }, visual);

    for (let i = 0; i < visualInfos.generalInfos.length; ++i) {
      settingsVisual.generalInfosStatus.push("original");
      settingsVisual.changedGeneralInfos.push("");
    }
    for (let i = 0; i < visualInfos.interactionInfos.length; ++i) {
      settingsVisual.interactionInfosStatus.push("original");
      settingsVisual.changedInteractionInfos.push("");
    }
    for (let i = 0; i < visualInfos.insightInfos.length; ++i) {
      settingsVisual.insightInfosStatus.push("original");
      settingsVisual.changedInsightInfos.push("");
    }

    return settingsVisual;
  } catch (error) {
    console.error("Error in setVisualsInfo", error);
  }
}

async function setFilterInfo() {
  const settingsFilterVisual = global.createFilterVisual();
  settingsFilterVisual.id = "globalFilter";
  settingsFilterVisual.title = "Filters";

  const filters = await global.page.getFilters();
  for (let i = 0; i < filters.length; ++i) {
    settingsFilterVisual.filterInfosStatus.push("original");
    settingsFilterVisual.changedFilterInfos.push("");
  }

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
