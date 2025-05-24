import { configureStore } from "@reduxjs/toolkit";
import userReducers from "./userSlice";
import adminReducers from "./adminSlice";
import organisationReducers from "./organisationSlice";
import kycReducers from "./kycSlice";

const store = configureStore({
    reducer: {
        user: userReducers,
        admin: adminReducers,
        kyc: kycReducers,
        organisation: organisationReducers
    },
});

export default store;