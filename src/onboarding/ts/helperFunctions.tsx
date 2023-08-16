import * as global from "./globalVariables";
import * as elements from "./elements";
import { getStartFunction } from "./introCards";
import {
  previousInfoCard,
  nextInfoCard,
  createInfoCard,
  nextInGroup,
  previousInGroup,
} from "./infoCards";
import { removeFrame } from "./disableArea";
import {
  createGuidedTour,
  createDashboardExploration,
  createOnboardingOverlay,
} from "./onboarding";
//import { saveOnboardingChanges } from "./authorMode";
import { createSettings } from "./createSettings";
// import { addVisualTextarea } from "./listOfVisuals";
import {
  getInteractionText,
  removeInteractionCard,
  startInteractionExample,
} from "./interactionExample";
import {
  removeHintCard,
  removeShowChangesCard,
  showReportChanges,
} from "./showReportChanges";
import { getCardInfo, getSlicerInfo } from "./basicVisualContent";
import { getLineClusteredColumnComboChartInfo } from "./complexVisualContent";
import LineChart from "./Content/lineChartVisualContent";
import {
  getClusteredBarChartInfo,
  getClusteredColumnChartInfo,
} from "./barChartVisualContent";
import { getFilterDescription } from "./filterInfoCards";
import { IFilterColumnTarget, IFilterMeasureTarget } from "powerbi-models";
import "powerbi-report-authoring";
import { VisualDescriptor } from "powerbi-client";
import ComponentGraph, {
  replacer,
  reviver,
} from "../../componentGraph/ComponentGraph";
import Filter from "../../componentGraph/Filter";
import { exportData } from "../../Provenance/utils";
import * as sizes from "./sizes";
import {
  TraversalElement,
  createGroupOverlay,
  createInformationCard,
  findCurrentTraversalVisual,
  findCurrentTraversalVisualIndex,
  isGroup,
} from "./traversal";
import { reportId } from "../../Config";
import Visualization from "../../componentGraph/Visualization";
import BarChart from "./Content/barChartVisualContent";
import ColumnChart from "./Content/columnChartVisualContent";
import BasicTextFormat from "./Content/Format/basicTextFormat";

export function addContainerOffset(cardHeight: number) {
  const rect = document
    .getElementById("flexContainer")!
    .getBoundingClientRect();
  const pageOffset = parseInt(
    window.getComputedStyle(document.getElementById("flexContainer")!)
      .paddingTop
  );
  const buttonHeaderHeight =
    document.getElementById("onboarding-header")!.clientHeight;
  const reportOffsetTop = parseInt(
    window.getComputedStyle(document.getElementById("reportContainer")!)
      .paddingTop
  );

  const header = document.getElementById("onboarding-header");
  if (header) {
    const headerOffset = cardHeight - pageOffset + global.globalCardTop;
    header.style.marginTop = headerOffset + "px";
  }

  const onboarding = document.getElementById("onboarding");
  if (onboarding) {
    global.setOnboardingOffset(
      pageOffset + buttonHeaderHeight + reportOffsetTop + rect.top
    );
    const top =
      global.globalCardTop +
      cardHeight +
      buttonHeaderHeight +
      reportOffsetTop +
      rect.top;
    onboarding.style.top = top + "px";
  }

  global.setContainerPaddingTop(
    global.report.iframe.offsetTop + global.settings.reportOffset.top
  );
}

function backToVisual() {
  removeContainerOffset();
  global.setInteractionMode(false);
  removeOnboardingOverlay();

  removeInteractionCard();
  removeShowChangesCard();
  removeHintCard();
  const traversalElement = findCurrentTraversalVisual();
  if (traversalElement) {
    createInfoCard(
      traversalElement[0],
      traversalElement[2],
      traversalElement[1]
    );
  }
}

export function createBasicCardContent(description: string, parentId: string) {
  const divAttributes = global.createDivAttributes();
  divAttributes.id = "basicCardContent";
  divAttributes.classes = "contentPlacementSmall";
  divAttributes.parentId = parentId;
  elements.createDiv(divAttributes);

  const spanAttributes = global.createSpanAttributes();
  spanAttributes.id = "basicContentText";
  spanAttributes.style = `font-size: ${sizes.textSize}rem`;
  spanAttributes.content = description;
  spanAttributes.parentId = "basicCardContent";
  elements.createSpan(spanAttributes);
}

export function createCard(id: string, style: string, classes: string) {
  const attributes = global.createDivAttributes();
  attributes.id = id;
  attributes.style = style;
  attributes.classes = classes;
  attributes.parentId = "onboarding";
  elements.createDiv(attributes);
}

