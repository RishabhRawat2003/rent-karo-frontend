import { TOKEN } from "@/utils/enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

// Define the signup async thunk action
const signup = createAsyncThunk("user/signup", async (data) => {
    try {
        const response = await axios.post(`${backend}/user/signup`, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
});

const login = createAsyncThunk("user/login", async (data) => {
    try {
        const response = await axios.post(`${backend}/user/login`, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
});

const userDetails = createAsyncThunk("user/userDetails", async () => {
    try {
        const response = await axios.post(`${backend}/user/get-user`, {}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        });
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
})

// Define the initial state
const initialState = {
    user: null,
    loading: false,
    error: null,
};

// Create the slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.user = action.payload.user;
                localStorage.setItem(TOKEN, JSON.stringify(action.payload.token));
                state.loading = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user;
                localStorage.setItem(TOKEN, JSON.stringify(action.payload.token));
                state.loading = false
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || "An error occurred"
            })
            .addCase(userDetails.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(userDetails.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.loading = false
            })
            .addCase(userDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred"
            })
    },
});

export { signup, login, userDetails };
export default userSlice.reducer;
