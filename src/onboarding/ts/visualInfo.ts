import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as elements from "./elements";
import * as info from "./visualInfo";
import bulletpointImg from "../assets/dot.png";
import { divisor } from "./sizes";

export async function createVisualInfo(visual: any){
    const visualInfos = await helpers.getVisualInfos(visual);
    info.createTabsWithContent(visual, visualInfos);
}

export function createTabsWithContent(visual: any, visualInfos: { generalImages: any; generalInfos: any; interactionImages: any; interactionInfos: any; insightImages: any; insightInfos: any;}){
    let hasInsightInfo = false;
    let hasInteractionInfo = false;
    const visualData = helpers.getDataOfVisual(visual);
    if(!visualData){
        return;
    }

    const generalImages = [];
    const generalInfos = [];
    const insightImages = [];
    const insightInfos = [];
    const interactionImages = [];
    const interactionInfos = [];

    for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
       switch(visualData.generalInfosStatus[i]){
            case global.infoStatus.original:
                generalImages.push(visualInfos.generalImages[i]);
                generalInfos.push(visualInfos.generalInfos[i]);
                break;
            case global.infoStatus.changed:
            case global.infoStatus.added:
                generalImages.push(bulletpointImg);
                generalInfos.push(visualData.changedGeneralInfos[i]);
                break;
            default:
                break;
       }
    }

    for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
        switch(visualData.interactionInfosStatus[i]){
            case global.infoStatus.original:
                interactionImages.push(visualInfos.interactionImages[i]);
                interactionInfos.push(visualInfos.interactionInfos[i]);
                break;
            case global.infoStatus.changed:
            case global.infoStatus.added:
                interactionImages.push(bulletpointImg);
                interactionInfos.push(visualData.changedInteractionInfos[i]);
                break;
            default:
                break;
        }
    }

    for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
        switch(visualData.insightInfosStatus[i]){
            case global.infoStatus.original:
                insightImages.push(visualInfos.insightImages[i]);
                insightInfos.push(visualInfos.insightInfos[i]);
                break;
            case global.infoStatus.changed:
            case global.infoStatus.added:
                insightImages.push(bulletpointImg);
                insightInfos.push(visualData.changedInsightInfos[i]);
                break;
            default:
                break;
        }
    }

    if(interactionInfos.length != 0){
        hasInteractionInfo = true;
    }
    if(insightInfos.length != 0){
        hasInsightInfo = true;
    }
    createTabs(hasInteractionInfo, hasInsightInfo);

    createInfoList(generalImages, generalInfos, "generalTab");
    if(hasInteractionInfo){
        createInfoList(interactionImages, interactionInfos, "interactionTab");
        helpers.createInteractionExampleButton("interactionTab", visual);
    }
    if(hasInsightInfo){
        createInfoList(insightImages, insightInfos, "insightTab");
    }
}

function createTabs(hasInteractionInfo: boolean, hasInsightInfo: boolean){
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

    let ids = ["generalPill"];
    const attributes = [];

    if(hasInteractionInfo){
        ids.push("interactionPill");
    }

    if(hasInsightInfo){
        ids.push("insightPill");
    }

    let aAttributes = global.createTabAnchorAttributes();
    aAttributes.id = "generalLink";
    if(divisor<=2){
        aAttributes.content = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-graph-up mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/></svg>  General';
    } else{
        aAttributes.content = 'General';
    }
    aAttributes.href = "generalTab";
    aAttributes.parentId = "generalPill";
    attributes.push(aAttributes);

    if(hasInteractionInfo){
        aAttributes = global.createTabAnchorAttributes();
        aAttributes.id = "interactionLink";
        if(divisor<=2){
            aAttributes.content = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-hand-index-thumb mb-1" viewBox="0 0 16 16"><path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z"/></svg> Interaction';
        } else{
            aAttributes.content = 'Interaction';
        }
        aAttributes.href = "interactionTab";
        aAttributes.parentId = "interactionPill";
        attributes.push(aAttributes);
    }

    if(hasInsightInfo){
        aAttributes = global.createTabAnchorAttributes();
        aAttributes.id = "insightLink";
        if(divisor<=2){
            aAttributes.content = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-search mb-1" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>  Insight';
        } else{
            aAttributes.content = 'Insight';
        }
        aAttributes.href = "insightTab";
        aAttributes.parentId = "insightPill";
        attributes.push(aAttributes);
    }

    createTabPills(ids, attributes);

    divAttributes = global.createDivAttributes();
    divAttributes.id = "pillsTabContent";
    divAttributes.classes = "tab-content";
    divAttributes.parentId = "visualInfoTabs";
    elements.createDiv(divAttributes);

    ids = ["generalTab"];
    const tabPills = ["generalLink"];

    if(hasInteractionInfo){
        ids.push("interactionTab");
        tabPills.push("interactionLink");
    }

    if(hasInsightInfo){
        ids.push("insightTab");
        tabPills.push("insightLink");
    }

    createTabContent(ids, tabPills);
}

function createTabPills(ids: any[], attributes: { id: string; href: string; content: string; parentId: string; }[]){
    ids.forEach((id, index) => {
        const liAttributes = global.createLIAttributes();
        liAttributes.id = id;
        liAttributes.classes = "nav-item";
        liAttributes.parentId ="pillsTab";
        elements.createLI(liAttributes);

        const aAttributes = global.createAnchorAttributes();
        aAttributes.id = attributes[index].id;
        if(index == 0){
            aAttributes.classes = "nav-link active";
            aAttributes.selected = "true";   
        }else{
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

function createTabContent(ids: string[], tabPills: string[]){
    ids.forEach((id, index) => {
        const attributes = global.createDivAttributes();
        attributes.id =  id;
        attributes.role = "tabpanel";
        attributes.label = tabPills[index];
        if(index == 0){
            attributes.classes = "tab-pane fade show active";
        }else{
            attributes.classes = "tab-pane fade";
        }
        attributes.parentId = "pillsTabContent";
        elements.createDiv(attributes);
    });
}

export function createInfoList(images: string | any[], infos: string[], parentId: string){
    for (let i = 0; i < images.length; ++i) {
        const ul = document.createElement('ul');
        if(divisor<=2){
            ul.style.listStyleImage = "url("+ images[i] + ")";
            ul.style.paddingLeft = "30px";
        } else {
            ul.style.paddingLeft = "10px";
        }
        document.getElementById(parentId)?.appendChild(ul);

        const li = document.createElement('li');
        li.innerHTML =  infos[i];
        ul.appendChild(li);
    }
}