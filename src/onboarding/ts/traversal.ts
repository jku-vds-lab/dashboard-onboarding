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

export async function setBasicTraversalStrategy() {
  const trav = [];
  const traversalElem1 = createTraversalElement("dashboard");
  traversalElem1.element = await getTraversalElement("dashboard");
  trav.push(traversalElem1);
  for (const vis of global.currentVisuals) {
    const traversalElem = createTraversalElement(vis.type);
    traversalElem.element = await getTraversalElement(vis.name);
    trav.push(traversalElem);
  }
  const traversalElem2 = createTraversalElement("globalFilter");
  traversalElem2.element = await getTraversalElement("globalFilter");
  trav.push(traversalElem2);
  return trav;
}

export async function setTestAllGroupsTraversalStrategy() {
  const trav = [];
  const traversalElem1 = createTraversalElement("dashboard");
  traversalElem1.element = await getTraversalElement("dashboard");
  trav.push(traversalElem1);

  const traversalElem6g = createTraversalElement(currentVisuals[6].type);
  traversalElem6g.element = await getTraversalElement(currentVisuals[6].name);
  traversalElem6g.categories = ["general"];
  trav.push(traversalElem6g);

  const group = createGroup();

  const groupTrav1 = [];
  const traversalElemv11 = createTraversalElement(currentVisuals[0].type);
  traversalElemv11.element = await getTraversalElement(currentVisuals[0].name);
  traversalElemv11.categories = ["general"];
  groupTrav1.push(traversalElemv11);
  const traversalElemv11ia = createTraversalElement(currentVisuals[0].type);
  traversalElemv11ia.element = await getTraversalElement(
    currentVisuals[0].name
  );
  traversalElemv11ia.categories = ["insight"];
  groupTrav1.push(traversalElemv11ia);
  const traversalElemv11i = createTraversalElement(currentVisuals[1].type);
  traversalElemv11i.element = await getTraversalElement(currentVisuals[1].name);
  traversalElemv11i.categories = ["general"];
  groupTrav1.push(traversalElemv11i);
  const traversalElemv12 = createTraversalElement(currentVisuals[1].type);
  traversalElemv12.element = await getTraversalElement(currentVisuals[1].name);
  traversalElemv12.categories = ["insight"];
  groupTrav1.push(traversalElemv12);
  const traversalElemv11ia2 = createTraversalElement(currentVisuals[0].type);
  traversalElemv11ia2.element = await getTraversalElement(
    currentVisuals[0].name
  );
  traversalElemv11ia2.categories = ["insight"];
  traversalElemv11ia2.count = 2;
  groupTrav1.push(traversalElemv11ia2);
  const traversalElemv12i = createTraversalElement(currentVisuals[1].type);
  traversalElemv12i.element = await getTraversalElement(currentVisuals[1].name);
  traversalElemv12i.categories = ["interaction"];
  groupTrav1.push(traversalElemv12i);
  const traversalElemv13 = createTraversalElement(currentVisuals[2].type);
  traversalElemv13.element = await getTraversalElement(currentVisuals[2].name);
  traversalElemv13.categories = ["general"];
  groupTrav1.push(traversalElemv13);
  group.visuals.push(groupTrav1);
  group.type = groupType.all;

  const groupTrav2 = [];
  const traversalElemv21 = createTraversalElement(currentVisuals[3].type);
  traversalElemv21.element = await getTraversalElement(currentVisuals[3].name);
  traversalElemv21.categories = ["insight"];
  groupTrav2.push(traversalElemv21);
  const traversalElemv22 = createTraversalElement(currentVisuals[4].type);
  traversalElemv22.element = await getTraversalElement(currentVisuals[4].name);
  traversalElemv22.categories = ["interaction"];
  groupTrav2.push(traversalElemv22);
  group.visuals.push(groupTrav2);

  const traversalElem4 = createTraversalElement("group");
  traversalElem4.element = group;
  trav.push(traversalElem4);

  const traversalElem6g2 = createTraversalElement(currentVisuals[6].type);
  traversalElem6g2.element = await getTraversalElement(currentVisuals[6].name);
  traversalElem6g2.categories = ["general"];
  traversalElem6g2.count = 2;
  trav.push(traversalElem6g2);
  const traversalElemv23 = createTraversalElement(currentVisuals[5].type);
  traversalElemv23.element = await getTraversalElement(currentVisuals[5].name);
  traversalElemv23.categories = ["general"];
  trav.push(traversalElemv23);
  const traversalElemv23i = createTraversalElement(currentVisuals[5].type);
  traversalElemv23i.element = await getTraversalElement(currentVisuals[5].name);
  traversalElemv23i.categories = ["interaction"];
  trav.push(traversalElemv23i);
  const traversalElemv13i = createTraversalElement(currentVisuals[2].type);
  traversalElemv13i.element = await getTraversalElement(currentVisuals[2].name);
  traversalElemv13i.categories = ["interaction"];
  trav.push(traversalElemv13i);
  const traversalElem6 = createTraversalElement(currentVisuals[6].type);
  traversalElem6.element = await getTraversalElement(currentVisuals[6].name);
  traversalElem6.categories = ["interaction"];
  trav.push(traversalElem6);

  const group2 = createGroup();

  const groupTrav22 = [];
  const traversalElemv212 = createTraversalElement(currentVisuals[3].type);
  traversalElemv212.element = await getTraversalElement(currentVisuals[3].name);
  traversalElemv212.count = 2;
  traversalElemv212.categories = ["insight"];
  groupTrav22.push(traversalElemv212);
  const traversalElemv222 = createTraversalElement(currentVisuals[4].type);
  traversalElemv222.element = await getTraversalElement(currentVisuals[4].name);
  traversalElemv222.categories = ["interaction"];
  traversalElemv222.count = 2;
  groupTrav22.push(traversalElemv222);
  group2.visuals.push(groupTrav22);

  const traversalElem42 = createTraversalElement("group");
  traversalElem42.element = group2;
  traversalElem42.count = 2;
  trav.push(traversalElem42);
  const traversalElem7 = createTraversalElement("globalFilter");
  traversalElem7.element = await getTraversalElement("globalFilter");
  trav.push(traversalElem7);
  return trav;
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
        currentVisuals.find((vis) => vis.name === visualId),
        count,
        categories!
      );
      break;
  }
}

