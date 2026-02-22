import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    isInitialized: boolean;
    theme: 'light' | 'dark';
}

const initialState: AppState = {
    isInitialized: false,
    theme: 'light',
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export const { setInitialized, toggleTheme } = appSlice.actions;
export default appSlice.reducer;
