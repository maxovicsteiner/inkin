import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { registerHTTP, loginHTTP, verifyHTTP } from "./service";

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await registerHTTP({ email, password });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await loginHTTP({ email, password });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verify = createAsyncThunk(
  "auth/verify",
  async ({ code }, thunkAPI) => {
    try {
      const uid = thunkAPI.getState().auth.user?.uid;
      if (uid) {
        const data = await verifyHTTP({ uid, code });
        return data;
      } else {
        throw new Error("An unexpected error happened");
      }
    } catch (error) {
      const message = getErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    reset: (state, action) => {
      return {
        user: state.user,
        isLoading: false,
        isError: false,
        message: "",
      };
    },
  },
  extraReducers: (builder) =>
    builder
      // register
      .addCase(register.pending, (state, action) => {
        state.isError = false;
        state.isLoading = true;
        state.message = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.message = "";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // login
      .addCase(login.pending, (state, action) => {
        state.isError = false;
        state.isLoading = true;
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.message = "";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // verify
      .addCase(verify.pending, (state, action) => {
        state.isError = false;
        state.isLoading = true;
        state.message = "";
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.message = "";
        state.user = action.payload;
      })
      .addCase(verify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      }),
});

export const { logout, reset } = authSlice.actions;

export default authSlice.reducer;
