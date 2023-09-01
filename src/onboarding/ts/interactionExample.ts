import * as infoCard from "./infoCards";
import * as helpers from "./helperFunctions";
import * as global from "./globalVariables";
import * as disable from "./disableArea";
import * as elements from "./elements";
import { findCurrentTraversalVisual } from "./traversal";
import { VisualDescriptor } from "powerbi-client";
import InteractionExampleDescription from "./Content/Text Descriptions/interactionExampleDescription";

export function startInteractionExample() {
  debugger;
  global.setInteractionMode(true);
  infoCard.removeInfoCard();
  const traversalElem = findCurrentTraversalVisual();
  if (traversalElem) {
    createInteractionCard(traversalElem[0]);
  }
}

export async function createInteractionCard(visual: VisualDescriptor) {
  const interactionDesc = new InteractionExampleDescription();
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

  // await interactionDesc.getInteractionInfo(visual.type, visual);
}

export async function createInteractionCardForOutputPane(
  visual: VisualDescriptor
) {
  global.setInteractionMode(true);
  infoCard.removeInfoCard();
  const interactionDesc = new InteractionExampleDescription();
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

  helpers.createInteractionExampleButton("visualInfo", visual);

  // helpers.createCardButtons("cardButtons", "", "", "back to visual");
  // visual = visual as LineChart | BarChart | ColumnChart | ComboChart | Slicer;
  // await interactionDesc.getInteractionInfo(visual.type, visual);
}
export function removeInteractionCard() {
  elements.removeElement("interactionCard");
  elements.removeElement("disabledUpper");
  elements.removeElement("disabledLower");
  elements.removeElement("disabledRight");
  elements.removeElement("disabledLeft");
  disable.removeFrame();
}
