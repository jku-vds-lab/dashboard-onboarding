import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { mediaType } from "../../onboarding/ts/globalVariables";
import { getDashboardInfoInEditor } from "../../onboarding/ts/dashboardInfoCard";
import { getFilterInfoInEditor } from "../../onboarding/ts/filterInfoCards";
import { getVisualInfoInEditor } from "../../onboarding/ts/infoCards";

export interface NodeModalitiesState {
  fullName: string[];
  media: mediaType;
  content?: string;
  mediaStorage?: string;
}

const initialState: NodeModalitiesState = {
  fullName: [],
  media: mediaType.text,
  content: "",
  mediaStorage: "",
};

export const fetchData = (fullNameArray: any) => {

  return async (dispatch: any) => {
    dispatch({ type: "FETCH_DATA_START" });

    try {
      const response = await getVisualInfoInEditor(fullNameArray, 1);

      dispatch({ type: "FETCH_DATA_SUCCESS", payload: response });
    } catch (error) {
      dispatch({ type: "FETCH_DATA_ERROR", payload: error });
    }
  };
};

export const NodeModalities = createSlice({
  name: "nodeModal",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<any>) => {
      const container = document.getElementById("canvas-container");
      const event = action.payload[0];
      const defaultNode = action.payload[1];
      event.target.classList.contains("react-flow__pane")
        ? container?.classList.remove("show")
        : container?.classList.add("show");

      const fullNameArray = defaultNode().getFullNodeNameArray(event);
      const basicName = defaultNode().getBasicName(event);
      state.fullName = fullNameArray;

      switch (basicName) {
        case "dashboard":
          getDashboardInfoInEditor(1);
          break;
        case "globalFilter":

          getFilterInfoInEditor(1); // why was this awaited in the past?
          break;
        case "group":
          break;
        default:
          if (fullNameArray) {

            fetchData(fullNameArray);
            //getVisualInfoInEditor(fullNameArray, 1);
          }
          break;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment } = NodeModalities.actions;

export default NodeModalities.reducer;
