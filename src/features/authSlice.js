// src/features/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import { CustomToast } from "../utils/CustomToast";

// Leer del localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user || null,
    codigoRecuperacion: null,
    emailToken: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    role: user?.user?.role || null,
};

// Helpers
const handleError = (error, thunkAPI) => {
    const message =
        (error.response && error.response.data && error.response.data.msg && error.response.data.error) ||
        error.message ||
        error.toString() || error.response.data.error;
    CustomToast({
        title: "Error",
        message: error?.response?.data?.error || "Credenciales incorrectas",
        type: "error",
        duration: 2500,
        position: "bottom",
    });
    return thunkAPI.rejectWithValue(message);
};

// Async actions
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        return await authService.register(userData);
    } catch (error) {
        return handleError(error, thunkAPI);
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        return await authService.login(userData);
    } catch (error) {
        return handleError(error, thunkAPI);
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user?.token;
        return await authService.updateProfile(userData, token);
    } catch (error) {
        return handleError(error, thunkAPI);
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (data, thunkAPI) => {
    try {
        return await authService.forgotPassword(data);
    } catch (error) {
        return handleError(error, thunkAPI);
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user?.token;
        return await authService.changePassword(data, token);
    } catch (error) {
        return handleError(error, thunkAPI);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await authService.logout();
    } catch (error) {
        return handleError(error, thunkAPI);
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => { state.isLoading = true; })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.role = action.payload.user?.role || null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.role = null;
            })

            .addCase(login.pending, (state) => { state.isLoading = true; })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.role = action.payload.user?.role || null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.role = null;
            })

            .addCase(updateProfile.pending, (state) => { state.isLoading = true; })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.role = action.payload.user?.role || null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.codigoRecuperacion = action.payload.codigoRecuperacion;
                state.emailToken = action.payload.emailToken;
                state.message = action.payload.msg;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(changePassword.pending, (state) => { state.isLoading = true; })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.msg;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.role = null;
                localStorage.removeItem('user');
            });
    }
});

// Exportar acciones y reducer
export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;