import * as helpers from "./../../componentGraph/helperFunctions";
import * as helper from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import * as info from "./visualInfo";
import { divisor } from "./sizes";
import { TraversalElement } from "./traversal";
import { icons } from "./textIcons";
import { VisualDescriptor } from "powerbi-client";

export async function createVisualInfo(
  traversal: TraversalElement[],
  visual: VisualDescriptor,
  count: number,
  categories: string[]
) {
  document.getElementById("contentText")!.innerHTML = "";
  const visualData = helpers.getDataWithId(
    traversal,
    visual.name,
    categories,
    count
  );
  if (!visualData) {
    return;
  }

  const videoURL = localStorage.getItem(visual.name + "video");
  if (videoURL) {
    const attributes = global.createDivAttributes();
    attributes.id = "videoContainer";
    attributes.style = "position: relative;padding-bottom: 56.25%;height: 0;";
    attributes.parentId = "contentText";
    elements.createDiv(attributes);

    const videoAttributes = global.createVideoAttributes();
    videoAttributes.id = "video";
    videoAttributes.width = "100%";
    videoAttributes.parentId = "videoContainer";
    elements.createVideo(videoAttributes);

    const sourceAttributes = global.createSourceAttributes();
    sourceAttributes.id = "source";
    sourceAttributes.src = videoURL;
    sourceAttributes.type = "video/mp4";
    sourceAttributes.parentId = "video";
    elements.createSource(sourceAttributes);
  }

  await info.createTabsWithContent(visual, visualData, count, categories);
}

