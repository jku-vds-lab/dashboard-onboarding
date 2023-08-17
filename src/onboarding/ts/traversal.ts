import {
  createDashboardInfoCard,
  removeDashboardInfoCard,
} from "./dashboardInfoCard";
import { removeFrame } from "./disableArea";
import { removeElement } from "./elements";
import { createFilterInfoCard, removeFilterInfoCard } from "./filterInfoCards";
import { currentVisuals } from "./globalVariables";
import { removeOnboardingOverlay } from "./helperFunctions";
import { createInfoCard, removeInfoCard } from "./infoCards";
import { removeIntroCard } from "./introCards";
import { createOverlayForVisuals } from "./onboarding";
import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import { replacer } from "../../componentGraph/ComponentGraph";
import { getTraversalElement } from "./createSettings";
import { IDefaultNode } from "../../UI/nodes-canvas/nodes/defaultNode";
import GroupNode, { IGroupNode } from "../../UI/nodes-canvas/nodes/groupNode";
import { VisualDescriptor } from "powerbi-client";

export let traversalStrategy: TraversalElement[] = [];
export const lookedAtInGroup = createLookedAtInGroup();
export let currentId = 0;
export let traversalInGroupIndex = 0;
export let visualInGroupIndex = 0;

export interface TraversalElement {
  element: any;
  categories: string[];
  count: number;
}

export interface Group {
  id: string;
  type: groupType;
  visuals: any[];
}

export interface LookedAtInGroup {
  groupId: string;
  elements: LookedAtIds[];
}

export interface LookedAtIds {
  id: string;
  categories: string[];
  count: number;
}

export function isGroup(object: any): object is Group {
  return object.type && Object.values(groupType).includes(object.type);
}

export enum groupType {
  all = "All",
  atLeastOne = "At least one",
  onlyOne = "Only one",
}

export function createTraversalElement(type: string) {
  const elem: TraversalElement = {
    element: null,
    categories: [],
    count: 1,
  };
  elem.categories = getStandartCategories(type);
  return elem;
}

export function createGroup() {
  const group: Group = {
    id: "group",
    type: groupType.all,
    visuals: [],
  };
  return group;
}

export function createLookedAtInGroup() {
  const lookedAtInGroup: LookedAtInGroup = {
    groupId: "",
    elements: [],
  };
  return lookedAtInGroup;
}

export function createLookedAtIds(
  newId: string,
  newCategories: string[],
  newCount: number
) {
  const lookedAtIds: LookedAtIds = {
    id: newId,
    categories: newCategories,
    count: newCount,
  };
  return lookedAtIds;
}

export function setCurrentId(newId: number) {
  currentId = newId;
}
export function setTraversalInGroupIndex(newTraversalInGroupIndex: number) {
  traversalInGroupIndex = newTraversalInGroupIndex;
}
export function setVisualInGroupIndex(newVisualInGroupIndex: number) {
  visualInGroupIndex = newVisualInGroupIndex;
}
export function setTraversalStrategy(newTraversalStrategy: any[]) {
  traversalStrategy = newTraversalStrategy;
}

export function createInformationCard(
  type: string,
  count: number,
  visuals?: any[],
  visualId?: string,
  categories?: string[]
) {
  removeFrame();
  removeIntroCard();
  removeInfoCard();
  removeDashboardInfoCard();
  removeFilterInfoCard();
  removeOnboardingOverlay();
  switch (type) {
    case "dashboard":
      createDashboardInfoCard(count);
      break;
    case "globalFilter":
      createFilterInfoCard(count);
      break;
    case "group":
      createExplainGroupCard();
      createOverlayForVisuals(visuals!);
      break;
    case "visual":
      createInfoCard(
        <VisualDescriptor>(
          global.allVisuals.find((vis) => vis.name === visualId)
        ),
        count,
        categories!
      );
      break;
  }
}

