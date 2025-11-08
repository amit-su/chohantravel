import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  booking: null,
  error: "",
  loading: false,
};
export const addBooking = createAsyncThunk(
  "booking/addBooking",
  async (data) => {
    try {
      const { data: response } = await axios({
        method: "post",
        url: `booking/`,
        headers: {
          "Content-Type": "application/json",
        },
        data, // send the data object directly here
      });
      return successHandler(response, "Booking added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `booking/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(data, "Booking deleted successfully", "warning");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

// export const loadSingleProductBrand = createAsyncThunk(
//   "productBrand/loadSingleProductBrand",
//   async (id) => {
//     try {
//       const { data } = await axios.get(`product-brand/${id}`);
//       return successHandler(data);
//     } catch (error) {
//       return errorHandler(error);
//     }
//   }
// );

export const loadAllBooking = createAsyncThunk(
  "booking/loadAllBooking",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`booking?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/booking/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllBooking());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const bookingSlice = createSlice({
  name: "Booking",
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.booking = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllBooking ======

    builder.addCase(loadAllBooking.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addBooking======

    builder.addCase(addBooking.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addBooking.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    builder.addCase(deleteBooking.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default bookingSlice.reducer;
export const { clearBooking } = bookingSlice.actions;
