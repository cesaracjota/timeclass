import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import workHourService from "../services/workHour.service";

const initialState = {
    workHours: [],
    workHourImportResponse: [],
    workHoursSkippedAcademy: [],
    workHoursSkippedSchool: [],
    workHour: {},
    totalPages: 0,
    currentPage: 1,
    totalItems: 0,
    isLoading: false,
    error: null,
};

export const getAllWorkHours = createAsyncThunk(
    "workHours/getAllWorkHours",
    async ({ page = 1, limit = 10, search = "" }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;

            return await workHourService.getAllWorkHours({ token, page, limit, search });
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

export const getAllWorkHoursByStatus = createAsyncThunk(
    "workHours/getAllWorkHoursByStatus",
    async ({ page = 1, limit = 10, estado = "", search = "" }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.getWorkHoursByStatus({ token, page, limit, estado, search });
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


export const getWorkHourById = createAsyncThunk(
    "workHours/getWorkHourById",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.getWorkHourById(id, token);
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

export const getWorkHourByTeacherId = createAsyncThunk(
    "workHours/getWorkHourByTeacherId",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.getWorkHourByTeacherId(id, token);
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

export const getWorkHoursByMonthWeekDay = createAsyncThunk(
    "workHours/getWorkHoursByMonthWeekDay",
    async ({ id, data }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.getWorkHoursByMonthWeekDay(id, data, token);
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

export const createWorkHour = createAsyncThunk(
    "workHours/createWorkHour",
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.create(userData, token);
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

export const uploadWorkHours = createAsyncThunk(
    "workHours/uploadWorkHours",
    async (file, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.uploadWorkHours(file, token);
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

export const updateWorkHour = createAsyncThunk(
    "workHours/updateWorkHour",
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.update(data, token);
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

export const updateStatusWorkHour = createAsyncThunk(
    "workHours/updateStatusWorkHour",
    async ({ id, estado }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.updateStatus(id, estado, token);
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

export const deleteWorkHour = createAsyncThunk(
    "workHours/deleteWorkHour",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await workHourService.deleteWorkHour(id, token);
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

const workHourSlice = createSlice({
    name: "workHour",
    initialState,
    reducers: {
        resetWorkHour: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(getAllWorkHours.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAllWorkHours.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHours = action.payload.data;
            state.totalPages = action.payload.meta?.totalPages;
            state.currentPage = action.payload.meta?.page;
            state.totalItems = action.payload.meta?.total;
        });        
        builder.addCase(getAllWorkHours.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(getAllWorkHoursByStatus.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAllWorkHoursByStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHours = action.payload.data;
            state.totalPages = action.payload.meta?.totalPages;
            state.currentPage = action.payload.meta?.page;
            state.totalItems = action.payload.meta?.total;
        });        
        builder.addCase(getAllWorkHoursByStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        builder.addCase(getWorkHourById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getWorkHourById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHour = action.payload;
        });
        builder.addCase(getWorkHourById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(getWorkHourByTeacherId.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getWorkHourByTeacherId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHoursTeacher = action.payload;
        });
        builder.addCase(getWorkHourByTeacherId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(getWorkHoursByMonthWeekDay.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getWorkHoursByMonthWeekDay.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHoursTeacher = action.payload;
        });
        builder.addCase(getWorkHoursByMonthWeekDay.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createWorkHour.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createWorkHour.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHours = [...state.workHours, action.payload];
        });
        builder.addCase(createWorkHour.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(uploadWorkHours.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(uploadWorkHours.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHourImportResponse = action.payload;
            state.workHoursSkippedAcademy = action.payload.academy?.skipped;
            state.workHoursSkippedSchool = action.payload.school?.skipped;
        });
        builder.addCase(uploadWorkHours.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updateWorkHour.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateWorkHour.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHours = state.workHours.map((data) =>
                data.id === action.payload.id ? action.payload : data
            );
        });
        builder.addCase(updateWorkHour.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updateStatusWorkHour.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateStatusWorkHour.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHours = state.workHours.map((data) =>
                data.id === action.payload.id ? action.payload : data
            );
            state.workHoursTeacher = state.workHoursTeacher.map((data) =>
                data.id === action.payload.id ? action.payload : data
            );
        });
        builder.addCase(updateStatusWorkHour.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        builder.addCase(deleteWorkHour.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteWorkHour.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workHours = state.workHours.filter((data) => data.id !== action.payload.id);
        });
        builder.addCase(deleteWorkHour.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    }
});

export const { resetWorkHour } = workHourSlice.actions;

export default workHourSlice.reducer;
