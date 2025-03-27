import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import { createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export interface SpeechRecognizerSliceState {
    is_initializing: boolean,
    recognized_text: string
  }; 
const initialState: SpeechRecognizerSliceState = {
    is_initializing: false,
    recognized_text: ""
  };

export const startSpeechRecognizer = createAsyncThunk('speechRecognizer/startSpeechRecognizer', async () => {

});

export const speechRecognizerSlice = createAppSlice({
name: "speechRecognizer",
initialState,
reducers: (create) => ({
    setIsInitializing: create.reducer((state, action: PayloadAction<boolean>) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.is_initializing = action.payload;
    }),
    setRecognizedText: create.reducer((state, action: PayloadAction<string>) => {
        state.recognized_text = action.payload;
    })
}),
selectors: {
    selectIsInitializing: (state) => state.is_initializing,
    selectRecognizedText: (state) => state.recognized_text
    },
});

export const { selectIsInitializing } = speechRecognizerSlice.selectors;
export const { setIsInitializing } = speechRecognizerSlice.actions;
export const { selectRecognizedText } = speechRecognizerSlice.selectors;
export const { setRecognizedText } = speechRecognizerSlice.actions;