export async function createTabsWithContent(
  visual: VisualDescriptor,
  visualData: any,
  count: number,
  categories: string[]
) {
  const visualInfos = await helpers.getVisualInfos(visual);

  createTabs(categories);

  if (categories.includes("general")) {
    const generalImages = [];
    const generalInfos = [];

    for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
      switch (visualData.generalInfosStatus[i]) {
        case global.infoStatus.original:
          generalImages.push(visualInfos.generalImages[i]);
          generalInfos.push(visualInfos.generalInfos[i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          generalImages.push("dotImg");
          generalInfos.push(visualData.changedGeneralInfos[i]);
          break;
        default:
          break;
      }
    }

    createInfoList(generalImages, generalInfos, "generalTab", false);
  }

  if (categories.includes("interaction")) {
    const interactionImages = [];
    const interactionInfos = [];

    for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
      switch (visualData.interactionInfosStatus[i]) {
        case global.infoStatus.original:
          interactionImages.push(visualInfos.interactionImages[i]);
          interactionInfos.push(visualInfos.interactionInfos[i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          interactionImages.push("dotImg");
          interactionInfos.push(visualData.changedInteractionInfos[i]);
          break;
        default:
          break;
      }
    }

    createInfoList(
      interactionImages,
      interactionInfos,
      "interactionTab",
      false
    );
    helper.createInteractionExampleButton("interactionTab", visual);
  }

  if (categories.includes("insight")) {
    const insightImages = [];
    const insightInfos = [];

    for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
      switch (visualData.insightInfosStatus[i]) {
        case global.infoStatus.original:
          insightImages.push(visualInfos.insightImages[i]);
          insightInfos.push(visualInfos.insightInfos[i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          insightImages.push("dotImg");
          insightInfos.push(visualData.changedInsightInfos[i]);
          break;
        default:
          break;
      }
    }

    createInfoList(insightImages, insightInfos, "insightTab", false);
  }

  const otherCategories = categories.filter(
    (category) =>
      category !== "general" &&
      category !== "interaction" &&
      category !== "insight"
  );
  for (const category of otherCategories) {
    const images = [];
    const infos = [];

    for (let i = 0; i < visualData[category + "InfosStatus"].length; ++i) {
      switch (visualData[category + "InfosStatus"][i]) {
        case global.infoStatus.original:
          images.push(visualInfos[category + "Images"][i]);
          infos.push(visualInfos[category + "Infos"][i]);
          break;
        case global.infoStatus.changed:
        case global.infoStatus.added:
          images.push("dotImg");
          infos.push(visualData["changed" + category + "Infos"][i]);
          break;
        default:
          break;
      }
    }

    createInfoList(images, infos, category + "Tab", false);
  }
}

function createTabs(categories: string[]) {
  let divAttributes = global.createDivAttributes();
  divAttributes.id = "visualInfoTabs";
  divAttributes.parentId = "contentText";
  elements.createDiv(divAttributes);

  const ulAttributes = global.createULAttributes();
  ulAttributes.id = "pillsTab";
  ulAttributes.role = "tablist";
  ulAttributes.classes = "nav nav-pills nav-fill";
  ulAttributes.parentId = "visualInfoTabs";
  elements.createUL(ulAttributes);

  let ids = [];
  const attributes = [];

  for (const category of categories) {
    ids.push(category + "Pill");
  }

  if (categories.includes("general")) {
    const aAttributes = global.createTabAnchorAttributes();
    aAttributes.id = "generalLink";
    if (divisor <= 2) {
      aAttributes.content =
        '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-graph-up mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/></svg>  General';
    } else {
      aAttributes.content = "General";
    }
    aAttributes.href = "generalTab";
    aAttributes.parentId = "generalPill";
    attributes.push(aAttributes);
  }

  if (categories.includes("interaction")) {
    const aAttributes = global.createTabAnchorAttributes();
    aAttributes.id = "interactionLink";
    if (divisor <= 2) {
      aAttributes.content =
        '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-hand-index-thumb mb-1" viewBox="0 0 16 16"><path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z"/></svg> Interaction';
    } else {
      aAttributes.content = "Interaction";
    }
    aAttributes.href = "interactionTab";
    aAttributes.parentId = "interactionPill";
    attributes.push(aAttributes);
  }

  if (categories.includes("insight")) {
    const aAttributes = global.createTabAnchorAttributes();
    aAttributes.id = "insightLink";
    if (divisor <= 2) {
      aAttributes.content =
        '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-search mb-1" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>  Insight';
    } else {
      aAttributes.content = "Insight";
    }
    aAttributes.href = "insightTab";
    aAttributes.parentId = "insightPill";
    attributes.push(aAttributes);
  }

  const otherCategories = categories.filter(
    (category) =>
      category !== "general" &&
      category !== "interaction" &&
      category !== "insight"
  );
  for (const category of otherCategories) {
    const aAttributes = global.createTabAnchorAttributes();
    aAttributes.id = category + "Link";
    aAttributes.content = helpers.firstLetterToUpperCase(category);
    aAttributes.href = category + "Tab";
    aAttributes.parentId = category + "Pill";
    attributes.push(aAttributes);
  }

  createTabPills(ids, attributes);

  divAttributes = global.createDivAttributes();
  divAttributes.id = "pillsTabContent";
  divAttributes.classes = "tab-content";
  divAttributes.parentId = "visualInfoTabs";
  elements.createDiv(divAttributes);

  ids = [];
  const tabPills = [];

  for (const category of categories) {
    ids.push(category + "Tab");
    tabPills.push(category + "Link");
  }

  createTabContent(ids, tabPills);
}

function createTabPills(
  ids: any[],
  attributes: { id: string; href: string; content: string; parentId: string }[]
) {
  ids.forEach((id, index) => {
    const liAttributes = global.createLIAttributes();
    liAttributes.id = id;
    liAttributes.classes = "nav-item";
    liAttributes.parentId = "pillsTab";
    elements.createLI(liAttributes);

    const aAttributes = global.createAnchorAttributes();
    aAttributes.id = attributes[index].id;
    if (index == 0) {
      aAttributes.classes = "nav-link active";
      aAttributes.selected = "true";
    } else {
      aAttributes.classes = "nav-link";
      aAttributes.selected = "false";
    }
    aAttributes.controles = attributes[index].href;
    aAttributes.content = attributes[index].content;
    aAttributes.toggle = "pill";
    aAttributes.role = "tab";
    aAttributes.href = "#" + attributes[index].href;
    aAttributes.parentId = attributes[index].parentId;
    elements.createAnchor(aAttributes, true);
  });
}

function createTabContent(ids: string[], tabPills: string[]) {
  ids.forEach((id, index) => {
    const attributes = global.createDivAttributes();
    attributes.id = id;
    attributes.role = "tabpanel";
    attributes.label = tabPills[index];
    if (index == 0) {
      attributes.classes = "tab-pane fade show active";
    } else {
      attributes.classes = "tab-pane fade";
    }
    attributes.parentId = "pillsTabContent";
    elements.createDiv(attributes);
  });
}

export async function createInfoList(
  images: string | any[],
  infos: string[],
  parentId: string,
  editor: boolean
) {
  const ul = document.createElement("ul");
  document.getElementById(parentId)?.appendChild(ul);
  for (let i = 0; i < infos.length; ++i) {
    const li = document.createElement("li");
    if (editor) {
      li.style.listStyleImage = "url(" + icons["white-" + images[i]] + ")";
      li.style.paddingLeft = "10px";
    } else {
      if (divisor <= 2) {
        li.style.listStyleImage = "url(" + icons[images[i]] + ")";
      }
      li.style.paddingLeft = "10px";
    }

    li.innerHTML = infos[i];
    ul.appendChild(li);
  }
}
