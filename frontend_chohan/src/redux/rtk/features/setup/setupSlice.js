import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  setup: null,
  error: "",
  loading: false,
};

export const addSetup = createAsyncThunk("setup/addSetup", async (values) => {
  try {
    const { data } = await axios({
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `setup/`,
      data: {
        ...values,
      },
    });

    return successHandler(data, "Setup added successfully");
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const deleteSetup = createAsyncThunk("setup/deleteSetup", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `setup/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "Setup deleted successfully", "warning");
  } catch (error) {
    return errorHandler(error, true);
  }
});

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

export const loadAllSetup = createAsyncThunk(
  "setup/loadAllSetup",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`setup?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateSetup = createAsyncThunk(
  "setup/updateSetup",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/setup/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllSetup());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const setupSlice = createSlice({
  name: "Setup",
  initialState,
  reducers: {
    clearSetup: (state) => {
      state.setup = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllSetup ======

    builder.addCase(loadAllSetup.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllSetup.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllSetup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addSetup======

    builder.addCase(addSetup.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addSetup.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addSetup.rejected, (state, action) => {
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

    // 4) ====== builders for deleteSetup ======

    builder.addCase(deleteSetup.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSetup.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteSetup.rejected, (state, action) => {
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

export default setupSlice.reducer;
export const { clearSetup } = setupSlice.actions;
