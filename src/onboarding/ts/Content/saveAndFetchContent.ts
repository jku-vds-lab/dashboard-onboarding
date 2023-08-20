import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import { createInfoList, createVisualInfo } from "./../visualInfo";
import { createTraversalElement } from "./../traversal";
import { replacer } from "../../../componentGraph/ComponentGraph";
import { getTraversalElement } from "./../createSettings";
import { VisualDescriptor } from "powerbi-client";
import BasicTextFormat from "./Format/basicTextFormat";

export default class SaveAndFetchContent {
  private type: string;
  private visualData: global.SettingsVisual;
  private infos: Array<string>;
  private images: Array<string>;

  private visFullName: string[];
  private categories: string[];

  constructor(type: string, visFullName: string[]) {
    this.type = type;
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

  private isInteraction(): boolean {
    if (this.visFullName.includes("Interaction")) {
      return true;
    }
    return false;
  }

  private isInsight(): boolean {
    if (this.visFullName.includes("Insight")) {
      return true;
    }
    return false;
  }

  private setCategories() {
    const isVisInteraction = this.isInteraction();
    const isVisInsight = this.isInsight();
    this.categories = [];

    if (isVisInteraction) {
      this.categories.push("interaction");
    }
    if (isVisInsight) {
      this.categories.push("insight");
    }

    if (!(isVisInsight || isVisInteraction)) {
      this.categories.push("general");
    }
  }

  private async addElementToTraversalStrategy(visName: string, count: number) {
    const traversalElem = createTraversalElement("");
    traversalElem.element = await getTraversalElement(visName);
    traversalElem.count = count;
    traversalElem.categories = this.categories;
    global.settings.traversalStrategy.push(traversalElem);
  }

  private async getOriginalVisualInfos() {
    try {
      const visual = global.currentVisuals.find(
        (vis) => vis.name === this.visFullName[0]
      );
      if (!visual) {
        console.log("No original vis found");
        return;
      }
      const visualInfos = await helpers.getVisualInfos(visual);

      if (this.isInteraction()) {
        this.images = visualInfos.insightImages;
        this.infos = visualInfos.insightInfos;
      } else if (this.isInsight()) {
        this.images = visualInfos.interactionImages;
        this.infos = visualInfos.interactionInfos;
      } else {
        this.images = visualInfos.generalImages;
        this.infos = visualInfos.generalInfos;
      }
    } catch (error) {
      console.log("Error in getOriginalVisualInfos()", error);
    }
  }

  async saveVisualInfo(
    newInfo: string[],
    test: any,
    visFullName: string[],
    count: number
  ) {
    try {
      localStorage.setItem(visFullName.toString(), JSON.stringify(test));
      // this.setCategories();

      // this.visualData = helpers.getDataWithId(
      //   global.settings.traversalStrategy,
      //   visFullName[0],
      //   this.categories,
      //   count
      // );

      // if (!this.visualData) {
      //   await this.addElementToTraversalStrategy(visFullName[0], count);
      //   this.visualData = helpers.getDataWithId(
      //     global.settings.traversalStrategy,
      //     visFullName[0],
      //     this.categories,
      //     count
      //   );
      // }

      // await this.getOriginalVisualInfos();

      // if (this.isInsight()) {
      //   if (newInfo == null || newInfo.length == 0) {
      //     this.visualData.insightInfosStatus;
      //   }
      // }

      // // here I need to show test in the html box
      // const textBox = document.getElementById(
      //   "textBox"
      // )! as HTMLTextAreaElement;
      // textBox.innerHTML = test;
      // localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
    } catch (error) {
      console.log("Error in saveVisualInfo()", error);
    }
  }

  async getVisualDescInEditor() {
    try {
      let visualInfos: BasicTextFormat = {
        generalImages: [],
        generalInfos: [],
        interactionImages: [],
        interactionInfos: [],
        insightImages: [],
        insightInfos: [],
      };

      const textBox = document.getElementById(
        "textBox"
      )! as HTMLTextAreaElement;
      textBox.innerHTML = "";
      const textInStorage = localStorage.getItem(this.visFullName.toString());
      if (textInStorage) {
        const textBox = document.getElementById(
          "textBox"
        )! as HTMLTextAreaElement;
        textBox.innerHTML = textInStorage;
      } else {
        const visual = global.allVisuals.find((visual) => {
          return visual.name == this.visFullName[0];
        });

        if (!visual) {
          return;
        }

        visualInfos = await helpers.getVisualInfos(visual);
        await createInfoList(
          visualInfos.generalImages,
          visualInfos.generalInfos,
          "textBox",
          true
        );
      }
      // const textBox = document.getElementById(
      //   "textBox"
      // )! as HTMLTextAreaElement;
      // if (test != "") {
      //   textBox.innerHTML = test;
      // } else {
      //   textBox.innerHTML = "";
      //   if (this.visFullName) {
      //     const visual = global.allVisuals.find((visual) => {
      //       return visual.name == this.visFullName[0];
      //     });

      //     if (!visual) {
      //       return;
      //     }

      //     visualInfos = await helpers.getVisualInfos(visual);
      //   }

      //   if (this.isInteraction()) {
      //   } else if (this.isInsight()) {
      //   } else {
      //     // this is general
      //     await createInfoList(
      //       visualInfos.generalImages,
      //       visualInfos.generalInfos,
      //       "textBox",
      //       true
      //     );
      //   }
      // }
    } catch (error) {
      console.log("Error in getting basic visual description in editor", error);
    }
  }
}

// basic visual description viewer in editor
// export async function getVisualDescInEditor(nodeFullName: string[]) {
//   try {
//     let visualInfos: BasicTextFormat = {
//       generalImages: [],
//       generalInfos: [],
//       interactionImages: [],
//       interactionInfos: [],
//       insightImages: [],
//       insightInfos: [],
//     };

//     const textBox = document.getElementById("textBox")! as HTMLTextAreaElement;
//     textBox.innerHTML = "";

//     if (nodeFullName) {
//       const visual = global.allVisuals.find(function (visual) {
//         return visual.name == nodeFullName[0];
//       });

//       visualInfos = await helpers.getVisualInfos(visual);
//     }

//     if (nodeFullName.includes("Interaction")) {
//     } else if (nodeFullName.includes("Insight")) {
//     } else {
//       // this is general
//       await createInfoList(
//         visualInfos.generalImages,
//         visualInfos.generalInfos,
//         "textBox",
//         true
//       );
//     }
//   } catch (error) {
//     console.log("Error in getting basic visual description in editor", error);
//   }
// }
/*
function retrieveVisualInfoFromStorage(
  visualFullName: string[],
  visualInfos: BasicTextFormat,
  count: number
) {
  const infos = [];
  const images = [];

  try {
    const categories = [];
    if (visualFullName.length > 2) {
      categories.push(visualFullName[1].toLowerCase());
    } else {
      categories.push("general");
    }
    const visualData = helpers.getDataWithId(
      global.settings.traversalStrategy,
      visualFullName[0],
      categories,
      count
    );

    if (visualFullName.length > 2 && visualFullName[1] == "Insight") {
      for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
        switch (visualData.insightInfosStatus[i]) {
          case global.infoStatus.original:
            images.push(visualInfos.insightImages[i]);
            infos.push(visualInfos.insightInfos[i]);
            break;
          case global.infoStatus.changed:
          case global.infoStatus.added:
            images.push("dotImg");
            infos.push(visualData.changedInsightInfos[i]);
            break;
          default:
            break;
        }
      }
    } else if (
      visualFullName.length > 2 &&
      visualFullName[1] == "Interaction"
    ) {
      for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
        switch (visualData.interactionInfosStatus[i]) {
          case global.infoStatus.original:
            images.push(visualInfos.interactionImages[i]);
            infos.push(visualInfos.interactionInfos[i]);
            break;
          case global.infoStatus.changed:
          case global.infoStatus.added:
            images.push("dotImg");
            infos.push(visualData.changedInteractionInfos[i]);
            break;
          default:
            break;
        }
      }
    } else {
      for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
        switch (visualData.generalInfosStatus[i]) {
          case global.infoStatus.original:
            images.push(visualInfos.generalImages[i]);
            infos.push(visualInfos.generalInfos[i]);
            break;
          case global.infoStatus.changed:
          case global.infoStatus.added:
            images.push("dotImg");
            infos.push(visualData.changedGeneralInfos[i]);
            break;
          default:
            break;
        }
      }
    }
    // return ;
  } catch (error) {
    console.log("Error in retrieveVisualInfoFromStorage()", error);
  }
}

export async function getVisualInfoInEditor(
  visualFullName: string[],
  count: number
) {
  // retrieve existing info
  // get actual info if nothing exists
  // display the content
  let infos = [];
  let images = [];

  const visual = global.allVisuals.find(function (visual) {
    return visual.name == visualFullName[0];
  });
  const visualInfos = await helpers.getVisualInfos(<VisualDescriptor>visual);
  const visualData = retrieveVisualInfoFromStorage(
    visualFullName,
    visualInfos,
    count
  );

  if (!visualData) {
    if (visualFullName.length > 2 && visualFullName[1] == "Insight") {
      images = visualInfos.insightImages;
      infos = visualInfos.insightInfos;
    } else if (
      visualFullName.length > 2 &&
      visualFullName[1] == "Interaction"
    ) {
      images = visualInfos.interactionImages;
      infos = visualInfos.interactionInfos;
    } else {
      images = visualInfos.generalImages;
      infos = visualInfos.generalInfos;
    }
  } else {
  }

  const textBox = document.getElementById("textBox")! as HTMLTextAreaElement;
  textBox.innerHTML = "";

  await createInfoList(images, infos, "textBox", true);
}

export async function saveVisualChanges(
  newInfo: string[],
  idParts: string[],
  count: number
) {
  const categories = [];
  if (idParts.length > 2) {
    categories.push(idParts[1].toLowerCase());
  } else {
    categories.push("general");
  }
  let visualData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    idParts[0],
    categories,
    count
  );
  if (!visualData) {
    const traversalElem = createTraversalElement("");
    traversalElem.element = await getTraversalElement(idParts[0]);
    traversalElem.count = count;
    traversalElem.categories = categories;
    global.settings.traversalStrategy.push(traversalElem);
    visualData = helpers.getDataWithId(
      global.settings.traversalStrategy,
      idParts[0],
      categories,
      count
    );
  }

  const original = await getOriginalVisualInfos(idParts);
  if (!original) {
    return;
  }
  const originalInfo = original[1];
  if (!originalInfo) {
    return;
  }

  if (idParts.length > 2 && idParts[1] == "Insight") {
    for (let i = 0; i < newInfo.length; ++i) {
      if (newInfo.length == 0 || newInfo == null) {
        visualData.insightInfosStatus[0] = "deleted";
        visualData.changedInsightInfos[0] = "";
        return;
      } else if (i >= originalInfo.length) {
        visualData.insightInfosStatus.push("added");
        visualData.changedInsightInfos.push(newInfo[i]);
      } else if (newInfo[i] == originalInfo[i]) {
        visualData.insightInfosStatus[i] = "original";
        visualData.changedInsightInfos[i] = "";
      } else {
        visualData.insightInfosStatus[i] = "changed";
        visualData.changedInsightInfos[i] = newInfo[i];
      }
    }

    if (newInfo.length < visualData.insightInfosStatus.length) {
      for (
        let i = newInfo.length;
        i < visualData.insightInfosStatus.length;
        ++i
      ) {
        visualData.insightInfosStatus[i] = "deleted";
        visualData.changedInsightInfos[i] = "";
      }
    }
  } else if (idParts.length > 2 && idParts[1] == "Interaction") {
    for (let i = 0; i < newInfo.length; ++i) {
      if (newInfo.length == 0 || newInfo == null) {
        visualData.interactionInfosStatus[0] = "deleted";
        visualData.changedInteractionInfos[0] = "";
        return;
      } else if (i >= originalInfo.length) {
        visualData.interactionInfosStatus.push("added");
        visualData.changedInteractionInfos.push(newInfo[i]);
      } else if (newInfo[i] == originalInfo[i]) {
        visualData.interactionInfosStatus[i] = "original";
        visualData.changedInteractionInfos[i] = "";
      } else {
        visualData.interactionInfosStatus[i] = "changed";
        visualData.changedInteractionInfos[i] = newInfo[i];
      }
    }

    if (newInfo.length < visualData.interactionInfosStatus.length) {
      for (
        let i = newInfo.length;
        i < visualData.interactionInfosStatus.length;
        ++i
      ) {
        visualData.interactionInfosStatus[i] = "deleted";
        visualData.changedInteractionInfos[i] = "";
      }
    }
  } else {
    for (let i = 0; i < newInfo.length; ++i) {
      if (newInfo.length == 0 || newInfo == null) {
        visualData.generalInfosStatus[0] = "deleted";
        visualData.changedGeneralInfos[0] = "";
        return;
      } else if (i >= originalInfo.length) {
        visualData.generalInfosStatus.push("added");
        visualData.changedGeneralInfos.push(newInfo[i]);
      } else if (newInfo[i] == originalInfo[i]) {
        visualData.generalInfosStatus[i] = "original";
        visualData.changedGeneralInfos[i] = "";
      } else {
        visualData.generalInfosStatus[i] = "changed";
        visualData.changedGeneralInfos[i] = newInfo[i];
      }
    }

    if (newInfo.length < visualData.generalInfosStatus.length) {
      for (
        let i = newInfo.length;
        i < visualData.generalInfosStatus.length;
        ++i
      ) {
        visualData.generalInfosStatus[i] = "deleted";
        visualData.changedGeneralInfos[i] = "";
      }
    }
  }

  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}

async function getOriginalVisualInfos(idParts: string[]) {
  let info;
  let images;
  const visual = global.currentVisuals.find((vis) => vis.name === idParts[0]);
  if (!visual) {
    console.log("No original vis found");
    return;
  }
  const visualInfos = await helpers.getVisualInfos(visual);

  if (idParts.length > 2 && idParts[1] == "Insight") {
    images = visualInfos.insightImages;
    info = visualInfos.insightInfos;
  } else if (idParts.length > 2 && idParts[1] == "Interaction") {
    images = visualInfos.interactionImages;
    info = visualInfos.interactionInfos;
  } else {
    images = visualInfos.generalImages;
    info = visualInfos.generalInfos;
  }
  return [images, info];
}

export async function resetVisualChanges(idParts: string[], count: number) {
  const categories = [];
  if (idParts.length > 2) {
    categories.push(idParts[1].toLowerCase());
  } else {
    categories.push("general");
  }

  const originalInfo = await getOriginalVisualInfos(idParts);
  if (!originalInfo) {
    return;
  }

  const textBox = document.getElementById("textBox")! as HTMLTextAreaElement;
  textBox.innerHTML = "";

  await createInfoList(originalInfo[0], originalInfo[1], "textBox", true);

  const visualData = helpers.getDataWithId(
    global.settings.traversalStrategy,
    idParts[0],
    categories,
    count
  );
  if (!visualData) {
    const traversalElem = createTraversalElement("");
    traversalElem.element = await getTraversalElement(idParts[0]);
    traversalElem.count = count;
    traversalElem.categories = categories;
    global.settings.traversalStrategy.push(traversalElem);
    return;
  }

  if (idParts.length > 2 && idParts[1] == "Insight") {
    for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
      visualData.insightInfosStatus[i] = "original";
      visualData.changedInsightInfos[i] = "";
    }
    if (originalInfo.length < visualData.insightInfosStatus.length) {
      const elemCount =
        visualData.insightInfosStatus.length - originalInfo.length;
      visualData.insightInfosStatus.splice(originalInfo.length, elemCount);
      visualData.changedInsightInfos.splice(originalInfo.length, elemCount);
    }
  } else if (idParts.length > 2 && idParts[1] == "Interaction") {
    for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
      visualData.interactionInfosStatus[i] = "original";
      visualData.changedInteractionInfos[i] = "";
    }
    if (originalInfo.length < visualData.interactionInfosStatus.length) {
      const elemCount =
        visualData.interactionInfosStatus.length - originalInfo.length;
      visualData.interactionInfosStatus.splice(originalInfo.length, elemCount);
      visualData.changedInteractionInfos.splice(originalInfo.length, elemCount);
    }
  } else {
    for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
      visualData.generalInfosStatus[i] = "original";
      visualData.changedGeneralInfos[i] = "";
    }

    if (originalInfo.length < visualData.generalInfosStatus.length) {
      const elemCount =
        visualData.generalInfosStatus.length - originalInfo.length;
      visualData.generalInfosStatus.splice(originalInfo.length, elemCount);
      visualData.changedGeneralInfos.splice(originalInfo.length, elemCount);
    }
  }

  localStorage.setItem("settings", JSON.stringify(global.settings, replacer));
}
*/
