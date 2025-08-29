import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import teacherService from "../services/teacher.service";

const initialState = {
    teachers: [],
    teacher: {},
    teacherImportResponse: {},
    isLoading: false,
    error: null,
};

export const getAllTeachers = createAsyncThunk(
    "users/getAllTeachers",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await teacherService.getAllTeachers(token);
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


export const getTeacherById = createAsyncThunk(
    "users/getTeacherById",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await teacherService.getTeacherById(id, token);
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

export const searchTeacher = createAsyncThunk(
    "users/searchTeacher",
    async (search, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await teacherService.searchTeacher(search, token);
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

export const createTeacher = createAsyncThunk(
    "users/createTeacher",
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await teacherService.create(userData, token);
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

export const uploadTeachers = createAsyncThunk(
    "teachers/uploadTeachers",
    async (file, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await teacherService.uploadTeachers(file, token);
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

export const updateTeacher = createAsyncThunk(
    "users/updateTeacher",
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await teacherService.update(userData, token);
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

export const deleteTeacher = createAsyncThunk(
    "users/deleteTeacher",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await teacherService.deleteTeacher(id, token);
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

const teacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {
        resetTeacher: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(getAllTeachers.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAllTeachers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.teachers = action.payload;
        });
        builder.addCase(getAllTeachers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(searchTeacher.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(searchTeacher.fulfilled, (state, action) => {
            state.isLoading = false;
            state.teachers = action.payload;
        });
        builder.addCase(searchTeacher.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });        
        builder.addCase(getTeacherById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getTeacherById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.teacher = action.payload;
        });
        builder.addCase(getTeacherById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createTeacher.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createTeacher.fulfilled, (state, action) => {
            state.isLoading = false;
            state.teachers = [...state.teachers, action.payload];
        });
        builder.addCase(createTeacher.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(uploadTeachers.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(uploadTeachers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.teachers = [...state.teachers, action.payload];
            state.teacherImportResponse = action.payload;
        });
        builder.addCase(uploadTeachers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updateTeacher.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateTeacher.fulfilled, (state, action) => {
            state.isLoading = false;
            state.teachers = state.teachers.map((data) =>
                data.id === action.payload.id ? action.payload : data
            );
        });
        builder.addCase(updateTeacher.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(deleteTeacher.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteTeacher.fulfilled, (state, action) => {
            state.isLoading = false;
            state.teachers = state.teachers.filter((data) => data.id !== action.payload.id);
        });
        builder.addCase(deleteTeacher.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    }
});

export const { resetTeacher } = teacherSlice.actions;

export default teacherSlice.reducer;