export function createCardButtons(
  id: string,
  leftButton: string,
  middleButton: string,
  rightButton: string
) {
  const divAttributes = global.createDivAttributes();
  divAttributes.id = id;
  divAttributes.parentId = "cardContent";
  divAttributes.style = "height: 50px; clear: both;";
  elements.createDiv(divAttributes);

  if (leftButton != "") {
    const buttonAttributes = global.createButtonAttributes();
    buttonAttributes.classes =
      global.darkOutlineButtonClass + " positionLeft cardButtons";
    buttonAttributes.style = `font-size: ${sizes.textSize}rem; margin-bottom: 20px;`;
    buttonAttributes.parentId = id;
    switch (leftButton) {
      case "skip":
        buttonAttributes.id = "skipButton";
        buttonAttributes.content = "Skip";
        buttonAttributes.function = removeOnboarding;
        break;
      case "back to visual":
        buttonAttributes.id = "backButton";
        buttonAttributes.content = "Back to visual";
        buttonAttributes.function = backToVisual;
        break;
      case "cancel":
        buttonAttributes.id = "cancelButton";
        buttonAttributes.content = "Cancel";
        buttonAttributes.function = removeOnboarding;
        break;
      case "previousInGroup":
        buttonAttributes.id = "previousInGroupButton";
        buttonAttributes.content = "Previous";
        buttonAttributes.function = previousInGroup;
        break;
      case "back to group":
        buttonAttributes.id = "backToGroupButton";
        buttonAttributes.content = "Previous";
        buttonAttributes.function = createGroupOverlay;
        break;
      default:
        buttonAttributes.id = "previousButton";
        buttonAttributes.content = "Previous";
        buttonAttributes.function = previousInfoCard;
    }
    elements.createButton(buttonAttributes);
  }

  if (rightButton != "") {
    const buttonAttributes = global.createButtonAttributes();
    buttonAttributes.classes =
      global.darkOutlineButtonClass + " positionRight cardButtons";
    buttonAttributes.style = `font-size: ${sizes.textSize}rem; margin-bottom: 20px;`;
    buttonAttributes.parentId = id;
    if (leftButton == "") {
      buttonAttributes.style += "margin-bottom: 20px;";
    }
    switch (rightButton) {
      case "close":
        buttonAttributes.id = "endButton";
        buttonAttributes.content = "Close";
        buttonAttributes.function = removeOnboarding;
        break;
      case "start":
        buttonAttributes.id = "startButton";
        buttonAttributes.content = "Start";
        buttonAttributes.function = getStartFunction();
        break;
      case "back to visual":
        buttonAttributes.id = "backButton";
        buttonAttributes.content = "Back to visual";
        buttonAttributes.function = backToVisual;
        break;
      case "back to overview":
        buttonAttributes.id = "backToOverviewButton";
        buttonAttributes.content = "Back to overview";
        buttonAttributes.function = showReportChanges;
        break;
      case "nextInGroup":
        buttonAttributes.id = "nextInGroupButton";
        buttonAttributes.content = "Next";
        buttonAttributes.function = nextInGroup;
        break;
      // case "save":
      //     buttonAttributes.id = "saveButton";
      //     buttonAttributes.content = "Save";
      //     buttonAttributes.function = saveOnboardingChanges;
      //     break;
      case "back to group":
        buttonAttributes.id = "backToGroupButton";
        buttonAttributes.content = "Next";
        buttonAttributes.function = createGroupOverlay;
        break;
      default:
        buttonAttributes.id = "nextButton";
        buttonAttributes.content = "Next";
        buttonAttributes.function = nextInfoCard;
    }
    elements.createButton(buttonAttributes);
  }
}

export function createCardContent(
  headline: string | undefined,
  description: string | undefined,
  parentId: string
) {
  const divAttributes = global.createDivAttributes();
  divAttributes.id = "cardContent";
  divAttributes.classes = "contentPlacementBig";
  divAttributes.parentId = parentId;
  elements.createDiv(divAttributes);

  const h1Attributes = global.createH1Attributes();
  h1Attributes.id = "cardHeadline";
  if (!headline) {
    h1Attributes.content = "";
  } else {
    h1Attributes.content = headline;
  }
  h1Attributes.parentId = "cardContent";
  h1Attributes.style = `font-size: ${sizes.headlineSize}rem`;
  elements.createH1(h1Attributes);

  const spanAttributes = global.createSpanAttributes();
  spanAttributes.id = "contentText";
  if (!description) {
    spanAttributes.content = "";
  } else {
    spanAttributes.content = description;
  }
  spanAttributes.parentId = "cardContent";
  spanAttributes.style = `font-size: ${sizes.textSize}rem`;
  elements.createSpan(spanAttributes);
}

