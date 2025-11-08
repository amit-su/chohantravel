import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  bookingBusAllotment: null,
  error: "",
  loading: false,
};

export const addBookingBusAllotment = createAsyncThunk(
  "bookingBusAllotment/addBookingBusAllotment",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `bookingBusAllotment/`,
        data: {
          ...values,
        },
      });

      return successHandler(data, "BookingBusAllotment added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteBookingBusAllotment = createAsyncThunk(
  "bookingBusAllotment/deleteBookingBusAllotment",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `bookingBusAllotment/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(
        data,
        "BookingBusAllotment deleted successfully",
        "warning"
      );
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const loadSingleBookingBusAllotment = createAsyncThunk(
  "bookingBusAllotment/loadSingleBookingBusAllotment",
  async ({ id, decodedBookingID, allotmentStatus }) => {
    try {
      const { data } = await axios({
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/bookingBusAllotment/${id}/${allotmentStatus}`,
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

export const loadAllBookingBusAllotment = createAsyncThunk(
  "bookingBusAllotment/loadAllBookingBusAllotment",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`bookingBusAllotment?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
export const closeDuty = createAsyncThunk(
  "bookingBusAllotment/closeDuty",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.patch(`bookingBusAllotment?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateBookingBusAllotment = createAsyncThunk(
  "bookingBusAllotment/updateBookingBusAllotment",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/bookingBusAllotment/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllBookingBusAllotment());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const bookingBusAllotmentSlice = createSlice({
  name: "BookingBusAllotment",
  initialState,
  reducers: {
    clearBookingBusAllotment: (state) => {
      state.bookingBusAllotment = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllBookingBusAllotment ======

    builder.addCase(loadAllBookingBusAllotment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBookingBusAllotment.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBookingBusAllotment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addBookingBusAllotment======

    builder.addCase(addBookingBusAllotment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addBookingBusAllotment.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addBookingBusAllotment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSinglebookingBusAllotments ======

    builder.addCase(loadSingleBookingBusAllotment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      loadSingleBookingBusAllotment.fulfilled,
      (state, action) => {
        state.loading = false;
        state.list = action?.payload?.data?.data;
        state.total = action?.payload?.data?.count;
      }
    );

    builder.addCase(loadSingleBookingBusAllotment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deleteBookingBusAllotment ======

    builder.addCase(deleteBookingBusAllotment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteBookingBusAllotment.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteBookingBusAllotment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    // 5) ========= builders for update product brand ======
    // builder.addCase(updateProductBrand.pending, (state) => {
    //   state.loading = true;
    // })
    // builder.addCase(updateProductBrand.fulfilled, (state) => {
    //   state.loading = false;
    // })
    // builder.addCase(loadAllProductBrand.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload?.error
    //  })
  },
});

export default bookingBusAllotmentSlice.reducer;
export const { clearBookingBusAllotment } = bookingBusAllotmentSlice.actions;
