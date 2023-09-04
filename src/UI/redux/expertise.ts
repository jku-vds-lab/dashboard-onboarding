import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ExpertiseLevel {
  Domain: Level;
  Vis: Level;
}

export enum Level {
  Low = 1,
  Medium = 2,
  High = 3,
}

const initialState: ExpertiseLevel = {
  Domain: Level.Medium,
  Vis: Level.Medium,
};

export const Expertise = createSlice({
  name: "expertise",
  initialState,
  reducers: {
    decrement: (state, action: PayloadAction<ExpertiseLevel>) => {
      state.Domain = action.payload.Domain;
      state.Vis = action.payload.Vis;
    },
  },
});

// Action creators are generated for each case reducer function
export const { decrement } = Expertise.actions;

export default Expertise.reducer;