export function createCloseButton(
  buttonId: string,
  buttonClasses: string,
  buttonStyle: string,
  functionName: any,
  parentId: string
) {
  const buttonAttributes = global.createButtonAttributes();
  buttonAttributes.id = buttonId;
  buttonAttributes.classes = "btn-close " + buttonClasses;
  if (sizes.divisor > 2) {
    buttonStyle += `; width: 5px; height: 5px`;
  }
  buttonAttributes.style = buttonStyle;
  buttonAttributes.function = functionName;
  buttonAttributes.parentId = parentId;
  elements.createButton(buttonAttributes);
}

export function createCollapseButton(Id: string, parentId: string) {
  const buttonAttributes = global.createButtonAttributes();
  buttonAttributes.id = Id;
  buttonAttributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>`;
  buttonAttributes.style = "padding-top: 0px;padding-bottom: 0px;";
  buttonAttributes.classes = "btn " + Id + " positionRight";
  buttonAttributes.parentId = parentId;
  elements.createButton(buttonAttributes);

  const collapseButton = document.getElementById(Id);
  collapseButton?.setAttribute("data-bs-toggle", "collapse");
  collapseButton?.setAttribute("data-bs-target", "#collapseForm" + parentId);
  collapseButton?.setAttribute("aria-expanded", "false");
  collapseButton?.setAttribute("aria-controls", "collapseForm" + parentId);
}

export function createDisableButton(parentId: string) {
  const attributes = global.createButtonAttributes();
  attributes.style = "padding-top: 0px;padding-bottom: 0px;";
  attributes.classes = "btn disableVisualButton";
  attributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye mb-2" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>`;
  attributes.parentId = parentId;
  elements.createButton(attributes);
}

export function createEditOnboardingButtons() {
  const editButton = document.getElementById("editOnboarding");
  editButton?.removeAttribute("hidden");
  //     const attributes = global.createButtonAttributes();
  //     attributes.id = "editOnboarding";
  //     attributes.content = "Edit Dashboard Onboarding";
  //     attributes.style =  global.onboardingButtonStyle;
  //     attributes.classes = "col-2 " + global.darkOutlineButtonClass;
  //     attributes.function = createOnboardingEditing;
  //     attributes.parentId = "onboarding-header";
  //     elements.createButton(attributes);
}

export function createEnableButton(parentId: string) {
  const attributes = global.createButtonAttributes();
  attributes.style = "padding-top: 0px;padding-bottom: 0px;";
  attributes.classes = "btn disableVisualButton";
  attributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash mb-2" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/></svg>`;
  attributes.parentId = parentId;
  elements.createButton(attributes);
}

// export function createInfoForm(infoType: string, visualID: string, Infos: string | any[]){
//     const infoTitle = firstLetterToUpperCase(infoType);

//     const labelAttributes = global.createLabelAttributes();
//     labelAttributes.id = infoType + "InfosLabel" + visualID;
//     labelAttributes.for = infoType + "InfosTextarea" + visualID;
//     labelAttributes.style = "display: block;margin-left: 10px;";
//     labelAttributes.content = infoTitle + " Information:";
//     labelAttributes.parentId = "collapseForm" + visualID;
//     elements.createLabel(labelAttributes);

//     for (let i = 0; i < Infos.length; ++i) {
//         const Info = Infos[i].replaceAll("<br>", '\r\n');
//         const textareaAttributes = global.createTextareaAttributes();
//         textareaAttributes.id = i + infoType+ "InfosTextarea" + visualID;
//         textareaAttributes.class = infoType+ "Infos" + visualID;
//         textareaAttributes.value = Info;
//         textareaAttributes.style = "display: block;width: 95%;margin-bottom: 5px;margin-left: 10px;background-color: lightsteelblue;";
//         textareaAttributes.parentId = "collapseForm" + visualID;
//         elements.createTextarea(textareaAttributes, false);
//     }

//     const addButtonAttributes = global.createButtonAttributes();
//     addButtonAttributes.id = "add"+ infoTitle + "Info" + visualID;
//     addButtonAttributes.content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg> Add`;
//     addButtonAttributes.style =  "margin: auto;display: block;";
//     addButtonAttributes.classes = global.darkOutlineButtonClass;
//     addButtonAttributes.function = function(){
//         addVisualTextarea(infoType, visualID);
//     };
//     addButtonAttributes.parentId = "collapseForm" + visualID;
//     elements.createButton(addButtonAttributes);
// }

