import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  company: null,
  error: "",
  loading: false,
};

export const addCompany = createAsyncThunk(
  "company/addCompany",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `company/`,
        data: {
          ...values,
        },
      });

      return successHandler(data, "Company added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `company/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(data, "Company deleted successfully", "warning");
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

export const loadAllCompany = createAsyncThunk(
  "company/loadAllCompany",
  // async (arg) => {
  //   try {
  //     const query = queryGenerator(arg);
  //     const { data } = await axios.get(`company?${query}`);
  //     return successHandler(data);
  //   } catch (error) {
  //     return errorHandler(error);
  //   }
  // }
  async (arg) => {
    try {
      const query = queryGenerator(arg);
    //  const { data } = await axios.get(`party?${query}`);
      const { data }= await axios({
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `company?${query}`,
        
      });
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }

);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/company/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllCompany());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const companySlice = createSlice({
  name: "Company",
  initialState,
  reducers: {
    clearCompany: (state) => {
      state.company = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllCompany ======

    builder.addCase(loadAllCompany.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addCompany======

    builder.addCase(addCompany.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addCompany.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addCompany.rejected, (state, action) => {
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

    // 4) ====== builders for deleteCompany ======

    builder.addCase(deleteCompany.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteCompany.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteCompany.rejected, (state, action) => {
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

export default companySlice.reducer;
export const { clearCompany } = companySlice.actions;
