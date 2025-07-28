import { TOKEN } from "@/utils/enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

// Define the kyc async thunk action
const createPayment = createAsyncThunk("order/create", async (data) => {
    try {
        const response = await axios.post(`${backend}/order/create-payment`, data, {
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

const verifyPayment = createAsyncThunk("order/verify", async (data) => {
    try {
        const response = await axios.post(`${backend}/order/verify-payment`, data, {
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

// Define the initial state
const initialState = {
    order: null,
    loading: true,
    error: null,
};

// Create the slice
const orderSlice = createSlice({
    name: "kyc",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPayment.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
    },
});

export { createPayment, verifyPayment };
export default orderSlice.reducer;
