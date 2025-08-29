import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "../services/report.service";

export const getAdminDashboard = createAsyncThunk(
    "report/getAdminDashboard",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await reportService.getAdminDashboard(token);
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

export const getTeacherDashboard = createAsyncThunk(
    "report/getTeacherDashboard",
    async (teacherId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await reportService.getTeacherDashboard(token, teacherId);
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

export const getWorkHourkByTeacherIdAndRangeDate = createAsyncThunk(
    "report/getWorkHourkByTeacherIdAndRangeDate",
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await reportService.getWorkHourByTeacherIdAndRangeRange(token, data);
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
)

const initialState = {
    adminDashboard: null,
    teacherDashboard: null,
    reportes: [],
    reportesLoading: false,
    isAdminDashboardLoading: false,
    isTeacherDashboardLoading: false,
    error: null,
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminDashboard.pending, (state) => {
                state.isAdminDashboardLoading = true;
            })
            .addCase(getAdminDashboard.fulfilled, (state, action) => {
                state.isAdminDashboardLoading = false;
                state.adminDashboard = action.payload;
            })
            .addCase(getAdminDashboard.rejected, (state) => {
                state.isAdminDashboardLoading = false;
            })
            .addCase(getTeacherDashboard.pending, (state) => {
                state.isTeacherDashboardLoading = true;
            })
            .addCase(getTeacherDashboard.fulfilled, (state, action) => {
                state.isTeacherDashboardLoading = false;
                state.teacherDashboard = action.payload;
            })
            .addCase(getTeacherDashboard.rejected, (state) => {
                state.isTeacherDashboardLoading = false;
            })
            .addCase(getWorkHourkByTeacherIdAndRangeDate.pending, (state) => {
                state.reportesLoading = true;
            })
            .addCase(getWorkHourkByTeacherIdAndRangeDate.fulfilled, (state, action) => {
                state.reportesLoading = false;
                state.reportes = action.payload;
            })
            .addCase(getWorkHourkByTeacherIdAndRangeDate.rejected, (state) => {
                state.reportesLoading = false;
            });
    },
});

export default reportSlice.reducer;