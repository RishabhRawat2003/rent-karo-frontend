import { ADMINTOKEN } from "@/utils/enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = 'http://localhost:8000/api/v1';

const login = createAsyncThunk("admin/login", async (data) => {
    try {
        const response = await axios.post(`${backend}/admin/login`, data);
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
    admin: null,
    loading: false,
    error: null,
};

// Create the slice
const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.admin;
                localStorage.setItem(ADMINTOKEN, JSON.stringify(action.payload.token));
                state.loading = false
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || "An error ocurred"
            })
    },
});

export { login };
export default adminSlice.reducer;
