import { TOKEN } from "@/utils/enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the backend URL properly
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

// Define the kyc async thunk action
const createOrganisation = createAsyncThunk("user/organisation", async (data) => {
    try {
        const response = await axios.post(`${backend}/organisation/create`, data, {
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

const getSingleOrganisation = createAsyncThunk("user/get-single-organisation", async () => {
    try {
        const response = await axios.get(`${backend}/organisation/get-single-organisation`, {
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
    organisation: null,
    loading: true,
    error: null,
};

// Create the slice
const organisationSlice = createSlice({
    name: "organisation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrganisation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrganisation.fulfilled, (state, action) => {
                state.organisation = action.payload.organisation;
                state.loading = false;
            })
            .addCase(createOrganisation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
            .addCase(getSingleOrganisation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleOrganisation.fulfilled, (state, actions) => {
                state.organisation = actions.payload.organisation
                state.loading = false
            })
            .addCase(getSingleOrganisation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "An error occurred";
            })
    },
});

export { createOrganisation, getSingleOrganisation };
export default organisationSlice.reducer;
