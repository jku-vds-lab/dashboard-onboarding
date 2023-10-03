import { VisualDescriptor } from "visualDescriptor";
import * as global from "./globalVariables";
import {
  getVisualIndex,
  removeContainerOffset,
  removeOnboardingOverlay,
} from "./helperFunctions";
import { removeHintCard, removeShowChangesCard } from "./showReportChanges";
import { showVisualChanges } from "./showVisualsChanges";
import {
  createInformationCard,
  createLookedAtIds,
  currentId,
  findVisualIndexInTraversal,
  removeExplainGroupCard,
  setCurrentId,
  updateLookedAt,
} from "./traversal";
import * as sizes from "./sizes";

export function addStylesheet(URL: string) {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = URL;

  document.head.appendChild(style);
}

export function createDiv(attributes: {
  id: any;
  categories: string[];
  count: number;
  style: any;
  classes: any;
  content: any;
  role: any;
  label: any;
  clickable: any;
  selectedTargets?: any;
  eventType: any;
  eventFunction: any;
  parentId: any;
}) {
  const div = document.createElement("div");
  div.id = attributes.id;
  div.style.cssText = attributes.style;
  div.className = attributes.classes;
  div.innerHTML = attributes.content;
  div.setAttribute("role", attributes.role);
  div.setAttribute("aria-labelledby", attributes.label);
  div.addEventListener(attributes.eventType, attributes.eventFunction);
  if (attributes.clickable) {
    div.onclick = function () {
      if (global.interactionMode) {
        removeContainerOffset();
        removeOnboardingOverlay();
        removeShowChangesCard();
        removeHintCard();

        global.setInteractionSelectedVisual(
          global.currentVisuals[getVisualIndex(attributes.id)]
        );
        showVisualChanges(global.interactionSelectedVisual);
      } else {
        removeOnboardingOverlay();
        removeContainerOffset();
        removeExplainGroupCard();
        setCurrentId(
          findVisualIndexInTraversal(
            global.settings.traversalStrategy,
            attributes.id,
            attributes.count
          )
        );
        if (
          global.settings.traversalStrategy[currentId].element.id === "group"
        ) {
          const lookedAt = createLookedAtIds(
            attributes.id,
            attributes.categories,
            attributes.count
          );
          updateLookedAt(lookedAt);
        }
        if (attributes.id === "globalFilter") {
          createInformationCard("globalFilter", attributes.count);
        } else {
          createInformationCard(
            "visual",
            attributes.count,
            undefined,
            attributes.id,
            attributes.categories
          );
        }
      }
    };
  }

  document.getElementById(attributes.parentId)?.appendChild(div);
}

export function createButton(attributes: {
  id: any;
  count: number;
  content: any;
  style: any;
  classes: any;
  function: any;
  parentId: any;
}) {
  const button = document.createElement("button");
  button.id = attributes.id;
  button.type = "button";
  button.className = attributes.classes;
  button.innerHTML = attributes.content;
  button.style.cssText = attributes.style;
  button.onclick = attributes.function;

  document.getElementById(attributes.parentId)?.appendChild(button);
}

export function createSpan(attributes: {
  id: any;
  content: any;
  hidden: any;
  style: any;
  parentId: any;
}, classes?: string) {
  const span = document.createElement("span");
  span.id = attributes.id;
  span.className = classes? classes: "";
  span.innerHTML = attributes.content;
  span.style.cssText = attributes.style;
  span.setAttribute("aria-hidden", attributes.hidden);

  document.getElementById(attributes.parentId)?.appendChild(span);
}

export function createH1(attributes: {
  id: any;
  content: any;
  style: any;
  parentId: any;
}) {
  const h1 = document.createElement("h1");
  h1.id = attributes.id;
  h1.innerHTML = attributes.content;
  h1.style.cssText = attributes.style;

  document.getElementById(attributes.parentId)?.appendChild(h1);
}

export function createH2(attributes: {
  id: any;
  content: any;
  style: any;
  parentId: any;
}) {
  const h2 = document.createElement("h2");
  h2.id = attributes.id;
  h2.innerHTML = attributes.content;
  h2.style.cssText = attributes.style;

  document.getElementById(attributes.parentId)?.appendChild(h2);
}

export function createUL(attributes: {
  id: any;
  classes: any;
  role: any;
  parentId: any;
}) {
  const ul = document.createElement("ul");
  ul.id = attributes.id;
  ul.className = attributes.classes;
  if (attributes.role) {
    ul.setAttribute("role", attributes.role);
  }

  document.getElementById(attributes.parentId)?.appendChild(ul);
}

export function createLI(attributes: { id: any; classes: any; parentId: any }) {
  const li = document.createElement("li");
  li.id = attributes.id;
  li.className = attributes.classes;

  document.getElementById(attributes.parentId)?.appendChild(li);
}

