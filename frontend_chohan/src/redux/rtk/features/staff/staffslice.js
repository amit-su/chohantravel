import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import {
  errorHandler,
  successHandler,
  errorMassage,
} from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";
import { clearState } from "../state/stateSlice";

const initialState = {
  list: null,
  total: 0,
  helper: null,
  error: "",
  loading: false,
};

export const addStaff = createAsyncThunk("staff/addStaff", async (values) => {
  try {
    const { data } = await axios({
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `staff/`,
      data: {
        ...values,
      },
    });
    if (data.status == 1) {
      return successHandler(data, "staff added successfully");
    } else if (data.status == 3) {
      return errorMassage(data, "Staff name alrady exites");
    }
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const deleteStaff = createAsyncThunk("staff/deleteStaff", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `staff/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "staff deleted successfully", "warning");
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

export const loadAllStaff = createAsyncThunk(
  "stadd/loadAllStaff",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`staff?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/staff/${id}`,
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
const StaffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearState: (state) => {
      state.staff = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllHelper ======

    builder.addCase(loadAllStaff.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllStaff.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllStaff.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addHelper======

    builder.addCase(addStaff.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addStaff.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addStaff.rejected, (state, action) => {
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

    builder.addCase(deleteStaff.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteStaff.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteStaff.rejected, (state, action) => {
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

export default StaffSlice.reducer;
export const { clearstaff } = StaffSlice.actions;
