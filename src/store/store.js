import { configureStore } from "@reduxjs/toolkit";
import userReducers from "./userSlice";
import adminReducers from "./adminSlice";
import organisationReducers from "./organisationSlice";
import kycReducers from "./kycSlice";
import reviewReducers from "./reviewSlice";
import cartReducers from './cartSlice'
import orderReducers from './orderSlice'
import otpReducers from './otpSlice'

const store = configureStore({
    reducer: {
        user: userReducers,
        admin: adminReducers,
        kyc: kycReducers,
        organisation: organisationReducers,
        review: reviewReducers,
        cart: cartReducers,
        order: orderReducers,
        otp: otpReducers
    },
});

export default store;