export function getCurrentTraversalElementType() {
  const currentElement = global.settings.traversalStrategy[currentId];

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
    firstVisuals.push(global.settings.traversalStrategy[currentId + 1]);
  }
  createInformationCard("group", currentElement.count, firstVisuals, undefined);
}

export function findVisualIndexInTraversal(id: string, count: number) {
  const elem = global.settings.traversalStrategy.find(
    (vis) => vis.element.id === id && vis.count === count
  );
  let index = global.settings.traversalStrategy.indexOf(elem!);
  if (index == -1) {
    const groups = global.settings.traversalStrategy.filter((object) =>
      isGroup(object.element)
    );
    for (const group of groups) {
      for (const groupTraversal of group.element.visuals) {
        const elemInGroup = groupTraversal.find(
          (visInGroup: TraversalElement) =>
            visInGroup.element.id === id && visInGroup.count === count
        );
        if (elemInGroup) {
          const groupElem = global.settings.traversalStrategy.find(
            (vis) =>
              vis.element.id === group.element.id && vis.count === group.count
          );
          const groupIndex = global.settings.traversalStrategy.indexOf(
            groupElem!
          );
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
  const traversalElem = global.settings.traversalStrategy[currentId];
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
  const traversalElem = global.settings.traversalStrategy[currentId].element;

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
  const style =
    `overflow: auto;position:fixed;top:10px;left:50%;margin-left:` +
    -(global.explainGroupCardWidth / 2) +
    `px;width:` +
    global.explainGroupCardWidth +
    `px;height:` +
    global.explainGroupCardHeight +
    `px;pointer-events:auto;border-radius:10px;background-color:lightsteelblue;z-index: 99 !important;`;
  helpers.createCard("explainGroupCard", style, "");
  helpers.addContainerOffset(global.explainGroupCardHeight);
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
  const currentElement = traversalStrategy[currentId].element;
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
  let traversalElem: TraversalElement = {
    element: "",
    categories: [],
    count: 0,
  };
  try {
    const idParts: string[] = sNode.id.split(" ");
    let nodeId: string = sNode.id;
    let nodeCat: string = "general";
    if (idParts.length > 1) {
      nodeId = idParts[0];
      nodeCat = idParts[1].toLowerCase();
    }
    traversalElem = createTraversalElement(sNode.data.type);
    traversalElem.element = await getTraversalElement(nodeId);
    traversalElem.categories = [nodeCat];
  } catch (error) {}

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
        trav.push(travElem);
      }
    }
    console.log("Trav", trav);
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
    default:
      categories = ["general", "interaction", "insight"];
      break;
  }
  return categories;
}
