import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";
const initialState = {
  list: null,
  total: 0,
  data: null,
  error: "",
  loading: false,
};

export const loadPowerbiToken = createAsyncThunk(
  "user/powerbilogin",
  async (arg) => {
    try {
      console.log("powerbi");

      const { data } = await axios.post(`user/powerbilogin`, arg);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

const powerbiSlice = createSlice({
  name: "powerbiInvoice",
  initialState,
  reducers: {
    clearPowerBi: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadPartyPaginated ======

    builder.addCase(loadPowerbiToken.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadPowerbiToken.fulfilled, (state, action) => {
      state.loading = false;

      state.data = action.payload?.data?.data;
      state.total = action.payload?.data?.count;
    });

    builder.addCase(loadPowerbiToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default powerbiSlice.reducer;
export const { clearPowerBi } = powerbiSlice.actions;
