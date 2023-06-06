import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { createIntroCard, removeIntroCard } from "./introCards";
import { createInfoCard, removeInfoCard } from "./infoCards";
import { removeFrame } from "./disableArea";
import {
  removeInteractionCard,
  startInteractionExample,
} from "./interactionExample";
import { createSettings } from "./createSettings";
import { showReportChanges } from "./showReportChanges";
import {
  createDashboardInfoCard,
  removeDashboardInfoCard,
} from "./dashboardInfoCard";
import { reportDivisor, resize, textSize } from "./sizes";
import { createFilterInfoCard, removeFilterInfoCard } from "./filterInfoCards";
import { showVisualChanges } from "./showVisualsChanges";
import {
  createExplainGroupCard,
  createLookedAtIds,
  currentId,
  findCurrentTraversalCount,
  findCurrentTraversalVisual,
  findTraversalVisual,
  findVisualIndexInTraversal,
  getCurrentTraversalElementType,
  getStandartCategories,
  isGroup,
  lookedAtInGroup,
  removeExplainGroupCard,
  setCurrentId,
  TraversalElement,
  traversalStrategy,
  updateLookedAt,
  updateTraversal,
} from "./traversal";
import { replacer } from "../../componentGraph/ComponentGraph";
import { basicTraversalStrategy } from "./traversalStrategies";

export async function onLoadReport() {
  await helpers.getActivePage();
  await helpers.getVisuals();
  for (const vis of global.allVisuals) {
    const caps = await vis.getCapabilities();
    console.log(vis.type, caps);
    for (const cap of caps.dataRoles) {
      console.log(cap.name, await vis.getDataFields(cap.name));
    }
  }
  await helpers.createComponentGraph();
  console.log(global.componentGraph);
  await helpers.getSettings();

  const trav = await basicTraversalStrategy();
  global.setBasicTraversal(trav);

  helpers.createEditOnboardingButtons();
  helpers.createOnboardingButtons();

  resize();

  elements.addStylesheet("/onboarding/css/onboarding.css");

  createGuidedTour();
}

export async function onReloadReport() {
  const oldPage = global.page.name;
  await helpers.getActivePage();

  if (global.page.name !== oldPage && global.page.displayName !== "Info") {
    await helpers.getVisuals();
    await createSettings();
    helpers.resizeEmbed(global.filterOpenedWidth);
  }
}

export async function onDataSelected(event: { detail: { dataPoints: any[] } }) {
  if (global.interactionMode) {
    const selectedData = event.detail.dataPoints[0];
    if (selectedData) {
      global.setSelectedTargets(selectedData.identity);
      showReportChanges();
    }
  } else {
    helpers.recreateInteractionExampleButton();
  }
}

export async function reloadOnboarding() {
  await resize();
  await reloadOnboardingAt();
}

export async function reloadOnboardingAt() {
  if (document.getElementById("introCard")) {
    await startOnboardingAt("intro");
  } else if (document.getElementById("dashboardInfoCard")) {
    await startOnboardingAt("dashboard", findCurrentTraversalCount());
  } else if (document.getElementById("filterInfoCard")) {
    await startOnboardingAt("globalFilter", findCurrentTraversalCount());
  } else if (document.getElementById("interactionCard")) {
    await startOnboardingAt("interaction");
  } else if (document.getElementById("showChangesCard")) {
    await startOnboardingAt("reportChanged");
  } else if (document.getElementById("showVisualChangesCard")) {
    await startOnboardingAt("visualChanged", global.interactionSelectedVisual);
  } else if (document.getElementById("infoCard")) {
    const traversalElement = findCurrentTraversalVisual();
    if (traversalElement) {
      await startOnboardingAt(
        "visual",
        traversalElement[0],
        traversalElement[1]
      );
    }
  } else if (global.hasOverlay && !global.interactionMode) {
    await startOnboardingAt("explorationOverlay");
  }
}

export async function startOnboardingAt(
  type: string,
  visual?: any,
  count?: number
) {
  helpers.reloadOnboarding();

  switch (type) {
    case "intro":
      createIntroCard();
      break;
    case "dashboard":
      createDashboardInfoCard(count!);
      break;
    case "globalFilter":
      await createFilterInfoCard(count!);
      break;
    case "interaction":
      await startInteractionExample();
      break;
    case "reportChanged":
      helpers.removeContainerOffset();
      showReportChanges();
      break;
    case "visualChanged":
      await showVisualChanges(visual);
      break;
    case "visual":
      await createInfoCard(visual, count!, getStandartCategories(visual.type));
      break;
    case "explorationOverlay":
      createOnboardingOverlay();
      break;
  }
}

export function createGuidedTour() {
  helpers.removeOnboarding();

  global.setIsGuidedTour(true);
  helpers.createOnboarding();
  createIntroCard();
}

