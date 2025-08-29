import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import claimService from "../services/claim.service";

export const getByWorkHourId = createAsyncThunk(
    "claim/getByWorkHourId",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await claimService.getByWorkHourId(id, token);
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

export const getAllComments = createAsyncThunk(
    "claim/getAllComments",
    async (claimId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await claimService.getAllComments(claimId, token);
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

export const createClaimComment = createAsyncThunk(
    "claim/createClaimComment",
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await claimService.createComment(data, token);
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

export const createClaim = createAsyncThunk(
    "claim/createClaim",
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await claimService.create(data, token);
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
    claim: null,
    claimComments: [],
    isClaimLoading: false,
    isCommentsLoading: false,
    error: null,
};

const claimSlice = createSlice({
    name: "claim",
    initialState,
    reducers: {
        clearClaims: (state) => {
            state.claim = null;
            state.claimComments = [];
        },
        addReceivedComment: (state, action) => {
            state.claimComments.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createClaim.pending, (state) => {
                state.isClaimLoading = true;
            })
            .addCase(createClaim.fulfilled, (state, action) => {
                state.isClaimLoading = false;
                state.claim = action.payload;
            })
            .addCase(createClaim.rejected, (state) => {
                state.isClaimLoading = false;
            })
            .addCase(getByWorkHourId.pending, (state) => {
                state.isClaimLoading = true;
            })
            .addCase(getByWorkHourId.fulfilled, (state, action) => {
                state.isClaimLoading = false;
                state.claim = action.payload;
                state.claimComments = action.payload.comments;
            })
            .addCase(getByWorkHourId.rejected, (state) => {
                state.isClaimLoading = false;
            })
            .addCase(getAllComments.pending, (state) => {
                state.isCommentsLoading = true;
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.isCommentsLoading = false;
                state.claimComments = action.payload;
            })
            .addCase(getAllComments.rejected, (state) => {
                state.isCommentsLoading = false;
            })
            .addCase(createClaimComment.pending, (state) => {
                state.isCommentsLoading = true;
            })
            .addCase(createClaimComment.fulfilled, (state, action) => {
                state.isCommentsLoading = false;
                state.claimComments.push(action.payload);
            })
            .addCase(createClaimComment.rejected, (state) => {
                state.isCommentsLoading = false;
            });
    },
});

export default claimSlice.reducer;
export const { clearClaims, addReceivedComment } = claimSlice.actions;