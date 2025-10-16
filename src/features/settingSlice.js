import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import settingService from "../services/setting.service";

export const getSettings = createAsyncThunk(
    "setting/getSettings",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await settingService.getSettings(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createAndUpdateSettings = createAsyncThunk(
    "setting/createAndUpdateSettings",
    async (settings, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await settingService.createAndUpdateSettings(token, settings);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    settings: {},
    isLoading: false,
    error: null,
};

const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
        resetSetting: (state) => {
            state.settings = {};
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.settings = action.payload;
            })
            .addCase(getSettings.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(createAndUpdateSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createAndUpdateSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.settings = action.payload;
            })
            .addCase(createAndUpdateSettings.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default settingSlice.reducer;
export const { resetSetting } = settingSlice.actions;