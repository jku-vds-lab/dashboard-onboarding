import * as helpers from "./../../../componentGraph/helperFunctions";
import * as global from "./../globalVariables";
import { createInfoList } from "./../visualInfo";
import { BasicTextFormat } from "./Format/basicTextFormat";
import { ExpertiseLevel } from "../../../UI/redux/expertise";
import { createTraversalElement, findTraversalVisual } from "../traversal";
import { getTraversalElement } from "../createSettings";
import { replacer } from "../../../componentGraph/ComponentGraph";
import { getNewDashboardInfo } from "../dashboardInfoCard";

export default class SaveAndFetchContent {
  private visFullName: string[];
  private generatedInfos: BasicTextFormat;

  constructor(visFullName: string[]) {
    this.visFullName = visFullName;
    this.generatedInfos = {
      generalImages: [],
      generalInfos: [],
      insightImages: [],
      insightInfos: [],
      interactionImages: [],
      interactionInfos: [],
    };
  }

  saveVisualInfo(
    newImages: string[],
    newInfo: string[],
  ) {
    const visData = this.getVisData();
    if(this.visFullName.length > 3){
      if(this.visFullName[1] === "Interaction"){
        visData.changedInteractionImages = newImages;
        visData.changedInteractionInfos = newInfo;
      } else if(this.visFullName[1] === "Insight"){
        visData.changedInsightImages = newImages;
        visData.changedInsightInfos = newInfo;
      }
    }else{
      visData.changedGeneralImages = newImages;
      visData.changedGeneralInfos = newInfo;
    }
      
    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
  }

  resetVisualInfo() {
    const visData = this.getVisData();
    if(this.visFullName.length > 3){
      if(this.visFullName[1] === "Interaction"){
        visData.changedInteractionImages = [];
        visData.changedInteractionInfos = [];
      } else if(this.visFullName[1] === "Insight"){
        visData.changedInsightImages = [];
        visData.changedInsightInfos = [];
      }
    }else{
      visData.changedGeneralImages = [];
      visData.changedGeneralInfos = [];
    }
      
    localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
  }

  async getVisualDescInEditor(expertiseLevel: ExpertiseLevel) {
    try {
      const visData = this.getVisData();

      switch(this.visFullName[0]){
        case "dashboard":
          const dashboard = global.componentGraph.dashboard;
          const dashboardInfo = getNewDashboardInfo(dashboard);
          this.generatedInfos.generalImages = dashboardInfo[0];
          this.generatedInfos.generalInfos = dashboardInfo[1];
          break;
        case "globalFilter":
          this.generatedInfos = await helpers.getVisualInfos(this.visFullName[0], expertiseLevel);
          break;
        default:
          const visual = findTraversalVisual(this.visFullName[0]);
          if (!visual) {
            return;
          }
          this.generatedInfos = await helpers.getVisualInfos(visual.type, expertiseLevel, visual);
      }

      const textBox = document.getElementById(
        "textBox"
      )! as HTMLTextAreaElement;
      textBox.innerHTML = "";

      let images = [];
      let infos = [];

      if(this.visFullName.length > 3){
        if(this.visFullName[1] === "Interaction"){
          if(visData.changedInteractionInfos.length === 0){
            images = this.generatedInfos.interactionImages;
            infos = this.generatedInfos.interactionInfos;
          } else {
            images = visData.changedInteractionImages;
            infos = visData.changedInteractionInfos;
          }
        } else if(this.visFullName[1] === "Insight"){
          if(visData.changedInsigthInfos.length === 0){
            images = this.generatedInfos.insightImages;
            infos = this.generatedInfos.insightInfos;
          } else {
            images = visData.changedInsightImages;
            infos = visData.changedInsightInfos;
          }
        }
      }else{
        if(visData.changedGeneralInfos.length === 0){
          images = this.generatedInfos.generalImages;
          infos = this.generatedInfos.generalInfos;
        } else {
          images = visData.changedGeneralImages;
          infos = visData.changedGeneralInfos;
        }
      }
    
      await createInfoList(
        images,
        infos,
        "textBox",
        true
      );
    } catch (error) {
      console.log("Error in getting basic visual description in editor", error);
    }
  }

  getVisData(){
    let visData;
    if(this.visFullName.length > 3){
      visData = helpers.getDataWithId(
        global.settings.traversalStrategy,
        this.visFullName[0],
        [this.visFullName[1]],
        parseInt(this.visFullName[2])
      );
      if (!visData) {
        const traversalElem = createTraversalElement("");
        traversalElem.element = getTraversalElement(this.visFullName[0]);
        traversalElem.count = parseInt(this.visFullName[2]);
        traversalElem.categories = [this.visFullName[1]];
        global.settings.traversalStrategy.push(traversalElem);
        visData = helpers.getDataWithId(
          global.settings.traversalStrategy,
          this.visFullName[0],
          [this.visFullName[1]],
          parseInt(this.visFullName[2])
        );
      }
    }else{
      visData = helpers.getDataWithId(
        global.settings.traversalStrategy,
        this.visFullName[0],
        ["general"],
        parseInt(this.visFullName[1])
      );
      if (!visData) {
        const traversalElem = createTraversalElement("");
        traversalElem.element = getTraversalElement(this.visFullName[0]);
        traversalElem.count = parseInt(this.visFullName[2]);
        traversalElem.categories = [this.visFullName[1]];
        global.settings.traversalStrategy.push(traversalElem);
        visData = helpers.getDataWithId(
          global.settings.traversalStrategy,
          this.visFullName[0],
          ["general"],
          parseInt(this.visFullName[1])
        );
      }
    }
    return visData;
  }
}
