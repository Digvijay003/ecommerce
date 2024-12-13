import { configureStore } from '@reduxjs/toolkit';
import productReducer, { ProductSliceState } from './reducers/productSlice';
import cartSliceReducer, { cartSliceState } from './reducers/cartSlice';

// Define the persisted state structure
interface PersistedState {
  product: ProductSliceState;
  cart: cartSliceState;
}

// Load state from localStorage
const loadState = (): PersistedState => {
  if (typeof window === 'undefined') {
    return { product: { product: [] }, cart: { cart: [] } }; // Default for SSR
  }
  const savedState = localStorage.getItem('reduxState');
  return savedState
    ? JSON.parse(savedState)
    : { product: { product: [] }, cart: { cart: []} };
};

// Save state to localStorage
const saveState = (state: PersistedState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('reduxState', JSON.stringify(state));
  }
};

// Initialize store with persisted state
const preloadedState = loadState();

// Configure the store
export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartSliceReducer,
  },
  preloadedState,
});

// Subscribe to save state changes to localStorage
store.subscribe(() => {
  const stateToSave: PersistedState = {
    product: store.getState().product,
    cart: store.getState().cart,
  };
  saveState(stateToSave);
});

// Export types for usage in your application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
