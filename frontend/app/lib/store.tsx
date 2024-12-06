import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import authReducer from "./features/authSlice";

const loadState = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const serializedState = localStorage.getItem("auth");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    return undefined;
  }
};

const saveState = (state: any) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("auth", JSON.stringify(state));
  } catch (e) {
    console.error("Error saving state:", e);
  }
};

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  preloadedState: {
    auth: loadState(),
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

store.subscribe(() => {
  saveState(store.getState().auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
