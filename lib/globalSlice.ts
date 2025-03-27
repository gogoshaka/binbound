import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GlobaSliceState {
    lang: "en"|"fr";
  }
  
  const initialState: GlobaSliceState = {
    lang: "en"
  };
  
  // If you are not using async thunks you can use the standalone `createSlice`.
  export const globalSlice = createAppSlice({
    name: "counter",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
      // Use the `PayloadAction` type to declare the contents of `action.payload`
      change: create.reducer(
        (state, action: PayloadAction<"en"|"fr">) => {
          state.lang = action.payload;
        },
      ),
    }),
    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
      selectLanguage: (counter) => counter.lang,
    },
  });
  
  // Action creators are generated for each case reducer function.
  export const { change } =
  globalSlice.actions;
  
  // Selectors returned by `slice.selectors` take the root state as their first argument.
  export const { selectLanguage } = globalSlice.selectors;
  
  