export function createDashboardExploration() {
  if (global.explorationMode) {
    helpers.removeOnboarding();
  } else {
    helpers.removeOnboarding();

    helpers.startExplorationMode();
    helpers.createOnboarding();
    createIntroCard();
  }
}

export function startGuidedTour() {
  //global.setCurrentVisualIndex(0);
  removeIntroCard();
  setCurrentId(0);
  getCurrentTraversalElementType(global.settings.traversalStrategy);
}

export function createOnboardingOverlay() {
  helpers.removeOnboardingOverlay();
  removeExplainGroupCard();
  removeFrame();
  removeIntroCard();
  removeInfoCard();
  removeDashboardInfoCard();
  removeFilterInfoCard();
  removeInteractionCard();
  global.setHasOverlay(true);
  global.setInteractionMode(false);

  if (findVisualIndexInTraversal(global.basicTraversal, "dashboard", 1) !== -1) {
    const attributes = global.createButtonAttributes();
    attributes.id = "dashboardExplaination";
    attributes.content = "Dashboard Explaination";
    attributes.style =
      `font-size: ${textSize}rem; ` + global.onboardingButtonStyle;
    attributes.classes = "col-2 " + global.darkOutlineButtonClass;
    attributes.function = () => {
      return createDashboardInfoOnButtonClick(1);
    };
    attributes.parentId = "onboarding-header";
    elements.createButton(attributes);
  }

  global.currentVisuals.forEach(function (visual: any) {
    if (findVisualIndexInTraversal(global.basicTraversal, visual.name, 1) !== -1) {
      const style = helpers.getClickableStyle(
        visual.layout.y / reportDivisor,
        visual.layout.x / reportDivisor,
        visual.layout.width / reportDivisor,
        visual.layout.height / reportDivisor
      );
      createOverlay(visual.name, style, 1, getStandartCategories(visual.type));
    }
  });

  if (findVisualIndexInTraversal(global.basicTraversal, "globalFilter", 1) !== -1) {
    const style = helpers.getClickableStyle(
      -global.settings.reportOffset.top,
      global.reportWidth!,
      global.filterOpenedWidth,
      global.reportHeight!
    );
    createOverlay("globalFilter", style, 1);
  }
}

export function createOverlayForVisuals(visuals: TraversalElement[]) {
  global.setHasOverlay(true);
  global.setInteractionMode(false);
  removeFrame();
  removeIntroCard();
  removeInfoCard();
  removeDashboardInfoCard();
  removeFilterInfoCard();
  removeInteractionCard();

  visuals.forEach(function (visualInfo: TraversalElement) {
    let style = "";
    switch (visualInfo.element.id) {
      case "dashboard":
        const attributes = global.createButtonAttributes();
        attributes.id = "dashboardExplaination";
        attributes.count = visualInfo.count;
        attributes.content = "Dashboard Explaination";
        attributes.style =
          `font-size: ${textSize}rem; border: 5px solid lightgreen;` +
          global.onboardingButtonStyle;
        attributes.classes = "col-2 " + global.darkOutlineButtonClass;
        attributes.function = () => {
          return createDashboardInfoOnButtonClick(visualInfo.count);
        };
        attributes.parentId = "onboarding-header";
        elements.createButton(attributes);
        break;
      case "globalFilter":
        style = helpers.getClickableStyle(
          -global.settings.reportOffset.top,
          global.reportWidth!,
          global.filterOpenedWidth,
          global.reportHeight!
        );
        style += "border: 5px solid lightgreen;";
        createOverlay("globalFilter", style, visualInfo.count, ["general", "interaction", "insight"]);
        break;
      default:
        const visual = global.currentVisuals.find(
          (vis: any) => vis.name === visualInfo.element.id
        );
        style = helpers.getClickableStyle(
          visual.layout.y / reportDivisor,
          visual.layout.x / reportDivisor,
          visual.layout.width / reportDivisor,
          visual.layout.height / reportDivisor
        );
        style += "border: 5px solid lightgreen;";
        createOverlay(
          visual.name,
          style,
          visualInfo.count,
          visualInfo.categories
        );
        break;
    }
  });
}

function createDashboardInfoOnButtonClick(count: number) {
  helpers.removeOnboardingOverlay();
  helpers.removeContainerOffset();
  removeExplainGroupCard();
  setCurrentId(findVisualIndexInTraversal(global.basicTraversal, "dashboard", count));
  const lookedAt = createLookedAtIds("dashboard", [], 1);
  updateLookedAt(lookedAt);
  createDashboardInfoCard(1);
}

function createOverlay(
  id: string,
  style: string,
  count: number,
  categories?: string[]
) {
  const attributes = global.createDivAttributes();
  attributes.id = id;
  if (categories) {
    attributes.categories = categories;
  }
  attributes.count = count;
  attributes.style = style;
  attributes.clickable = true;
  attributes.parentId = "onboarding";
  elements.createDiv(attributes);
}