export async function createInteractionExampleButton(
  parentId: string,
  visual: any
) {
  if (!(await getVisualData(visual))) {
    return;
  }
  elements.removeElement("interactionExample");

  const attributes = global.createButtonAttributes();
  attributes.id = "interactionExample";
  attributes.content = "Try it out";
  attributes.style =
    "display:block;margin:0 auto;margin-top:10px;margin-bottom:10px;" +
    `font-size: ${sizes.textSize}rem;`;
  attributes.classes = global.darkOutlineButtonClass;
  attributes.function = startInteractionExample;
  attributes.parentId = parentId;
  elements.createButton(attributes);
}

export function createOnboarding() {
  const style = getDisabledStyle(
    global.containerPaddingTop,
    global.containerPaddingLeft,
    global.reportWidth!,
    global.reportHeight!
  );

  const attributes = global.createDivAttributes();
  attributes.id = "onboarding";
  attributes.style = style;
  attributes.parentId = "embed-container";
  elements.createDiv(attributes);
}

export function createOnboardingButtons() {
  elements.removeElement("guidedTour");
  elements.removeElement("dashboardExploration");

  let attributes = global.createButtonAttributes();
  attributes.id = "guidedTour";
  attributes.content = "Start Guided Tour";
  attributes.style = global.onboardingButtonStyle;
  attributes.classes =
    "onboardingButton col-2 " + global.darkOutlineButtonClass;
  attributes.function = createGuidedTour;
  attributes.parentId = "onboarding-header";
  elements.createButton(attributes);

  attributes = global.createButtonAttributes();
  attributes.id = "dashboardExploration";
  attributes.content = "Start Dashboard Exploration";
  attributes.style = global.onboardingButtonStyle;
  attributes.classes =
    "onboardingButton col-2 " + global.darkOutlineButtonClass;
  attributes.function = createDashboardExploration;
  attributes.parentId = "onboarding-header";
  elements.createButton(attributes);
}

export function createTitleForm(ID: string, title: string) {
  const labelAttributes = global.createLabelAttributes();
  labelAttributes.id = "titleLabel" + ID;
  labelAttributes.for = "titleInput" + ID;
  labelAttributes.style = "margin-left: 10px;margin-right: 10px;";
  labelAttributes.content = "Title:";
  labelAttributes.parentId = "collapseForm" + ID;
  elements.createLabel(labelAttributes);

  const inputAttributes = global.createInputAttributes();
  inputAttributes.id = "titleInput" + ID;
  inputAttributes.type = "string";
  inputAttributes.value = title;
  inputAttributes.style = "margin-right: 20px;background-color:lightsteelblue;";
  inputAttributes.parentId = "collapseForm" + ID;
  elements.createInput(inputAttributes);
}

export function dataToString(dataArray: string | any[]) {
  let dataString = "";
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].length != 0) {
      dataString += dataArray[i];
      if (i == dataArray.length - 2) {
        dataString += " and ";
      } else if (i != dataArray.length - 1) {
        dataString += ", ";
      }
    }
  }
  return dataString;
}

export function dataToStringNoConnection(dataArray: string | any[]) {
  let dataString = "";
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].length != 0) {
      dataString += dataArray[i];
      if (i != dataArray.length - 1) {
        dataString += " ";
      }
    }
  }
  return dataString;
}

function endExplorationMode() {
  elements.removeElement("dashboardExplaination");
  global.setExplorationMode(false);
  global.setHasOverlay(false);
  const button = document.getElementById("dashboardExploration");
  if (!button) {
    return;
  }
  button.innerHTML = "Start Dashboard Exploration";
}

