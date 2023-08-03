import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Node } from "reactflow";
import DefaultNode from "../nodes-canvas/nodes/defaultNode";

import { mediaType } from "../../onboarding/ts/globalVariables";

export interface NodeModalitiesState {
  name: string;
  content: string;
  media: mediaType;
  mediaStorage?: string;
}

const initialState: NodeModalitiesState = {
  name: "",
  content: "",
  media: mediaType.text,
  mediaStorage: "",
};

export const NodeModalities = createSlice({
  name: "nodeModal",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<any>) => {
      debugger;
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      const container = document.getElementById("canvas-container");
      debugger;
      const event = action.payload[0];
      const defaultNode = action.payload[1];
      event.target.classList.contains("react-flow__pane")
        ? container?.classList.remove("show")
        : container?.classList.add("show");

      const fullNameArray = defaultNode().getFullNodeNameArray(event);
      const basicName = defaultNode().getBasicName(event);
      state.name = basicName;
      debugger;
    },
    decrement: (state) => {
      state.name = "Old";
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement } = NodeModalities.actions;

export default NodeModalities.reducer;
