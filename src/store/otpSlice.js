import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

const sendOtp = createAsyncThunk("otp/send-otp", async (data) => {
    try {
        const response = await axios.post(`${backend}/otp/send-otp`, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
});

const verifyOtp = createAsyncThunk("otp/verify-otp", async (data) => {
    try {
        const response = await axios.post(`${backend}/otp/verify-otp`, data);
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
    otp: null,
    loading: false,
    error: null,
};

// Create the slice
const otpSlice = createSlice({
    name: "otp",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.otp = action.payload.otp;
                state.loading = false;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.otp = action.payload.otp;
                state.loading = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
    },
});

export { sendOtp, verifyOtp };
export default otpSlice.reducer;
