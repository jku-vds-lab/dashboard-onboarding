import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import * as disable from "./disableArea";
import { createVisualInfo } from "./visualInfo";
import {
  addGroupInGroupIndex,
  createInformationCard,
  createLookedAtIds,
  currentGroupElement,
  currentId,
  getCurrentTraversalElementType,
  groupType,
  isGroup,
  lookedAtInGroup,
  setCurrentId,
  setGroup,
  setTraversalInGroupIndex,
  setVisualInGroupIndex,
  TraversalElement,
  traversalInGroupIndex,
  updateLookedAt,
  visualInGroupIndex,
} from "./traversal";

import { VisualDescriptor } from "powerbi-client";
import { getDataWithId } from "../../componentGraph/helperFunctions";
import { textSize } from "./sizes";
import { decrement, ExpertiseLevel, Level } from "../../UI/redux/expertise";
import { store } from "../../UI/redux/store";
import { startOnboardingAt } from "./onboarding";

export async function createInfoCard(
  visual: VisualDescriptor,
  count: number,
  categories: string[],
  expertiseLevel?: ExpertiseLevel
) {
  disable.disableFrame();
  disable.createDisabledArea(visual);

  const position = helpers.getVisualCardPos(
    visual,
    global.infoCardWidth,
    global.infoCardMargin
  );

  const style = helpers.getCardStyle(
    position.y,
    position.x,
    global.infoCardWidth,
    ""
  );
  if (position.pos === "left") {
    helpers.createCard("infoCard", style, "rectLeftBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "infoCard"
    );
  } else {
    helpers.createCard("infoCard", style, "rectRightBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "infoCard"
    );
  }

  createExpertiseSlider("visual", categories, count, "infoCard", visual);

  let traversal: TraversalElement[];
  if (global.explorationMode) {
    traversal = global.basicTraversal;
  } else {
    traversal = global.settings.traversalStrategy;
  }

  const visualData = getDataWithId(
    traversal,
    visual.name,
    categories,
    count
  );
  helpers.createCardContent(visualData?.title, "", "infoCard");

  createInfoCardButtons(traversal, visual.name, categories, count);
  await createVisualInfo(traversal, visual, count, categories, expertiseLevel);
}

export function createExpertiseSlider(type: string, categories: string[], count: number, parentId: string, visual?: VisualDescriptor){
  const currentValue = currentSliderValue(categories).toString();
  elements.createSlider({id: "level", min: "1", max: "3", value: currentValue, parentId: parentId},
  { type: type, categories: categories, count: count, visual: visual }, setExpertiseLevel);
  elements.createSliderLabels(["less Details", "", "more Details"], parentId);
}

function currentSliderValue(categories: string[]){
  const state = store.getState();
  const expertise = state.expertise;
  let currentValue;
  if(categories.includes("general") && categories.includes("insight")){
    if(expertise.Vis < expertise.Domain ){
      currentValue = expertise.Vis;
    } else {
      currentValue = expertise.Domain;
    }
  } else if(categories.includes("general")){
    currentValue = expertise.Vis;
  } else if(categories.includes("insight")){
    currentValue = expertise.Domain;
  }

  switch(currentValue){
    case 1:
      return Level.High;
    case 3:
      return Level.Low;
    default:
      return Level.Medium;
  }
}

async function setExpertiseLevel(visualInfo: { type: string, categories: string[], count: number, visual?: VisualDescriptor }){
  const slider = document.getElementById("level")! as HTMLInputElement;
  const sliderLevel = slider.value;
  let currentLevel;
  switch(sliderLevel){
    case "1":
      currentLevel = Level.High;
      break;
    case "3":
      currentLevel = Level.Low;
      break;
    default:
      currentLevel = Level.Medium;
      break;
  }
  let newExpertise: ExpertiseLevel;

  const state = store.getState();
  const expertise = state.expertise;

  if(visualInfo.categories.includes("general") && !visualInfo.categories.includes("insight")){
    newExpertise = {Domain: expertise.Domain, Vis: currentLevel};
  } else if(visualInfo.categories.includes("insight") && !visualInfo.categories.includes("general")){
    newExpertise = {Domain: currentLevel, Vis: expertise.Vis};
  } else {
    newExpertise = {Domain: currentLevel, Vis: currentLevel};
  }

  store.dispatch(decrement(newExpertise));
  await startOnboardingAt(visualInfo.type, visualInfo.visual, visualInfo.categories, visualInfo.count, newExpertise);
}

