import { configureStore } from "@reduxjs/toolkit";
import expertiseReducer from "../../../../UI/redux/expertise";

export const store = configureStore({
  reducer: {
    expertise: expertiseReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type MyRootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
