import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  branch: null,
  error: "",
  loading: false,
};

export const addBranch = createAsyncThunk(
  "branch/addBranch",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `branch/`,
        data: {
          ...values,
        },
      });

      return successHandler(data, "Branch added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteBranch = createAsyncThunk(
  "branch/deleteBranch",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `branch/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(data, "Branch deleted successfully", "warning");
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

export const loadAllBranch = createAsyncThunk(
  "branch/loadAllBranch",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`branch?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateBranch = createAsyncThunk(
  "branch/updateBranch",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/branch/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllBranch());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const branchSlice = createSlice({
  name: "Branch",
  initialState,
  reducers: {
    clearBranch: (state) => {
      state.branch = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllBranch ======

    builder.addCase(loadAllBranch.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBranch.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBranch.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addBranch======

    builder.addCase(addBranch.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addBranch.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addBranch.rejected, (state, action) => {
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

    // 4) ====== builders for deleteBranch ======

    builder.addCase(deleteBranch.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteBranch.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteBranch.rejected, (state, action) => {
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

export default branchSlice.reducer;
export const { clearBranch } = branchSlice.actions;
