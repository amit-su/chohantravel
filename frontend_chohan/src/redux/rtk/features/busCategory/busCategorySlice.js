import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  busCategory: null,
  error: "",
  loading: false,
};

export const addBusCategory = createAsyncThunk(
  "busCategory/addBusCategory",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `busCategory/`,
        data: {
          ...values,
        },
      });

      if (data.status === 1) {
        return successHandler(data, "Bus Category updated successfully");
      }
      return errorHandler();
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteBusCategory = createAsyncThunk(
  "busCategory/deleteBusCategory",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `busCategory/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(
        data,
        "BusCategory deleted successfully",
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

export const loadAllBusCategory = createAsyncThunk(
  "busCategory/loadAllBusCategory",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`busCategory?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateBusCategory = createAsyncThunk(
  "busCategory/updateBusCategory",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/busCategory/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllBusCategory());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const busCategorySlice = createSlice({
  name: "BusCategory",
  initialState,
  reducers: {
    clearBusCategory: (state) => {
      state.busCategory = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllBusCategory ======

    builder.addCase(loadAllBusCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBusCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBusCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addBusCategory======

    builder.addCase(addBusCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addBusCategory.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.data?.status === 1) {
        if (!Array.isArray(state.list)) {
          state.list = [];
        }
        const list = [...state.list];
        list.push(action.payload.data.data[0]);
        state.list = list;
      }
    });

    builder.addCase(addBusCategory.rejected, (state, action) => {
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

    // 4) ====== builders for deleteBusCategory ======

    builder.addCase(deleteBusCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteBusCategory.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteBusCategory.rejected, (state, action) => {
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

export default busCategorySlice.reducer;
export const { clearBusCategory } = busCategorySlice.actions;