export function createInfoCardButtons(
  traversal: TraversalElement[],
  id: string,
  categories: string[],
  count: number
) {
  if (
    currentId === 0 &&
    currentId === traversal.length - 1 &&
    global.isGuidedTour
  ) {
    createCardButtonsWithGroup(traversal, id, categories, count, "", "close");
  } else if (currentId === 0 && global.isGuidedTour) {
    createCardButtonsWithGroup(traversal, id, categories, count, "", "next");
  } else if (currentId === traversal.length - 1 && global.isGuidedTour) {
    createCardButtonsWithGroup(
      traversal,
      id,
      categories,
      count,
      "previous",
      "close"
    );
  } else {
    createCardButtonsWithGroup(
      traversal,
      id,
      categories,
      count,
      "previous",
      "next"
    );
  }
}

export function createCardButtonsWithGroup(
  traversal: TraversalElement[],
  id: string,
  categories: string[],
  count: number,
  leftButton: string,
  rightButton: string
) {
  const traversalElem = traversal[currentId].element;
  if (isGroup(traversalElem)) {
    const travLength = getElementIndexInGroup(traversalElem, id, categories, count);
    if(!travLength){
      return;
    }

    if (visualInGroupIndex === (travLength -1) && visualInGroupIndex === 0) {
      createCardButtonsForLastGroupElement(traversal, "", rightButton, traversalElem);
    } else if (visualInGroupIndex === (travLength -1)) {
      createCardButtonsForLastGroupElement(traversal,
        "previousInGroup",
        rightButton,
        traversalElem
      );
    } else if (visualInGroupIndex === 0) {
      helpers.createCardButtons("cardButtons", leftButton, "", "nextInGroup");
    } else {
      helpers.createCardButtons(
        "cardButtons",
        "previousInGroup",
        "",
        "nextInGroup"
      );
    }
  } else {
    helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
  }
}


function getElementIndexInGroup( traversalElem: any,
  id: string,
  categories: string[],
  count: number): number | undefined{
  for (let i = 0; i < traversalElem.visuals.length; i++) {
    for(let j = 0; j < traversalElem.visuals[i].length; j++){
      const visInGroup = traversalElem.visuals[i][j];
      if(isGroup(visInGroup.element)){
          const travLength = getElementIndexInGroup(visInGroup.element, id, categories, count);
          if(travLength !== null && travLength !== undefined){
            addGroupInGroupIndex([i, j]);
            setGroup(visInGroup);
            return travLength;
          }
      } else{
        if(visInGroup.element.id === id &&
          visInGroup.categories.every((category: string) => categories.includes(category)) &&
          visInGroup.count === count){
            setVisualInGroupIndex(j);
            setTraversalInGroupIndex(i);
            return traversalElem.visuals[i].length;
          }
      }
    }
  }
  return undefined;
}

