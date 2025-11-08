import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  proformaInvoice: null,
  error: "",
  loading: false,
};
export const addproformaInvoice = createAsyncThunk(
  "proformaInvoice/addproformaInvoice",
  async (values) => {
    try {


      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `proformaInvoice/`,
        data: {
          ...values,
        },
      });
      return data;    
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteproformaInvoice = createAsyncThunk(
  "proformaInvoice/deleteproformaInvoice",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `proformaInvoice/${id}`,
        data: {
          invoiceId: id,
          status: "false",
        },
      });

      return successHandler(
        data,
        "proformaInvoice deleted successfully",
        "warning"
      );
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const loadSingleproformaInvoice = createAsyncThunk(
  "proformaInvoice/loadSingleproformaInvoice",
  async ({ id }) => {
    try {
      const { data } = await axios({
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/proformaInvoice/${id}`,
        data: {},
      });

      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const loadAllproformaInvoice = createAsyncThunk(
  "proformaInvoice/loadAllproformaInvoice",
  async (arg) => {
    try {
      const query = queryGenerator(arg);

      const { data } = await axios.get(`/proformaInvoice?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateproformaInvoice = createAsyncThunk(
  "proformaInvoice/updateproformaInvoice",
  async (data) => {
    try {
      const { data: response } = await axios({
        method: "post",
        url: `proformaInvoice/`,
        headers: {
          "Content-Type": "application/json",
        },
        data, // send the data object directly here
      });
      return successHandler(response, "proformaInvoice added successfully");
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const proformaInvoiceSlice = createSlice({
  name: "proformaInvoice",
  initialState,
  reducers: {
    clearproformaInvoice: (state) => {
      state.proformaInvoice = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllproformaInvoice ======

    builder.addCase(loadAllproformaInvoice.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllproformaInvoice.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllproformaInvoice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleproformaInvoice ======

    builder.addCase(loadSingleproformaInvoice.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSingleproformaInvoice.fulfilled, (state, action) => {
      state.loading = false;
      state.proformaInvoice = action.payload?.data?.data[0];
    });

    builder.addCase(loadSingleproformaInvoice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addproformaInvoice======

    builder.addCase(addproformaInvoice.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addproformaInvoice.fulfilled, (state, action) => {
      state.loading = false;
      state.payload= action;
    });

    builder.addCase(addproformaInvoice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    builder.addCase(deleteproformaInvoice.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteproformaInvoice.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteproformaInvoice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default proformaInvoiceSlice.reducer;
export const { clearproformaInvoice } = proformaInvoiceSlice.actions;
