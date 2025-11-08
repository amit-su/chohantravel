import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  site: null,
  error: "",
  loading: false,
};

export const addSite = createAsyncThunk("site/addSite", async (values) => {
  try {
    const { data } = await axios({
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `site/`,
      data: {
        ...values,
      },
    });

    if (data.status === 1) {
      return successHandler(data, "Site added successfully");
    }
    return errorHandler();
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const deleteSite = createAsyncThunk("site/deleteSite", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `/site/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "Site deleted successfully", "warning");
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

export const loadAllSite = createAsyncThunk("site/loadAllSite", async (arg) => {
  try {
    const query = queryGenerator(arg);
    const { data } = await axios.get(`site?${query}`);
    return successHandler(data);
  } catch (error) {
    return errorHandler(error);
  }
});



export const updateSite = createAsyncThunk(
  "site/updateSite",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/site/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllSite());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const siteSlice = createSlice({
  name: "Site",
  initialState,
  reducers: {
    clearSite: (state) => {
      state.site = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllSite ======

    builder.addCase(loadAllSite.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllSite.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllSite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addSite======

    builder.addCase(addSite.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addSite.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addSite.rejected, (state, action) => {
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

    // 4) ====== builders for deleteSite ======

    builder.addCase(deleteSite.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSite.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteSite.rejected, (state, action) => {
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

export default siteSlice.reducer;
export const { clearSite } = siteSlice.actions;