export function firstLetterToUpperCase(str: string) {
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

export async function getActivePage() {
  const pages = await global.report.getPages();
  const page = pages.filter(function (page: { isActive: any }) {
    return page.isActive;
  })[0];
  if (!page) {
    getActivePage();
  }
  global.setPage(page);
}

export function getCardStyle(
  top: number,
  left: number,
  width: number,
  height: string
) {
  return (
    getClickableStyle(top, left, width, height) +
    `border-radius:10px;background-color:lightsteelblue;z-index: 99 !important;`
  );
}

export function getClickableStyle(
  top: number,
  left: number,
  width: number,
  height: string | number
) {
  return `position:absolute;pointer-events:auto;top:${top}px;left:${left}px;width:${width}px;height:${height}px;`;
}

export function getCloseFunction() {
  if (global.isGuidedTour) {
    return removeOnboarding;
  } else {
    return createOnboardingOverlay;
  }
}

export function getDataOfInteractionVisual(visual: any) {
  const visualsData = global.settings.interactionExample.visuals;
  const visualData = visualsData.find(function (data) {
    return data.id == visual.name;
  });

  return visualData;
}

export function getDataOfVisual(
  traversal: TraversalElement[],
  visual: any,
  count: number
) {
  const traversalElements = traversal;
  let foundVisual;
  for (const elem of traversalElements) {
    if (isGroup(elem.element)) {
      for (const groupTraversals of elem.element.visuals) {
        for (const groupElem of groupTraversals) {
          if (
            groupElem.element.id === visual.name &&
            groupElem.count == count
          ) {
            foundVisual = groupElem;
          }
        }
      }
    } else {
      if (elem.element.id === visual.name && elem.count == count) {
        foundVisual = elem;
      }
    }
  }
  return foundVisual?.element;
}

export function getDataWithId(
  traversal: TraversalElement[],
  ID: string,
  categories: string[],
  count: number
) {
  const traversalElements = traversal;
  let foundVisual;
  for (const elem of traversalElements) {
    if (isGroup(elem.element)) {
      for (const groupTraversals of elem.element.visuals) {
        for (const groupElem of groupTraversals) {
          if (
            groupElem.element.id === ID &&
            groupElem.categories.every((category: string) =>
              categories.includes(category)
            ) &&
            groupElem.count == count
          ) {
            foundVisual = groupElem;
          }
        }
      }
    } else {
      if (
        elem.element.id === ID &&
        elem.categories.every((category: string) =>
          categories.includes(category)
        ) &&
        elem.count == count
      ) {
        foundVisual = elem;
      }
    }
  }
  return foundVisual?.element;
}

function getDisabledStyle(
  top: number,
  left: number,
  width: number,
  height: number
) {
  return `position:absolute;pointer-events:none;top:${top}px;left:${left}px;width:${width}px;height:${height}px;`;
}

export async function getFieldColumn(
  visual: VisualDescriptor,
  fieldName: string
) {
  let column = "";
  const fields = (await visual.getDataFields(
    fieldName
  )) as IFilterColumnTarget[];
  if (fields.length != 0) {
    column = fields[0].column;
  }
  return column;
}

export async function getFieldMeasure(
  visual: VisualDescriptor,
  fieldName: string
) {
  let measure = "";
  const fields = (await visual.getDataFields(
    fieldName
  )) as IFilterMeasureTarget[];
  if (fields.length != 0) {
    measure = fields[0].measure;
  }
  return measure;
}

export async function getFieldMeasures(
  visual: VisualDescriptor,
  fieldName: string
) {
  const measures = [];
  const fields = (await visual.getDataFields(
    fieldName
  )) as IFilterMeasureTarget[];
  for (let i = 0; i < fields.length; i++) {
    measures.push(fields[i].measure);
  }
  return measures;
}

export async function getFieldColumns(
  visual: VisualDescriptor,
  fieldName: string
) {
  const columns = [];
  const fields = (await visual.getDataFields(
    fieldName
  )) as IFilterColumnTarget[];
  for (let i = 0; i < fields.length; i++) {
    columns.push(fields[i].column);
  }
  return columns;
}

export function getFilterInfo() {
  const filters = global.componentGraph.dashboard.globalFilter.filters;
  const filterInfos = [];
  for (let i = 0; i < filters.length; ++i) {
    const filter = filters[i] as Filter;
    filterInfos.push(getFilterDescription(filter));
  }

  return filterInfos;
}

export function getElementWidth(element: HTMLElement) {
  let elementWidth = element.clientWidth;
  const computedStyle = getComputedStyle(element);
  elementWidth -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);
  return elementWidth;
}

export function getGeneralInfoInteractionExampleText() {
  let generalInfo = `Can you see how the whole report changed?<br>All the visualizations were filtered by "all report filters".<br>You can now click on one of the cards or graphs to get detailed information about its changes.`;
  generalInfo = generalInfo.replaceAll("<br>", "\r\n");
  return generalInfo;
}

export function getGeneralInteractionInfo(
  additionalFilters: global.Target[],
  filterString: string
) {
  let visualInteractionInfo = "The highlighted data includes ";

  if (additionalFilters.length != 0) {
    let dataString = "";
    for (let i = 0; i < additionalFilters.length; i++) {
      dataString +=
        additionalFilters[i].target.column + " " + additionalFilters[i].equals;
      if (i != additionalFilters.length - 1) {
        dataString += " and ";
      }
    }
    visualInteractionInfo += " the " + filterString + " of " + dataString;
  } else {
    visualInteractionInfo += "all " + filterString;
  }

  return visualInteractionInfo;
}

