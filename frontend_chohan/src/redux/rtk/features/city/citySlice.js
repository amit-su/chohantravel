import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  city: null,
  error: "",
  loading: false,
};

export const addCity = createAsyncThunk("city/addCity", async (values) => {
  try {
    const { data } = await axios({
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `city/`,
      data: {
        ...values,
      },
    });

    return successHandler(data, "City added successfully");
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const deleteCity = createAsyncThunk("city/deleteCity", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `city/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "City deleted successfully", "warning");
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

export const loadAllCity = createAsyncThunk("city/loadAllCity", async (arg) => {
  try {
    const query = queryGenerator(arg);
    const { data } = await axios.get(`city?${query}`);
    return successHandler(data);
  } catch (error) {
    return errorHandler(error);
  }
});

export const updateCity = createAsyncThunk(
  "city/updateCity",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/city/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllCity());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const citySlice = createSlice({
  name: "City",
  initialState,
  reducers: {
    clearCity: (state) => {
      state.city = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllCity ======

    builder.addCase(loadAllCity.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllCity.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllCity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addCity======

    builder.addCase(addCity.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addCity.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addCity.rejected, (state, action) => {
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

    // 4) ====== builders for deleteCity ======

    builder.addCase(deleteCity.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteCity.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteCity.rejected, (state, action) => {
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

export default citySlice.reducer;
export const { clearCity } = citySlice.actions;
