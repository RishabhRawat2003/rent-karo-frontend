import { TOKEN } from "@/utils/enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

const createReview = createAsyncThunk("review/create", async (data) => {
    try {
        const response = await axios.post(`${backend}/review/create-review`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
})

const getAllReviews = createAsyncThunk("review/get-all-reviews", async (id) => {
    try {
        const response = await axios.post(`${backend}/review/get-reviews/${id}`)
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
})

const removeSingleReview = createAsyncThunk("review/remove-review", async (id) => {
    try {
        const response = await axios.post(`${backend}/review/delete/${id}`,{}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`,
            }
        })
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
    review: null,
    loading: false,
    error: null,
};

// Create the slice
const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.review = action.payload.review;
                state.loading = false;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getAllReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.review = action.payload.review;
                state.loading = false;
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(removeSingleReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeSingleReview.fulfilled, (state, action) => {
                state.review = action.payload.review;
                state.loading = false;
            })
            .addCase(removeSingleReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
    },
});

export { createReview, getAllReviews, removeSingleReview };
export default reviewSlice.reducer;