export async function getInteractionExampleChangedInfo(
  visual: any,
  visualData: global.InteractionVisual
) {
  const changedInfoStatus = visualData.interactionChangedInfosStatus;
  let changedInfo;
  switch (changedInfoStatus) {
    case global.infoStatus.original:
      changedInfo = await getInteractionExampleChangesText(visual);
      changedInfo = changedInfo.replaceAll("<br>", "\r\n");
      break;
    case global.infoStatus.changed:
    case global.infoStatus.added:
      changedInfo = visualData.changedInteractionChangedInfo;
      break;
    default:
      changedInfo = "";
      break;
  }

  return changedInfo;
}

export async function getInteractionExampleChangesText(visual: any) {
  let visualChangeInfo = `You can see that this visual was filtered by "Filter".<br>`;

  const type = getTypeName(visual);

  switch (type) {
    case "Card":
    case "Multi Row Card":
      visualChangeInfo += `The displayed data is now "DataValue".`;
      break;
    case "Line Clustered Column Combo Chart":
    case "Line Chart":
    case "Clustered Bar Chart":
    case "clusteredColumnChart":
      visualChangeInfo += `The highlighted data includes "AllHighlitedData".`;
      visualChangeInfo +=
        "<br>You can also change the report filters by selecting a new element of this visual.";
      break;
    default:
      break;
  }

  return visualChangeInfo;
}

export function getInteractionExampleGeneralInfo() {
  const generalInfo = global.settings.interactionExample.generalInfoStatus;
  switch (generalInfo) {
    case global.infoStatus.original:
      return getGeneralInfoInteractionExampleText();
    case global.infoStatus.changed:
    case global.infoStatus.added:
      return global.settings.interactionExample.changedGeneralInfo.replaceAll(
        "<br>",
        "\r\n"
      );
    default:
      return "";
  }
}

export async function getInteractionExampleInteractionInfo(
  visual: any,
  visualData: global.InteractionVisual
) {
  const clickInfoStatus = visualData.clickInfosStatus;
  let interactionInfo;
  switch (clickInfoStatus) {
    case global.infoStatus.original:
      interactionInfo = await getInteractionText(visual);
      interactionInfo = interactionInfo?.replaceAll("<br>", "\r\n");
      break;
    case global.infoStatus.changed:
    case global.infoStatus.added:
      interactionInfo = visualData.changedClickInfo;
      break;
    default:
      interactionInfo = "";
      break;
  }

  return interactionInfo;
}

export function getNextVisual() {
  let nextVisual;
  const visuals = global.currentVisuals.filter(function (visual) {
    return visual.type !== "slicer";
  });

  const index = findCurrentTraversalVisualIndex();

  if (index >= visuals.length - 1) {
    nextVisual = visuals[0];
  } else {
    nextVisual = visuals[index + 1];
  }
  return nextVisual;
}

export function getNotSupportedInfo() {
  const defaultInfo = "Sadly we do not support this type of visual :(";
  document.getElementById("contentText")!.innerHTML = defaultInfo;
}

export async function createComponentGraph() {
  const graph = new ComponentGraph(
    global.report,
    global.page,
    global.allVisuals
  );
  await graph.setComponentGraphData();
}

export async function getSettings() {
  if (localStorage.getItem("settings") == null) {
    await createSettings();
  }
  global.setSettings(JSON.parse(localStorage.getItem("settings")!, reviver));
}

export async function getSpecificDataInfo(visual: any, dataName: string) {
  const dataMap = await getVisualData(visual);
  if (!dataMap || !dataName) {
    return [];
  }

  if (dataMap === "exportError") {
    const dataPoints = [];
    const data = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    )!.data.data;
    for (const map of data) {
      dataPoints.push(map.get(dataName));
    }
    return dataPoints;
  }

  return dataMap.get(dataName) ?? [];
}

export function getTargetInteractionFilter(target: string) {
  let visualInteractionInfo = "";
  const filter = global.selectedTargets.filter(function (data) {
    return data.target.column == target;
  });
  if (filter.length == 0) {
    visualInteractionInfo += " for all " + target + "s";
  } else {
    visualInteractionInfo += " for " + filter[0].equals;
  }
  return visualInteractionInfo;
}

export function getVisualCardPos(
  visual: any,
  cardWidth: number,
  offset: number
) {
  const leftDistance = visual.layout.x / sizes.reportDivisor;
  const rightX = leftDistance + visual.layout.width / sizes.reportDivisor;
  const rightDistance = global.reportWidth! - rightX;

  const position = {
    x: 0,
    y: 0,
    pos: "",
  };

  if (rightDistance > leftDistance || leftDistance < global.infoCardWidth) {
    position.x = offset + rightX;
    position.pos = "right";
  } else {
    position.x = leftDistance - offset - cardWidth;
    position.pos = "left";
  }
  position.y = offset + visual.layout.y / sizes.reportDivisor;

  return position;
}

