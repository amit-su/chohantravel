import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  bookingTran: null,
  error: "",
  loading: false,
};
export const addBookingTran = createAsyncThunk(
  "bookingTran/addBookingTran",
  async (data) => {
    try {
      const { data: response } = await axios({
        method: "post",
        url: `bookingTran/`,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      return successHandler(response, "BookingTran added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteBookingTran = createAsyncThunk(
  "bookingTran/deleteBookingTran",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `bookingTran/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(
        data,
        "BookingTran deleted successfully",
        "warning"
      );
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const loadSingleBookingTran = createAsyncThunk(
  "bookingTran/loadSingleBookingTran",
  async (id) => {
    try {
      const { data } = await axios.get(`bookingTran/${id}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const loadAllBookingTran = createAsyncThunk(
  "bookingTran/loadAllBookingTran",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`bookingTran?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateBookingTran = createAsyncThunk(
  "bookingTran/updateBookingTran",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/bookingTran/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllBookingTran());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const bookingTranSlice = createSlice({
  name: "BookingTran",
  initialState,
  reducers: {
    clearBookingTran: (state) => {
      state.bookingTran = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllBookingTran ======

    builder.addCase(loadAllBookingTran.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBookingTran.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBookingTran.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addBookingTran======

    builder.addCase(addBookingTran.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addBookingTran.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addBookingTran.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleBookingTran ======

    builder.addCase(loadSingleBookingTran.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSingleBookingTran.fulfilled, (state, action) => {
      state.loading = false;
      state.bookingTran = action.payload?.data?.data[0];
    });

    builder.addCase(loadSingleBookingTran.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deleteBookingTran ======

    builder.addCase(deleteBookingTran.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteBookingTran.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteBookingTran.rejected, (state, action) => {
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

export default bookingTranSlice.reducer;
export const { clearBookingTran } = bookingTranSlice.actions;
