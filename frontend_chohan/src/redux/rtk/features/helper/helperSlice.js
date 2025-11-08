import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  helper: null,
  error: "",
  loading: false,
};

export const addHelper = createAsyncThunk(
  "helper/addHelper",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `helper/`,
        data: {
          ...values,
        },
      });

      return successHandler(data);
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteHelper = createAsyncThunk(
  "helper/deleteHelper",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `helper/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(data, "Helper deleted successfully", "warning");
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

export const loadAllHelper = createAsyncThunk(
  "helper/loadAllHelper",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`helper?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateHelper = createAsyncThunk(
  "helper/updateHelper",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/helper/${id}`,
        data: {
          ...values,
        },
      });
      // dispatch(loadAllHelper());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const helperSlice = createSlice({
  name: "Helper",
  initialState,
  reducers: {
    clearHelper: (state) => {
      state.helper = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllHelper ======

    builder.addCase(loadAllHelper.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllHelper.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllHelper.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addHelper======

    builder.addCase(addHelper.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addHelper.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addHelper.rejected, (state, action) => {
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

    // 4) ====== builders for deleteHelper ======

    builder.addCase(deleteHelper.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteHelper.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteHelper.rejected, (state, action) => {
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

export default helperSlice.reducer;
export const { clearHelper } = helperSlice.actions;