export async function getVisualData(visual: any) {
  const exportedData = await exportData(visual);
  if (!exportedData) {
    return "exportError";
  }
  const visualData = exportedData.data;
  const headers = visualData.slice(0, visualData.indexOf("\r")).split(",");
  const rows = visualData.slice(visualData.indexOf("\n") + 1).split(/\r?\n/);
  rows.pop();
  const visualDataMap = new Map<string, string[]>();
  for (let i = 0; i < rows.length; i++) {
    const values = rows[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      const dataArray = visualDataMap.get(headers[j]) ?? [];
      dataArray.push(values[j]);
      visualDataMap.set(headers[j], dataArray);
    }
  }

  for (let i = 0; i < headers.length; i++) {
    const dataArray = visualDataMap.get(headers[i]) ?? [];
    visualDataMap.set(headers[i], dataArray);
  }

  return visualDataMap;
}

export async function getDataRange(visual: any, categorie: string) {
  const data = await getVisualData(visual);
  if (!data || data === "exportError") {
    return null;
  }

  let dataPoints = data.get(categorie);
  if (!dataPoints) {
    return null;
  }

  let numberArray: number[] = [];
  if (!isNaN(Number(dataPoints[0]))) {
    numberArray = dataPoints.map((str: string) => {
      return Number(str);
    });
  }

  for (let i = 0; i < dataPoints.length; i++) {
    const intArray = [];
    intArray.push(Math.min(...numberArray));
    intArray.push(Math.max(...numberArray));
    numberArray = intArray;
    dataPoints = numberArray.map((num: number) => {
      return num.toString();
    });
  }

  return dataPoints;
}

export function getVisualIndex(name: string) {
  const index = global.currentVisuals.findIndex(function (visual) {
    return visual.name == name;
  });
  return index;
}

export async function getVisualInfos(
  visual: VisualDescriptor
): Promise<BasicTextFormat> {
  const type = getTypeName(visual);
  let visualInfos: BasicTextFormat = {
    generalImages: [],
    generalInfos: [],
    interactionImages: [],
    interactionInfos: [],
    insightImages: [],
    insightInfos: [],
  };
  try {
    switch (type) {
      case "Card":
      case "Multi Row Card":
        visualInfos = await getCardInfo(visual);
        break;
      case "Line Clustered Column Combo Chart":
        visualInfos = await getLineClusteredColumnComboChartInfo(visual);
        break;
      case "Line Chart":
        const lineChart = new LineChart();
        visualInfos = await lineChart.getLineChartInfo(visual);
        break;
      case "Clustered Bar Chart":
        const barChart = new BarChart();
        visualInfos = await barChart.getClusteredBarChartInfo(visual);
        break;
      case "Clustered Column Chart":
        const columnChart = new ColumnChart();
        visualInfos = await columnChart.getClusteredColumnChartInfo(visual);
        break;
      case "Slicer":
        visualInfos = await getSlicerInfo(visual);
        break;
      default:
        break;
    }
    const CGVisual = global.componentGraph.dashboard.visualizations.find(
      (vis) => vis.id === visual.name
    );
    const insights = CGVisual?.insights?.insights!;
    for (const insight of insights) {
      visualInfos.insightImages.push("lightbulbImg");
      visualInfos.insightInfos.push(insight);
    }
  } catch (error) {
    console.log("Error in getVisualsInfo", error);
  }

  return visualInfos;
}

export async function getVisualsfromPowerBI() {
  const visuals = await global.page.getVisuals();
  global.setVisuals(visuals);
  sortVisuals();
  removeDesignVisuals();
  global.setAllVisuals(global.currentVisuals);
}

export function getVisualTitle(visual: any) {
  const CGVisual = global.componentGraph.dashboard.visualizations.find(
    (vis) => vis.id === visual.name
  )!;
  const title = CGVisual.title.title;
  if (title) {
    return title;
  } else {
    return getTypeName(visual);
  }
}

export function getTypeName(visual: any) {
  let typeName = visual.type.replaceAll(/([A-Z])/g, " $1").trim();
  typeName = firstLetterToUpperCase(typeName);
  return typeName;
}

export async function isVisible(
  visual: VisualDescriptor,
  selectorObject: string
) {
  if (selectorObject === "") {
    return true;
  }
  const selector = {
    objectName: selectorObject,
    propertyName: "visible",
  };
  const visible = await visual.getProperty(selector);
  if (visible.value) {
    return true;
  } else {
    return false;
  }
}

