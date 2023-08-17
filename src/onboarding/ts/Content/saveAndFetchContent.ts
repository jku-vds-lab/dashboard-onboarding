import * as helpers from "./../helperFunctions";
import * as global from "./../globalVariables";
import { createInfoList, createVisualInfo } from "./../visualInfo";
import { createTraversalElement } from "./../traversal";
import { replacer } from "../../../componentGraph/ComponentGraph";
import { getTraversalElement } from "./../createSettings";
import { VisualDescriptor } from "powerbi-client";

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

function retrieveVisualInfoFromStorage(
  visualFullName: string[],
  count: number
) {
  // let infos = [];
  // let images = [];

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

    // if (visualFullName.length > 2 && visualFullName[1] == "Insight") {
    //   for (let i = 0; i < visualData.insightInfosStatus.length; ++i) {
    //     switch (visualData.insightInfosStatus[i]) {
    //       case global.infoStatus.original:
    //         images.push(visualInfos.insightImages[i]);
    //         infos.push(visualInfos.insightInfos[i]);
    //         break;
    //       case global.infoStatus.changed:
    //       case global.infoStatus.added:
    //         images.push("dotImg");
    //         infos.push(visualData.changedInsightInfos[i]);
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // } else if (visualFullName.length > 2 && visualFullName[1] == "Interaction") {
    //   for (let i = 0; i < visualData.interactionInfosStatus.length; ++i) {
    //     switch (visualData.interactionInfosStatus[i]) {
    //       case global.infoStatus.original:
    //         images.push(visualInfos.interactionImages[i]);
    //         infos.push(visualInfos.interactionInfos[i]);
    //         break;
    //       case global.infoStatus.changed:
    //       case global.infoStatus.added:
    //         images.push("dotImg");
    //         infos.push(visualData.changedInteractionInfos[i]);
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // } else {
    //   for (let i = 0; i < visualData.generalInfosStatus.length; ++i) {
    //     switch (visualData.generalInfosStatus[i]) {
    //       case global.infoStatus.original:
    //         images.push(visualInfos.generalImages[i]);
    //         infos.push(visualInfos.generalInfos[i]);
    //         break;
    //       case global.infoStatus.changed:
    //       case global.infoStatus.added:
    //         images.push("dotImg");
    //         infos.push(visualData.changedGeneralInfos[i]);
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // }
    return visualData;
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
  const visualInfos = await helpers.getVisualInfos(<VisualDescriptor>visual); // this was the original await statement

  const visualData = retrieveVisualInfoFromStorage(visualFullName, count);

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
