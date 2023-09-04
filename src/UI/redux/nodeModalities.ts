import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { mediaType } from "../../onboarding/ts/globalVariables";

export interface NodeModalitiesState {
  fullName: string[];
  basicName: string;
  media: mediaType;
  content?: string;
  mediaStorage?: string;
}

const initialState: NodeModalitiesState = {
  fullName: [],
  basicName: "",
  media: mediaType.text,
  content: "",
  mediaStorage: "",
};

export const NodeModalities = createSlice({
  name: "nodeModal",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<any>) => {
      state.basicName = action.payload[0];
      state.fullName = action.payload[1];
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment } = NodeModalities.actions;

export default NodeModalities.reducer;
