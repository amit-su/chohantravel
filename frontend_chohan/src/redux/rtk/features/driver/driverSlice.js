import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import {
  errorHandler,
  successHandler,
  errorMassage,
} from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  driver: null,
  error: "",
  loading: false,
};

export const addDriver = createAsyncThunk(
  "driver/addDriver",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `driver/`,
        data: {
          ...values,
        },
      });
      console.log("data", data);
      if (data.status == 1) {
        return successHandler(data, "Driver insert sucessfull");
      } else if (data.status == 3) {
        return errorMassage(data, "Driver name alrady exites");
      }
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteDriver = createAsyncThunk(
  "driver/deleteDriver",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `driver/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(data, "Driver deleted successfully", "warning");
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

export const loadAllDriver = createAsyncThunk(
  "driver/loadAllDriver",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`driver?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateDriver = createAsyncThunk(
  "driver/updateDriver",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/driver/${id}`,
        data: {
          ...values,
        },
      });
      // dispatch(loadAllDriver());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const driverSlice = createSlice({
  name: "Driver",
  initialState,
  reducers: {
    clearDriver: (state) => {
      state.driver = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllDriver ======

    builder.addCase(loadAllDriver.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllDriver.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllDriver.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addDriver======

    builder.addCase(addDriver.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addDriver.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addDriver.rejected, (state, action) => {
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

    // 4) ====== builders for deleteDriver ======

    builder.addCase(deleteDriver.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteDriver.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteDriver.rejected, (state, action) => {
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

export default driverSlice.reducer;
export const { clearDriver } = driverSlice.actions;