export function createAnchor(
  attributes: {
    id: any;
    classes: any;
    href: any;
    content: any;
    selected: any;
    controles: any;
    toggle: any;
    role?: string;
    parentId: any;
    tab?: any;
  },
  isTab: boolean
) {
  const a = document.createElement("a");
  a.id = attributes.id;
  a.className = attributes.classes;
  a.href = attributes.href;
  a.innerHTML = attributes.content;
  if (isTab) {
    a.setAttribute("aria-selected", attributes.selected);
    a.setAttribute("aria-controls", attributes.controles);
    a.setAttribute("data-bs-toggle", attributes.toggle);
    a.setAttribute("role", attributes.tab);
  }

  document.getElementById(attributes.parentId)?.appendChild(a);
}

export function createLabel(attributes: {
  id: any;
  for: any;
  style: any;
  content: any;
  parentId: any;
}) {
  const label = document.createElement("label");
  label.id = attributes.id;
  label.setAttribute("for", attributes.for);
  label.style.cssText = attributes.style;
  label.innerHTML = attributes.content;

  document.getElementById(attributes.parentId)?.appendChild(label);
}

export function createSmall(attributes: {
  id: any;
  style: any;
  content: any;
  parentId: any;
}) {
  const small = document.createElement("small");
  small.id = attributes.id;
  small.className = "form-text text-muted";
  small.style.cssText = attributes.style;
  small.innerHTML = attributes.content;

  document.getElementById(attributes.parentId)?.appendChild(small);
}

export function createInput(attributes: {
  id: any;
  type: any;
  style: any;
  value: any;
  parentId: any;
}) {
  const input = document.createElement("input");
  input.id = attributes.id;
  input.style.cssText = attributes.style;
  input.value = attributes.value;
  input.type = attributes.type;
  document.getElementById(attributes.parentId)?.appendChild(input);
}

export function createTextarea(
  attributes: { id: any; class: any; style: any; value: any; parentId: any },
  insertBeforeParent: boolean
) {
  const textarea = document.createElement("textarea");
  textarea.id = attributes.id;
  textarea.className = attributes.class;
  textarea.style.cssText = attributes.style;
  textarea.value = attributes.value;

  const parent = document.getElementById(attributes.parentId);
  if (insertBeforeParent) {
    parent?.parentNode?.insertBefore(textarea, parent);
  } else {
    parent?.appendChild(textarea);
  }
}

export function createVideo(attributes: {
  id: any;
  width: any;
  controls: any;
  parentId: any;
}) {
  const video = document.createElement("video") as HTMLVideoElement;
  video.id = attributes.id;
  video.setAttribute("width", attributes.width);
  video.setAttribute("controls", attributes.controls);
  document.getElementById(attributes.parentId)?.appendChild(video);
}

export function createSource(attributes: {
  id: any;
  src: any;
  type: any;
  parentId: any;
}) {
  const source = document.createElement("source");
  source.id = attributes.id;
  source.setAttribute("src", attributes.src);
  source.setAttribute("type", attributes.type);
  document.getElementById(attributes.parentId)?.appendChild(source);
}

export function createYoutubeVideo(attributes: {
  id: any;
  style: any;
  src: any;
  parentId: any;
}) {
  const video = document.createElement("iframe");
  video.id = attributes.id;
  video.style.cssText = attributes.style;
  video.setAttribute("src", attributes.src);
  document.getElementById(attributes.parentId)?.appendChild(video);
}

export function createSlider(attributes: {id: string; min: string; max:string; value: string; parentId:string}, visualInfo: { type: string, categories: string[], count: number, visual?: VisualDescriptor }, onChange: any){
  const slider = document.createElement("input");
  slider.id = attributes.id;
  slider.name = attributes.id;
  slider.type = "range";
  slider.min = attributes.min;
  slider.max = attributes.max;
  slider.value = attributes.value;
  slider.style.cssText = "hight: 30px; witdh 100%;"
  slider.addEventListener("input", async () => {
    await onChange(visualInfo);
  });
  document.getElementById(attributes.parentId)?.appendChild(slider);
}

export function createSliderLabels(content:string[], parentId:string){
  const div = document.createElement("div");
  div.className = "ticks";
  document.getElementById(parentId)?.appendChild(div);
  for(const text of content){
    const span = document.createElement("span");
    span.className = "tick";
    span.style.cssText = `font-size: ${sizes.textSize}rem; position: relative; display: flex; justify-content: center;`;
    span.innerHTML = text;
    document.getElementsByClassName("ticks")[0].appendChild(span);
  }
}

export function removeElement(id: string) {
  const elem = document.getElementById(id);
  if (elem) {
    elem.parentNode?.removeChild(elem);
  }
}

export function removeAllElementsOfClass(elementClass: string) {
  const elements = document.querySelectorAll("." + elementClass);
  elements.forEach((elem) => {
    elem.remove();
  });
}
