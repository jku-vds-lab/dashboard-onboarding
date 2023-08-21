import * as infoCard from "./infoCards";
import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import * as elements from "./elements";
import { findCurrentTraversalVisual } from "./traversal";
import { VisualDescriptor } from "powerbi-client";
import InteractionDescription from "./Content/interactionDescription";

export function startInteractionExample() {
  global.setInteractionMode(true);
  infoCard.removeInfoCard();
  const traversalElem = findCurrentTraversalVisual();
  if (traversalElem) {
    createInteractionCard(traversalElem[0]);
  }
}

export async function createInteractionCard(visual: VisualDescriptor) {
  const interactionDesc = new InteractionDescription();
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
    helpers.createCard("interactionCard", style, "rectLeftBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "interactionCard"
    );
  } else {
    helpers.createCard("interactionCard", style, "rectRightBig");
    helpers.createCloseButton(
      "closeButton",
      "closeButtonPlacementBig",
      "",
      helpers.getCloseFunction(),
      "interactionCard"
    );
  }
  helpers.createCardContent(
    global.settings.interactionExample.title,
    "",
    "interactionCard"
  );
  helpers.createCardButtons("cardButtons", "", "", "back to visual");

  await interactionDesc.createInteractionInfo(visual);
}

export function removeInteractionCard() {
  elements.removeElement("interactionCard");
  elements.removeElement("disabledUpper");
  elements.removeElement("disabledLower");
  elements.removeElement("disabledRight");
  elements.removeElement("disabledLeft");
  disable.removeFrame();
}