export function getCurrentTraversalElementType(traversal: TraversalElement[]) {
  const currentElement = traversal[currentId];

  if (isGroup(currentElement.element)) {
    const firstVisuals: TraversalElement[] = [];
    currentElement.element.visuals.forEach((trav) =>
      firstVisuals.push(trav[0])
    );
    createInformationCard("group", currentElement.count, firstVisuals);
  } else if (currentElement.element.id === "dashboard") {
    createInformationCard("dashboard", currentElement.count);
  } else if (currentElement.element.id === "globalFilter") {
    createInformationCard("globalFilter", currentElement.count);
  } else {
    createInformationCard(
      "visual",
      currentElement.count,
      undefined,
      currentElement.element.id,
      currentElement.categories
    );
  }
}

export function createGroupOverlay() {
  const currentElement = global.settings.traversalStrategy[currentId];
  const firstVisuals: TraversalElement[] = [];
  const notTraversed: TraversalElement[] = [];
  for (const trav of currentElement.element.visuals) {
    if (
      !trav.every((vis: TraversalElement) =>
        lookedAtInGroup.elements.find(
          (elem) =>
            elem.id === vis.element.id &&
            elem.categories.every((category) =>
              vis.categories.includes(category)
            ) &&
            elem.count === vis.count
        )
      )
    ) {
      notTraversed.push(trav);
    }
  }
  notTraversed.forEach((trav: TraversalElement) => firstVisuals.push(trav[0]));
  if (
    currentElement.element.type === groupType.atLeastOne &&
    currentId !== global.settings.traversalStrategy.length - 1
  ) {
    if (isGroup(currentElement.element)) {
      currentElement.element.visuals.forEach((trav) =>
        firstVisuals.push(trav[0])
      );
    } else {
      firstVisuals.push(global.settings.traversalStrategy[currentId + 1]);
    }
  }
  createInformationCard("group", currentElement.count, firstVisuals, undefined);
}

export function findVisualIndexInTraversal(
  traversal: TraversalElement[],
  id: string,
  count: number
) {
  const elem = traversal.find(
    (vis) => vis.element.id === id && vis.count === count
  );
  let index = traversal.indexOf(elem!);
  if (index == -1) {
    const groups = traversal.filter((object) => isGroup(object.element));
    for (const group of groups) {
      for (const groupTraversal of group.element.visuals) {
        const elemInGroup = groupTraversal.find(
          (visInGroup: TraversalElement) =>
            visInGroup.element.id === id && visInGroup.count === count
        );
        if (elemInGroup) {
          const groupElem = traversal.find(
            (vis) =>
              vis.element.id === group.element.id && vis.count === group.count
          );
          const groupIndex = traversal.indexOf(groupElem!);
          return groupIndex;
        }
      }
    }
    index = -1;
  }
  return index;
}

export function findElementInTraversal(
  traversal: TraversalElement[],
  id: string,
  categories: string[],
  count: number
) {
  const foundElem = traversal.find(
    (vis) =>
      vis.element.id === id &&
      vis.categories.every((category) => categories.includes(category)) &&
      vis.count === count
  );
  if (!foundElem) {
    const groups = traversal.filter((object) => isGroup(object.element));
    for (const group of groups) {
      for (const groupTraversal of group.element.visuals) {
        const elemInGroup = groupTraversal.find(
          (visInGroup: TraversalElement) =>
            visInGroup.element.id === id &&
            visInGroup.categories.every((category) =>
              categories.includes(category)
            ) &&
            visInGroup.count === count
        );
        if (elemInGroup) {
          return elemInGroup;
        }
      }
    }
  }
  return foundElem;
}

export function findTraversalVisual(id: string) {
  if (!isGroup(id) && id !== "dashboard" && id !== "globalFilter") {
    return currentVisuals.find((vis: any) => vis.name === id);
  }

  return null;
}

export function findCurrentTraversalVisual() {
  let traversal: TraversalElement[];
  if (global.explorationMode) {
    traversal = global.basicTraversal;
  } else {
    traversal = global.settings.traversalStrategy;
  }

  const traversalElem = traversal[currentId];
  if (isGroup(traversalElem)) {
    const trav = traversalElem.visuals[traversalInGroupIndex];
    const visInGroup = trav[visualInGroupIndex];
    if (
      traversalElem.id !== "dashboard" &&
      traversalElem.id !== "globalFilter"
    ) {
      return [
        currentVisuals.find((vis: any) => vis.name === visInGroup.element.id),
        visInGroup.categories,
        visInGroup.count,
      ];
    }
  }

  if (
    traversalElem.element.id !== "dashboard" &&
    traversalElem.element.id !== "globalFilter"
  ) {
    return [
      currentVisuals.find((vis: any) => vis.name === traversalElem.element.id),
      traversalElem.categories,
      traversalElem.count,
    ];
  }

  return null;
}

