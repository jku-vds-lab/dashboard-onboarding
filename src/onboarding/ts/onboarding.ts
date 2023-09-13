import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import { createIntroCard, removeIntroCard } from "./introCards";
import { createInfoCard, removeInfoCard } from "./infoCards";
import { removeFrame } from "./disableArea";
import {
  removeInteractionCard,
  startInteractionExample,
  createInteractionCardForOutputPane,
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
  createLookedAtIds,
  findCurrentTraversalCount,
  findCurrentTraversalVisual,
  findVisualIndexInTraversal,
  getCurrentTraversalElementType,
  getStandartCategories,
  removeExplainGroupCard,
  setCurrentId,
  TraversalElement,
  updateLookedAt,
} from "./traversal";
import { basicTraversalStrategy } from "./traversalStrategies";
import { VisualDescriptor } from "powerbi-client";
import * as disable from "./disableArea";
import * as infoCard from "./infoCards";
import * as introCard from "./introCards";
import { ExpertiseLevel } from "../../UI/redux/expertise";
export async function onLoadReport(isMainPage: boolean) {
  console.log("Report is loading");
  try {
    if (global.isFirstTimeLoading) {
      console.log("Local Storage Cleared!");
      localStorage.clear();
      global.setIsFirstTimeLoading(false);
    }
    await helpers.getActivePage();
    await helpers.getVisualsfromPowerBI();
    await helpers.createComponentGraph();
    await helpers.getSettings();

    if (isMainPage) {
      const trav = await basicTraversalStrategy();
      global.setBasicTraversal(trav);

      helpers.createEditOnboardingButtons();
      helpers.createOnboardingButtons();
    }

    resize(isMainPage);
    elements.addStylesheet("/onboarding/css/onboarding.css");

    createGuidedTour();
  } catch (error) {
    console.log("Error on loading the report", error);
  }
}

export async function onReloadReport() {
  try {
    const oldPage = global.page.name;
    await helpers.getActivePage();

    if (global.page.name !== oldPage && global.page.displayName !== "Info") {
      await helpers.getVisualsfromPowerBI();
      await createSettings();
      helpers.resizeEmbed(global.filterOpenedWidth);
    }
  } catch (error) {
    console.log("Erron reloading the report", error);
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

export async function reloadOnboarding(isMainPage: boolean) {
  await resize(isMainPage);
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
  categories?: string[],
  count?: number,
  expertiseLevel?: ExpertiseLevel,
  outputPane?: boolean
) {
  // helpers.reloadOnboarding(); // Reload: Why is this needed?
  infoCard.removeInfoCard();
  removeFilterInfoCard();
  removeDashboardInfoCard();
  introCard.removeIntroCard();

  switch (type) {
    case "intro":
      createIntroCard();
      break;
    case "dashboard":
      createDashboardInfoCard(count!);
      break;
    case "globalFilter":
      await createFilterInfoCard(categories!, count!, expertiseLevel);
      break;
    case "interaction":
      if (outputPane) {
        await createInteractionCardForOutputPane(visual);
      } else {
        await startInteractionExample();
      }
      break;
    case "reportChanged":
      helpers.removeContainerOffset();
      showReportChanges();
      break;
    case "visualChanged":
      await showVisualChanges(visual);
      break;
    case "visual":
      await createInfoCard(visual, count!, categories!, expertiseLevel);
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

  if (
    findVisualIndexInTraversal(global.basicTraversal, "dashboard", 1) !== -1
  ) {
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

  global.currentVisuals.forEach(function (visual: VisualDescriptor) {
    if (
      findVisualIndexInTraversal(global.basicTraversal, visual.name, 1) !== -1
    ) {
      const visualLayoutX = visual.layout.x ?? 0;
      const visualLayoutY = visual.layout.y ?? 0;
      const visualLayoutWidth = visual.layout.width ?? 0;
      const visualLayoutHeight = visual.layout.height ?? 0;

      const style = helpers.getClickableStyle(
        visualLayoutY / reportDivisor,
        visualLayoutX / reportDivisor,
        visualLayoutWidth / reportDivisor,
        visualLayoutHeight / reportDivisor
      );
      createOverlay(visual.name, style, 1, getStandartCategories(visual.type));
    }
  });

  if (
    findVisualIndexInTraversal(global.basicTraversal, "globalFilter", 1) !== -1
  ) {
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
        createOverlay("globalFilter", style, visualInfo.count, ["general"]);
        break;
      default:
        const visual = global.currentVisuals.find(
          (vis: VisualDescriptor) => vis.name === visualInfo.element.id
        );
        if (!visual) {
          return;
        }

        const visualLayoutX = visual.layout.x ?? 0;
        const visualLayoutY = visual.layout.y ?? 0;
        const visualLayoutWidth = visual.layout.width ?? 0;
        const visualLayoutHeight = visual.layout.height ?? 0;
        style = helpers.getClickableStyle(
          visualLayoutY / reportDivisor,
          visualLayoutX / reportDivisor,
          visualLayoutWidth / reportDivisor,
          visualLayoutHeight / reportDivisor
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
  setCurrentId(
    findVisualIndexInTraversal(global.basicTraversal, "dashboard", count)
  );
  const lookedAt = createLookedAtIds("dashboard", ["general"], 1);
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
