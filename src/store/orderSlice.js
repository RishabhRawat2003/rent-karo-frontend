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

const getOrders = createAsyncThunk("order/get-orders", async (data) => {
    try {
        const response = await axios.post(`${backend}/order/get-orders`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw error.message || "An unexpected error occurred";
    }
});

const getOrdersByUser = createAsyncThunk("order/get-orders-by-user", async (data) => {
    try {
        const response = await axios.post(`${backend}/order/get-orders-user`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw error.message || "An unexpected error occurred";
    }
});

const getSingleOrder = createAsyncThunk("order/get-single-order", async (id) => {
    try {
        const response = await axios.get(`${backend}/order/get-order/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw error.message || "An unexpected error occurred";
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
    name: "order",
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
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getOrdersByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrdersByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(getOrdersByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getSingleOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(getSingleOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
    },
});

export { createPayment, verifyPayment, getOrders, getOrdersByUser, getSingleOrder };
export default orderSlice.reducer;