export function findCurrentTraversalCount() {
  return global.settings.traversalStrategy[currentId].count;
}

export function findCurrentTraversalVisualIndex() {
  let traversal: TraversalElement[];
  if (global.explorationMode) {
    traversal = global.basicTraversal;
  } else {
    traversal = global.settings.traversalStrategy;
  }

  const traversalElem = traversal[currentId].element;

  if (
    !isGroup(traversalElem) &&
    traversalElem.id !== "dashboard" &&
    traversalElem.id !== "globalFilter"
  ) {
    return currentVisuals.findIndex(
      (vis: any) => vis.name === traversalElem.id
    );
  }

  return 0;
}

export function removeExplainGroupCard() {
  removeElement("explainGroupCard");
}

export function createExplainGroupCard() {
  helpers.addContainerOffset(global.explainGroupCardHeight);

  let style =
    `overflow: auto;width:` +
    global.explainGroupCardWidth +
    `px;height:` +
    global.explainGroupCardHeight +
    `px;pointer-events:auto;border-radius:10px;background-color:lightsteelblue;z-index: 99 !important;`;
  if (global.isEditor) {
    const flex = document
      .getElementById("flexContainer")!
      .getBoundingClientRect();
    const onboarding = document
      .getElementById("onboarding")!
      .getBoundingClientRect();
    style +=
      `position:relative;top:` +
      -(onboarding.top - flex.top - global.globalCardTop) +
      `px;margin: 0 auto;`;
  } else {
    style +=
      `position:fixed;top:` +
      global.globalCardTop +
      `px;left:50%;margin-left:` +
      -(global.explainGroupCardWidth / 2) +
      `px;`;
  }
  helpers.createCard("explainGroupCard", style, "");
  helpers.createCloseButton(
    "closeButton",
    "closeButtonPlacementBig",
    "",
    helpers.getCloseFunction(),
    "explainGroupCard"
  );
  helpers.createCardContent("", createExplainGroupText(), "explainGroupCard");
}

function createExplainGroupText() {
  const currentElement = global.settings.traversalStrategy[currentId].element;
  let explaination =
    "Please click on one of the highlighted visualisations to get its explaination.";

  switch (currentElement.type) {
    case groupType.all:
      explaination +=
        " You can look at the visualisations in any order but you will have to look at all of them before you can continue.";
      break;
    case groupType.atLeastOne:
      explaination +=
        " You can look at one visualisation or multiple and then continue.";
      break;
    case groupType.onlyOne:
      explaination +=
        " You can look at one of the viualisation and then continue.";
      break;
  }

  return explaination;
}

export async function createTraversalOfGroupNodes(groupNode: IGroupNode) {
  const group = createGroup();

  try {
    group.type = groupNode.data.traverse;
    for (const sNode of groupNode.nodes) {
      const traversalElem = await getTraversalElem(sNode);
      group.visuals.push([traversalElem]);
    }
  } catch (error) {}

  return group;
}

export async function getTraversalElem(sNode: any) {
  const traversalElem: TraversalElement = {
    element: "",
    categories: [],
    count: 1,
  };
  try {
    const idParts: string[] = sNode.id.split(" ");
    const nodeId: string = idParts[0];
    let nodeCat: string = "general";
    let count = 1;
    if (idParts.length > 3) {
      nodeCat = idParts[1].toLowerCase();
      count = parseInt(idParts[2]);
    } else {
      count = parseInt(idParts[1]);
    }

    traversalElem.element = await getTraversalElement(nodeId);
    traversalElem.count = count;
    traversalElem.categories = [nodeCat];
  } catch (error) {
    console.log("Error in getTraversalElem", error);
  }

  return traversalElem;
}