// export function orderSettingsVisuals(allVisuals: any[]){
//     const visDatas = global.settings.visuals;
//     global.settings.visuals = [];
//     for (const visual of allVisuals) {
//         const visData = visDatas.filter(function (element) {
//             return element.id === visual.name;
//         });
//         global.settings.visuals.push(visData[0]);
//     }
// }

export function recreateInteractionExampleButton() {
  const interactionButton = document.getElementById("interactionExample");
  if (!interactionButton) {
    const visual = global.currentVisuals[global.currentVisualIndex];
    let parent = document.getElementById("visualInfoTabs");
    if (parent) {
      createInteractionExampleButton("interactionTab", visual);
    }
    parent = document.getElementById("visualInfo");
    if (parent) {
      createInteractionExampleButton("visualInfo", visual);
    }
  }
}

export function removeContainerOffset() {
  const header = document.getElementById("onboarding-header");
  if (header) {
    header.style.marginTop = "0px";
  }

  const onboarding = document.getElementById("onboarding");
  if (onboarding) {
    onboarding.style.top = global.onboardingOffset + "px";
  }

  global.setContainerPaddingTop(
    global.report.iframe.offsetTop + global.settings.reportOffset.top
  );
}

function removeDesignVisuals() {
  const visuals = global.currentVisuals.filter(function (visual) {
    return (
      visual.type !== "shape" &&
      visual.type !== "basicShape" &&
      visual.type !== "textbox"
    );
  });
  global.setVisuals(visuals);
}

export function removeOnboarding() {
  removeContainerOffset();

  global.setInteractionMode(false);
  global.setIsGuidedTour(false);
  endExplorationMode();

  elements.removeElement("onboarding");
  removeFrame();
}

export function reloadOnboarding() {
  removeFrame();
  elements.removeElement("dashboardExplaination");
  elements.removeElement("onboarding");
  createOnboarding();
}

export function removeOnboardingOverlay() {
  global.setHasOverlay(false);
  elements.removeElement("dashboardExplaination");
  global.currentVisuals.forEach(function (visual) {
    elements.removeElement(visual.name);
  });
  elements.removeElement("globalFilter");
}

export function resizeEmbed(filterWidth: number) {
  try {
    document.getElementById(
      "embed-container"
    )!.style.cssText = `top:0px;left:0px;width:${
      global.reportWidth! + filterWidth
    }px;height:${
      global.reportHeight! +
      global.settings.reportOffset.top +
      global.footerHeight
    }px;`;
  } catch (error) {
    console.log("Error in resizeEmbed", error);
  }
}

export function saveIntInput(inputId: string) {
  let value;
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!input?.value) {
    value = 0;
  } else {
    value = parseInt(input?.value);
  }

  return value;
}

function sortVisuals() {
  global.currentVisuals.sort(function (a, b) {
    if (a.layout.x < b.layout.x) {
      return -1;
    } else if (a.layout.x > b.layout.x) {
      return 1;
    } else {
      if (a.layout.y < b.layout.y) {
        return -1;
      } else {
        return 1;
      }
    }
  });
}

export function startExplorationMode() {
  global.setExplorationMode(true);

  const button = document.getElementById("dashboardExploration");
  button!.innerHTML = "End Dashboard Exploration";
}

export async function toggleFilter(open: boolean) {
  const newSettings = {
    panes: {
      filters: {
        expanded: open,
        visible: true,
      },
      pageNavigation: {
        visible: true,
      },
    },
  };

  if (open) {
    resizeEmbed(global.filterOpenedWidth);
  } else {
    resizeEmbed(global.filterClosedWidth);
  }

  await global.report.updateSettings(newSettings);
}

export function getLocalFilterText(visual: Visualization | undefined) {
  let filterText = "";
  try {
    const filters = visual?.localFilters.localFilters!;
    const filterTexts = [];
    for (const filter of filters) {
      if (filter.operation !== "All") {
        let valueText = dataToString(filter.values);
        if (valueText !== "") {
          valueText = " Its current value is " + valueText + ".";
        }
        filterTexts.push(
          "The operation " +
            filter.operation +
            " is execuded for " +
            filter.attribute +
            "." +
            valueText +
            "<br>"
        );
      }
    }
    filterText = dataToStringNoConnection(filterTexts);
  } catch (error) {
    console.log("Error in getting local filter text", error);
  }

  return filterText;
}

export function saveInfoVideo(
  url: string,
  visId: string,
  categories: string[],
  count: number
) {
  const visData = getDataWithId(
    global.settings.traversalStrategy,
    visId,
    categories,
    count
  );
  if (!visData) {
    return;
  }

  visData.mediaType = global.mediaType.video;
  visData.videoURL = url;

  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

export async function handelNewReport() {
  if (global.settings.reportId !== reportId) {
    await createSettings();
  }
}