function createCardButtonsForLastGroupElement(
  traversal: TraversalElement[],
  leftButton: string,
  rightButton: string,
  traversalElem: any
) {
  if (global.explorationMode) {
    helpers.createCardButtons("cardButtons", leftButton, "", "back to group");
  } else {
    const group = currentGroupElement? currentGroupElement.element : traversalElem;
    if (group.type === groupType.onlyOne) {
      helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
    }  else if (group.type === groupType.atLeastOne) {
      let outOfGroupButton = "out of group";
      if (
        currentId === traversal.length - 1 &&
        global.isGuidedTour
      ) {
        outOfGroupButton = "close";
      }
      if(leftButton){
        helpers.createCardButtons("cardButtons", leftButton, outOfGroupButton, "back to group");
      } else {
        helpers.createCardButtons("cardButtons", outOfGroupButton, "", "back to group");
      }
    } else {
      let traversed = 0;
      for (const trav of group.visuals) {
        if (
          trav.every((vis: TraversalElement) =>
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
          traversed++;
        }
      }
      if (traversed === traversalElem.visuals.length) {
        lookedAtInGroup.elements = [];
        lookedAtInGroup.groupId = "";
        helpers.createCardButtons("cardButtons", leftButton, "", rightButton);
      } else {
        helpers.createCardButtons(
          "cardButtons",
          leftButton,
          "",
          "back to group"
        );
      }
    }
  }
}

export function removeInfoCard() {
  elements.removeElement("infoCard");
  elements.removeElement("disabledUpper");
  elements.removeElement("disabledLower");
  elements.removeElement("disabledRight");
  elements.removeElement("disabledLeft");
  disable.removeFrame();
}

export function nextInfoCard() {
  if (global.explorationMode) {
    if (currentId == global.basicTraversal.length - 1) {
      setCurrentId(0);
    } else {
      setCurrentId(currentId + 1);
    }

    getCurrentTraversalElementType(global.basicTraversal);
  } else {
    if (currentId == global.settings.traversalStrategy.length - 1) {
      setCurrentId(0);
    } else {
      setCurrentId(currentId + 1);
    }

    lookedAtInGroup.groupId = "";
    lookedAtInGroup.elements = [];

    getCurrentTraversalElementType(global.settings.traversalStrategy);
  }
}

export function previousInfoCard() {
  if (global.explorationMode) {
    if (currentId == 0) {
      setCurrentId(global.basicTraversal.length - 1);
    } else {
      setCurrentId(currentId - 1);
    }

    getCurrentTraversalElementType(global.basicTraversal);
  } else {
    if (currentId == 0) {
      setCurrentId(global.settings.traversalStrategy.length - 1);
    } else {
      setCurrentId(currentId - 1);
    }

    lookedAtInGroup.groupId = "";
    lookedAtInGroup.elements = [];

    getCurrentTraversalElementType(global.settings.traversalStrategy);
  }
}

export function nextInGroup() {
  const currentElement = currentGroupElement? currentGroupElement.element : global.settings.traversalStrategy[currentId].element;

  setVisualInGroupIndex(visualInGroupIndex + 1);

  const traversal = currentElement.visuals[traversalInGroupIndex];
  const visual = traversal[visualInGroupIndex];

  const lookedAt = createLookedAtIds(
    visual.element.id,
    visual.categories,
    visual.count
  );
  updateLookedAt(lookedAt);

  if (currentElement.id === "dashboard") {
    createInformationCard("dashboard", visual.count);
  } else if (currentElement.id === "globalFilter") {
    createInformationCard("globalFilter", visual.count);
  } else {
    createInformationCard(
      "visual",
      visual.count,
      undefined,
      visual.element.id,
      visual.categories
    );
  }
}

export function previousInGroup() {
  const currentElement = currentGroupElement? currentGroupElement.element : global.settings.traversalStrategy[currentId].element;

  setVisualInGroupIndex(visualInGroupIndex - 1);

  const traversal = currentElement.visuals[traversalInGroupIndex];
  const visual = traversal[visualInGroupIndex];

  const lookedAt = createLookedAtIds(
    visual.element.id,
    visual.categories,
    visual.count
  );
  updateLookedAt(lookedAt);
  if (currentElement.id === "dashboard") {
    createInformationCard("dashboard", visual.count);
  } else if (currentElement.id === "globalFilter") {
    createInformationCard("globalFilter", visual.count);
  } else {
    createInformationCard(
      "visual",
      visual.count,
      undefined,
      visual.element.id,
      visual.categories
    );
  }
}
