import * as helpers from "./../../../componentGraph/helperFunctions";
import * as global from "./../globalVariables";
import { createInfoList } from "./../visualInfo";
import { BasicTextFormat } from "./Format/basicTextFormat";
import { ExpertiseLevel } from "../../../UI/redux/expertise";

export default class SaveAndFetchContent {
  private visualData: global.SettingsVisual;
  private infos: Array<string>;
  private images: Array<string>;

  private visFullName: string[];
  private categories: string[];

  constructor(visFullName: string[]) {
    this.visFullName = visFullName;
    this.visualData = {
      id: "",
      mediaType: global.mediaType.text,
      videoURL: "",
      title: "",
      disabled: false,
      generalInfosStatus: [],
      interactionInfosStatus: [],
      insightInfosStatus: [],
      changedGeneralInfos: [],
      changedInteractionInfos: [],
      changedInsightInfos: [],
    };
    this.categories = [];
    this.infos = [];
    this.images = [];
  }

  async saveVisualInfo(
    newInfo: string[],
    test: any,
    visFullName: string[],
    count: number
  ) {
    try {
      localStorage.setItem(visFullName[0], JSON.stringify(test));
    } catch (error) {
      console.log("Error in saveVisualInfo()", error);
    }
  }

  async getVisualDescInEditor(expertiseLevel: ExpertiseLevel) {
    try {
      let visualInfos: BasicTextFormat = {
        generalImages: [],
        generalInfos: [],
        insightImages: [],
        insightInfos: [],
        interactionImages: [],
        interactionInfos: [],
      };

      const textBox = document.getElementById(
        "textBox"
      )! as HTMLTextAreaElement;
      textBox.innerHTML = "";
      const textInStorage = localStorage.getItem(this.visFullName[0]);
      if (textInStorage) {
        const textBox = document.getElementById(
          "textBox"
        )! as HTMLTextAreaElement;
        textBox.innerHTML = textInStorage;
      } else {
        if(this.visFullName[0] === "globalFilter"){
          visualInfos = await helpers.getVisualInfos(this.visFullName[0], expertiseLevel);
        } else{
          const visual = global.allVisuals.find((visual) => {
            return visual.name == this.visFullName[0];
          });
  
          if (!visual) {
            return;
          }
  
          visualInfos = await helpers.getVisualInfos(this.visFullName[0], expertiseLevel, visual);
        }
        await createInfoList(
          visualInfos.generalImages,
          visualInfos.generalInfos,
          "textBox",
          true
        );
      }
    } catch (error) {
      console.log("Error in getting basic visual description in editor", error);
    }
  }
}
