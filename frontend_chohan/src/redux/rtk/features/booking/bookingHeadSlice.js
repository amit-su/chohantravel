import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  bookingHead: null,
  error: "",
  loading: false,
};
export const addbookingHead = createAsyncThunk(
  "bookingHead/addbookingHead",
  async (data) => {
    try {
      const { data: response } = await axios({
        method: "post",
        url: `bookingHead/`,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      return successHandler(response, "bookingHead added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deletebookingHead = createAsyncThunk(
  "bookingHead/deletebookingHead",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `bookingHead/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(
        data,
        "bookingHead deleted successfully",
        "warning"
      );
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

export const loadAllBookingHead = createAsyncThunk(
  "bookingHead/loadAllBookingHead",
  async (arg) => {
    try {
      console.log("bookingHead arg", arg);
      const query = queryGenerator(arg);
      const { data } = await axios.get(`bookingHead?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updatebookingHead = createAsyncThunk(
  "bookingHead/updatebookingHead",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/bookingHead/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllBookingHead());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const bookingHeadSlice = createSlice({
  name: "bookingHead",
  initialState,
  reducers: {
    clearbookingHead: (state) => {
      state.bookingHead = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllbookingHead ======

    builder.addCase(loadAllBookingHead.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBookingHead.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBookingHead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addbookingHead======

    builder.addCase(addbookingHead.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addbookingHead.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addbookingHead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleProductBrand ======

    // builder.addCase(loadSingleProductBrand.pending, (state) => {
    //   state.loading = true;
    // });

    // builder.addCase(loadSingleProductBrand.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.brand = action.payload?.data;
    // });

    // builder.addCase(loadSingleProductBrand.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });

    // 4) ====== builders for deletebookingHead ======

    builder.addCase(deletebookingHead.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deletebookingHead.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deletebookingHead.rejected, (state, action) => {
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

export default bookingHeadSlice.reducer;
export const { clearbookingHead } = bookingHeadSlice.actions;
