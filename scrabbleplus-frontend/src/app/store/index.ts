import { configureStore } from "@reduxjs/toolkit";
import activeGame from "./activeGameSlice";

export const store = configureStore({
  reducer: {
    activeGame,
    // add more slices here later
  },
});

// types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
