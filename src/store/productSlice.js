import { TOKEN } from "@/utils/enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

const createProduct = createAsyncThunk("product/create", async (data) => {
    try {
        const response = await axios.post(`${backend}/product/create-product`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`,
                "Content-Type": 'multipart/form-data'
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

const getAllProducts = createAsyncThunk("product/get-all-products", async (data) => {
    try {
        const response = await axios.post(`${backend}/product/get-all`, data)
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
})

const getProductsByOrganisation = createAsyncThunk("product/get-org-products", async (payload) => {
    try {
        const response = await axios.post(`${backend}/product/get-products-by-organisation/${payload.id}`, payload.pagination, {
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

const removeSingleProduct = createAsyncThunk("product/remove-product", async (id) => {
    try {
        const response = await axios.delete(`${backend}/product/remove/${id}`, {
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

const updateProduct = createAsyncThunk("product/update-product", async (payload) => {
    try {
        const response = await axios.post(`${backend}/product/update/${payload.id}`, payload.data, {
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

const getSingleProduct = createAsyncThunk("product/get-product", async (id) => {
    try {
        const response = await axios.get(`${backend}/product/get/${id}`)
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data; // Handle server-side error
        }
        throw error.message || "An unexpected error occurred"; // Handle client-side or network error
    }
})

const getCategoryProduct = createAsyncThunk("product/get-category-product", async (data) => {
    try {
        const response = await axios.post(`${backend}/product/product-category`, data, {
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
    product: null,
    loading: false,
    error: null,
};

// Create the slice
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.product = action.payload.product;
                state.loading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.product = action.payload.product;
                state.loading = false;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getProductsByOrganisation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsByOrganisation.fulfilled, (state, action) => {
                state.product = action.payload.product;
                state.loading = false;
            })
            .addCase(getProductsByOrganisation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(removeSingleProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeSingleProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.product = action.payload.product;
                state.loading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getSingleProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleProduct.fulfilled, (state, action) => {
                state.product = action.payload.product;
                state.loading = false;
            })
            .addCase(getSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getCategoryProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategoryProduct.fulfilled, (state, action) => {
                state.product = action.payload.product;
                state.loading = false;
            })
            .addCase(getCategoryProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
    },
});

export { createProduct, getProductsByOrganisation, removeSingleProduct, updateProduct, getAllProducts, getSingleProduct, getCategoryProduct };
export default productSlice.reducer;