export async function createTraversalOfNodes(
  allNodes: (IDefaultNode | IGroupNode)[]
) {
  try {
    const trav: TraversalElement[] = [];

    for (const node of allNodes) {
      if (node.type == "default") {
        trav.push(await getTraversalElem(node));
      } else {
        const travElem = createTraversalElement("group");
        travElem.element = await createTraversalOfGroupNodes(<IGroupNode>node);
        travElem.count = parseInt(node.id.split(" ")[1]);
        trav.push(travElem);
      }
    }
    // console.log("Trav", trav);
    await updateTraversal(trav);
  } catch (error) {
    console.log("Error", error);
  }
}

export async function updateTraversal(
  newTraversalStrategy: TraversalElement[]
) {
  try {
    const traversal: TraversalElement[] = [];
    const oldTraversalStrategy = global.settings.traversalStrategy;
    setTraversalStrategy([]);
    global.settings.traversalStrategy = [];
    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));

    for (const elem of newTraversalStrategy) {
      if (isGroup(elem.element)) {
        const oldGroup = oldTraversalStrategy.find(
          (elemSetting) =>
            elemSetting.element.id === elem.element.id &&
            elemSetting.categories.every((category) =>
              elem.categories.includes(category)
            ) &&
            elemSetting.count === elem.count
        );
        if (oldGroup) {
          const newTraversals = [];
          for (const groupTraversal of elem.element.visuals) {
            const newVisuals = [];
            for (const groupElem of groupTraversal) {
              const oldSetting = findElementInTraversal(
                oldTraversalStrategy,
                groupElem.element.id,
                groupElem.categories,
                groupElem.count
              );
              if (oldSetting) {
                newVisuals.push(oldSetting);
              } else {
                const traversalElem = createTraversalElement("");
                traversalElem.element = await getTraversalElement(
                  groupElem.element.id
                );
                traversalElem.count = groupElem.count;
                traversalElem.categories = groupElem.categories;
                newVisuals.push(traversalElem);
              }
            }
            newTraversals.push(newVisuals);
          }
          elem.element.visuals = newTraversals;
          traversal.push(elem);
        } else {
          const traversalElem = createTraversalElement("");
          traversalElem.element = await getTraversalElement(elem.element);
          traversalElem.count = elem.count;
          traversalElem.categories = elem.categories;
          traversal.push(traversalElem);
        }
      } else {
        const oldSetting = oldTraversalStrategy.find(
          (elemSetting) =>
            elemSetting.element.id === elem.element.id &&
            elemSetting.categories.every((category) =>
              elem.categories.includes(category)
            ) &&
            elemSetting.count === elem.count
        );
        if (oldSetting) {
          traversal.push(oldSetting);
        } else {
          const traversalElem = createTraversalElement("");
          traversalElem.element = await getTraversalElement(elem.element.id);
          traversalElem.count = elem.count;
          traversalElem.categories = elem.categories;
          traversal.push(traversalElem);
        }
      }
    }

    setTraversalStrategy(traversal);
    global.settings.traversalStrategy = traversal;
    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
  } catch (error) {
    console.error(error);
  }
}

export function updateLookedAt(lookedAt: LookedAtIds) {
  const currentElement = global.settings.traversalStrategy[currentId].element;
  if (isGroup(currentElement)) {
    if (currentElement.id === lookedAtInGroup.groupId) {
      lookedAtInGroup.elements.push(lookedAt);
    } else {
      lookedAtInGroup.groupId = currentElement.id;
      lookedAtInGroup.elements = [lookedAt];
    }
  } else {
    lookedAtInGroup.groupId = "";
    lookedAtInGroup.elements = [];
  }
}

export function getStandartCategories(type: string) {
  let categories: string[];
  switch (type) {
    case "card":
    case "multiRowCard":
      categories = ["general", "insight"];
      break;
    case "slicer":
      categories = ["general", "interaction"];
      break;
    case "dashboard":
    case "globalFilter":
      categories = ["general"];
      break;
    default:
      categories = ["general", "interaction", "insight"];
      break;
  }
  return categories;
}
