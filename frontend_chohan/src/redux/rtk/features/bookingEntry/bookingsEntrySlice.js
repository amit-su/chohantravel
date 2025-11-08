import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  bookingEntry: null,
  stock: -1,
  error: "",
  loading: false,
};
export const addbookingEntry = createAsyncThunk(
  "bookingEntry/addbookingEntry",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `bookingEntry/`,
        data: {
          ...values,
        },
      });

      return successHandler(data, "bookingEntry added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deletebookingEntry = createAsyncThunk(
  "bookingEntry/deletebookingEntry",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `bookingEntry/`,
        data: {
          BookingID: id,
          status: "false",
        },
      });

      return successHandler(
        data,
        "bookingEntry deleted successfully",
        "warning"
      );
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const loadSingleBookingEntry = createAsyncThunk(
  "bookingEntry/loadSingleBookingEntry",
  async ({ id, decodedBookingID }) => {
    try {
      const { data } = await axios({
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/bookingEntry/${id}`,
        data: {
          decodedBookingID: decodedBookingID,
        },
      });

      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const loadAllBookingEntry = createAsyncThunk(
  "bookingEntry/loadAllBookingEntry",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`bookingEntry?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
export const CheckBusAvalability = createAsyncThunk(
  "bookingEntry/checkBusAvalability",
  async (values) => {
    try {
      const { data } = await axios({
        method: "patch",
        url: `bookingEntry/`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { ...values }, // send the data object directly here
      });
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updatebookingEntry = createAsyncThunk(
  "bookingEntry/updatebookingEntry",
  async (data) => {
    try {
      const { data: response } = await axios({
        method: "post",
        url: `bookingEntry/`,
        headers: {
          "Content-Type": "application/json",
        },
        data, // send the data object directly here
      });
      return successHandler(response, "bookingEntry added successfully");
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const deleteBookingTran = createAsyncThunk(
  "bookingEntry/deleteBookingTran",
  async (id) => {
    try {
      const { data: response } = await axios({
        method: "delete",
        url: `bookingEntry/tran/${id}`, // ID is passed in URL now
        headers: {
          "Content-Type": "application/json",
        },
      });

      return successHandler(response, "BookingTran deleted successfully");
    } catch (error) {
      return errorHandler(error);
    }
  }
);

const bookingEntrySlice = createSlice({
  name: "bookingEntry",
  initialState,
  reducers: {
    clearbookingEntry: (state) => {
      state.bookingEntry = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllbookingEntry ======

    builder.addCase(loadAllBookingEntry.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBookingEntry.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBookingEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleBookingEntry ======

    builder.addCase(loadSingleBookingEntry.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSingleBookingEntry.fulfilled, (state, action) => {
      state.loading = false;
      state.bookingEntry = action.payload?.data?.data;
    });

    builder.addCase(loadSingleBookingEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    // 3) ====== builders for check bus avalibility ======

    builder.addCase(CheckBusAvalability.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(CheckBusAvalability.fulfilled, (state, action) => {
      state.loading = false;
      state.stock = action.payload?.data?.data?.length;
      state.list = action.payload?.data?.data;
    });

    builder.addCase(CheckBusAvalability.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addbookingEntry======

    builder.addCase(addbookingEntry.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addbookingEntry.fulfilled, (state, action) => {
      state.loading = false;
      state.payload = action;
    });

    builder.addCase(addbookingEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    builder.addCase(deletebookingEntry.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deletebookingEntry.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deletebookingEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default bookingEntrySlice.reducer;
export const { clearbookingEntry } = bookingEntrySlice.actions;
