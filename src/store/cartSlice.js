import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely access localStorage
const getCartFromStorage = () => {
    if (typeof window !== 'undefined') {
        try {
            return JSON.parse(localStorage.getItem('cartItems')) || [];
        } catch (error) {
            console.error('Error parsing cart data from localStorage:', error);
            return [];
        }
    }
    return [];
};

// Helper function to safely set localStorage
const setCartToStorage = (cart) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart data to localStorage:', error);
        }
    }
};

const initialState = {
    cart: getCartFromStorage(), // Use helper function instead of direct localStorage access
    loading: false,
    error: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cart.find(item => item._id === action.payload._id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + action.payload.quantity;
                if(existingItem.quantity >= existingItem.stocks){
                    existingItem.quantity = existingItem.stocks;
                }
            } else {
                state.cart.push({ ...action.payload });
            }
            setCartToStorage(state.cart);
        },
        
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item._id !== action.payload);
            setCartToStorage(state.cart);
        },
        
        increaseQuantity: (state, action) => {
            const item = state.cart.find(item => item._id === action.payload);
            if (item && item.quantity < item.stocks) { // Add stock validation
                item.quantity += 1;
                setCartToStorage(state.cart);
            }
        },
        
        decreaseQuantity: (state, action) => {
            const item = state.cart.find(item => item._id === action.payload);
            if (item) {
                item.quantity = Math.max(1, item.quantity - 1);
                setCartToStorage(state.cart);
            }
        },
        
        // Helper action to sync with localStorage if needed
        loadCartFromStorage: (state) => {
            const cartData = getCartFromStorage();
            state.cart = cartData;
        },

        // Clear cart action (useful for after successful order)
        clearCart: (state) => {
            state.cart = [];
            setCartToStorage(state.cart);
        }
    }
})

export const { 
    addToCart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    loadCartFromStorage,
    clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
