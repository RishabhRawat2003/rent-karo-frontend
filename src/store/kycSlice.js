import { TOKEN } from "@/utils/enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

// Define the kyc async thunk action
const createKyc = createAsyncThunk("user/kyc", async (data) => {
    try {
        const response = await axios.post(`${backend}/kyc/create-kyc`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
});

const createKycBusiness = createAsyncThunk("user/kyc-business", async (data) => {
    try {
        const response = await axios.post(`${backend}/kyc/create-kyc-business`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
});

const getKycByUser = createAsyncThunk("user/get-user-kyc", async () => {
    try {
        const response = await axios.get(`${backend}/kyc/get-kyc-by-user`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data
        }
        throw error.message || "An unexpected error occurred"
    }
})

const getKycById = createAsyncThunk("user/get-kyc-id", async (id) => {
    try {
        const response = await axios.get(`${backend}/kyc/get-kyc/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data
        }
        throw error.message || "An unexpected error occurred"
    }
})

// Define the initial state
const initialState = {
    kyc: null,
    loading: true,
    error: null,
};

// Create the slice
const kycSlice = createSlice({
    name: "kyc",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createKyc.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createKyc.fulfilled, (state, action) => {
                state.kyc = action.payload.kyc;
                state.loading = false;
            })
            .addCase(createKyc.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(createKycBusiness.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createKycBusiness.fulfilled, (state, action) => {
                state.kyc = action.payload.kyc;
                state.loading = false;
            })
            .addCase(createKycBusiness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getKycByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getKycByUser.fulfilled, (state, actions) => {
                state.kyc = actions.payload.kyc
                state.loading = false
            })
            .addCase(getKycByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getKycById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getKycById.fulfilled, (state, actions) => {
                state.kyc = actions.payload.kyc
                state.loading = false
            })
            .addCase(getKycById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
    },
});

export { createKyc, getKycByUser, createKycBusiness, getKycById };
export default kycSlice.reducer;
