// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api'; // Adjust the path if necessary

export const store = configureStore({
  reducer: {
    // Add the API reducer to the store
    [api.reducerPath]: api.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
