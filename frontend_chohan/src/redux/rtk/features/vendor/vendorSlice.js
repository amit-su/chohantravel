import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";
import { toast } from "react-toastify";

const initialState = {
    list: null,
    vendor: null,
    error: "",
    loading: false,
    total: 0,
};

export const loadVendorPaginated = createAsyncThunk(
    "vendor/loadVendorPaginated",
    async (arg) => {
        try {
            const { data } = await axios({
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                url: `vendor/`,
                data: arg,
            });
            return successHandler(data);
        } catch (error) {
            return errorHandler(error);
        }
    }
);

export const addSingleVendor = createAsyncThunk(
    "vendor/addVendor",
    async (values) => {
        try {
            const { data } = await axios({
                method: "post",
                url: `vendor/add`,
                data: { ...values, Operation: 1 },
            });
            return data.status === 1
                ? successHandler(data, "Vendor added successfully")
                : toast.warn(data.message || "Something went wrong...");
        } catch (error) {
            return errorHandler(error, true);
        }
    }
);

export const updateVendor = createAsyncThunk(
    "vendor/updateVendor",
    async ({ id, values, dispatch }) => {
        try {
            const { data } = await axios({
                method: "patch",
                url: `vendor/${id}`,
                data: { ...values, Operation: 2, VendorID: id },
            });
            if (data.status === 1) {
                dispatch(loadVendorPaginated({ status: true, page: 1, count: 1000 }));
                return successHandler(data, "Vendor updated successfully");
            } else {
                return toast.warn(data.message || "Something went wrong...");
            }
        } catch (error) {
            return errorHandler(error, true);
        }
    }
);

export const deleteVendor = createAsyncThunk(
    "vendor/deleteVendor",
    async (id) => {
        try {
            const { data } = await axios({
                method: "delete",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                url: `vendor/${id}`,
            });
            return successHandler(data, "Vendor deleted successfully", "warning");
        } catch (error) {
            return errorHandler(error, true);
        }
    }
);

const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        clearVendor: (state) => {
            state.vendor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadVendorPaginated.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadVendorPaginated.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload?.data?.data;
                state.total = action.payload?.data?.count;
            })
            .addCase(loadVendorPaginated.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            .addCase(addSingleVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSingleVendor.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data?.status === 1) {
                    if (!Array.isArray(state.list)) {
                        state.list = [];
                    }
                    const list = [...state.list];
                    list.unshift(action.payload?.data?.data[0]);
                    state.list = list;
                } else {
                    state.error = action.payload?.data?.message;
                }
            })
            .addCase(addSingleVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            .addCase(deleteVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteVendor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export default vendorSlice.reducer;
export const { clearVendor } = vendorSlice.actions;
