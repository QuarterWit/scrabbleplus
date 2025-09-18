// src/app/store/activeGameSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Mode = "quick" | "ranked" | "private" | "ai";

// keep state as an object; mutate fields
type ActiveGameState = {
  current: { id: string; mode: Mode } | null;
};

const initialState: ActiveGameState = { current: null };

const activeGameSlice = createSlice({
  name: "activeGame",
  initialState,
  reducers: {
    setActiveGame(state, action: PayloadAction<{ id: string; mode: Mode }>) {
      state.current = action.payload; // mutate
    },
    clearActiveGame(state) {
      state.current = null; // mutate
    },
  },
});

export const { setActiveGame, clearActiveGame } = activeGameSlice.actions;
export default activeGameSlice.reducer;

// selector (adjust RootState path as needed)
export const selectActiveGame = (state: any) => state.activeGame.current;
