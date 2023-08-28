import { configureStore } from "@reduxjs/toolkit";
import nodeModalitiesReducer from "./nodeModalities";
import expertiseReducer from "./expertise";
import { combineReducers } from "redux";

export default combineReducers({
  nodeModalitiesReducer,
  expertiseReducer,
});
export const store = configureStore({
  reducer: {
    nodeModal: nodeModalitiesReducer,
    expertise: expertiseReducer,
  },
});

console.log("State", store.getState());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
