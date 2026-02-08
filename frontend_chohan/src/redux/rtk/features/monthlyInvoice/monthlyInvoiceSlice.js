import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";

const initialState = {
    list: null,
    total: 0,
    monthlyInvoice: null,
    error: "",
    loading: false,
};

export const addMonthlyInvoice = createAsyncThunk(
    "monthlyInvoice/addMonthlyInvoice",
    async (values) => {
        try {
            const { data } = await axios({
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                url: `monthlyInvoice/`,
                data: { ...values },
            });
            return successHandler(data, "Monthly invoice created successfully");
        } catch (error) {
            return errorHandler(error, true);
        }
    }
);

export const deleteMonthlyInvoice = createAsyncThunk(
    "monthlyInvoice/deleteMonthlyInvoice",
    async (id) => {
        try {
            const { data } = await axios.delete(`monthlyInvoice/${id}`);
            return successHandler(data, "Monthly invoice deleted successfully", "success");
        } catch (error) {
            return errorHandler(error, true);
        }
    }
);

export const loadSingleMonthlyInvoice = createAsyncThunk(
    "monthlyInvoice/loadSingleMonthlyInvoice",
    async ({ id }) => {
        try {
            const { data } = await axios.get(`monthlyInvoice/${id}`);
            return successHandler(data);
        } catch (error) {
            return errorHandler(error);
        }
    }
);

export const loadAllMonthlyInvoice = createAsyncThunk(
    "monthlyInvoice/loadAllMonthlyInvoice",
    async (arg) => {
        try {
            const { data } = await axios.post(`monthlyInvoice/all`, arg);
            return successHandler(data);
        } catch (error) {
            return errorHandler(error);
        }
    }
);

export const updateMonthlyInvoice = createAsyncThunk(
    "monthlyInvoice/updateMonthlyInvoice",
    async (data) => {
        try {
            const { data: response } = await axios({
                method: "put",
                url: `monthlyInvoice/${data.ID}`,
                headers: { "Content-Type": "application/json" },
                data,
            });
            return successHandler(response, "Monthly invoice updated successfully");
        } catch (error) {
            return errorHandler(error);
        }
    }
);

const monthlyInvoiceSlice = createSlice({
    name: "monthlyInvoice",
    initialState,
    reducers: {
        clearMonthlyInvoice: (state) => {
            state.monthlyInvoice = null;
        },
    },
    extraReducers: (builder) => {
        // loadAll
        builder.addCase(loadAllMonthlyInvoice.pending, (state) => { state.loading = true; });
        builder.addCase(loadAllMonthlyInvoice.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action?.payload?.data?.data;
            state.total = action?.payload?.data?.count;
        });
        builder.addCase(loadAllMonthlyInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });

        // loadSingle
        builder.addCase(loadSingleMonthlyInvoice.pending, (state) => {
            state.loading = true;
            state.monthlyInvoice = null;
        });
        builder.addCase(loadSingleMonthlyInvoice.fulfilled, (state, action) => {
            state.loading = false;
            state.monthlyInvoice = action.payload?.data?.data[0];
        });
        builder.addCase(loadSingleMonthlyInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });

        // add
        builder.addCase(addMonthlyInvoice.pending, (state) => { state.loading = true; });
        builder.addCase(addMonthlyInvoice.fulfilled, (state) => { state.loading = false; });
        builder.addCase(addMonthlyInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });

        // update
        builder.addCase(updateMonthlyInvoice.pending, (state) => { state.loading = true; });
        builder.addCase(updateMonthlyInvoice.fulfilled, (state) => { state.loading = false; });
        builder.addCase(updateMonthlyInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });

        // delete
        builder.addCase(deleteMonthlyInvoice.pending, (state) => { state.loading = true; });
        builder.addCase(deleteMonthlyInvoice.fulfilled, (state) => { state.loading = false; });
        builder.addCase(deleteMonthlyInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    },
});

export default monthlyInvoiceSlice.reducer;
export const { clearMonthlyInvoice } = monthlyInvoiceSlice.actions;
