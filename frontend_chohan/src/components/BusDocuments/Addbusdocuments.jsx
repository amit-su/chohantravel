import React from "react";
import { Button, Form, Input, Select, Typography, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBus } from "../../redux/rtk/features/bus/busSlice";
import { loadAllBranch } from "../../redux/rtk/features/branch/branchSlice";
import { loadAllBusCategory } from "../../redux/rtk/features/busCategory/busCategorySlice";
import TextArea from "antd/es/input/TextArea";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addbusdocuments = ({ id, onBusChange }) => {
  console.log(id, "Received ID");
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: helperList } = useSelector((state) => state.helpers);
  const { list: branchList } = useSelector((state) => state.branches);
  const { list: busCategoryList } = useSelector((state) => state.busCategories);
  const { list: busList } = useSelector((state) => state.buses);
  const [fileData, setFileData] = useState(null); // State to store the file data
  const [file, setFile] = useState(null);
  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  const apiUrl = import.meta.env.VITE_APP_API;

  const [base64Image, setBase64Image] = useState(null);
  const handleIncludepermit = () => {};

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  console.log(file?.name, "7667676767");

  const onFinish = async (values) => {
    values.BusID = id;

    try {
      setLoading(true);
      const formData = new FormData();

      console.log("values bus doc", values);

      // Append the file and other data to the FormData object
      formData.append("file", file);
      formData.append("BusID", parseInt(id));
      formData.append("TaskName", values.TaskName);
      formData.append("IntimateDays", values.IntimateDays);
      formData.append("doctype", values.doctype);

      formData.append("UploadDocument", file?.name);

      // Format date fields to 'YYYY-MM-DD'
      const formatDate = (dateStr) => {
        if (dateStr) {
          return new Date(dateStr).toISOString().split("T")[0]; // ISO format
        }
        return null;
      };

      formData.append("ExpiryDate", formatDate(values.ExpiryDate));
      formData.append("NextDueDate", formatDate(values.NextDueDate));

      console.log(formData, "uytyty"); // Include file data in the form submission

      const response = await axios.post(`${apiUrl}/busdocuments/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Details added successfully!");
        onBusChange(response.data.result.data[0].BusID);
        form.resetFields();
        setFile(null); // Reset file input after successful submission
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  return (
    <div className="h-full p-6 bg-white rounded-lg shadow-md">
      <Title level={4} className="mb-6 text-center text-blue-600">
        Add Bus Documents
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="flex flex-wrap -mx-2">
          <div className="w-full px-2 mb-4 md:w-1/2">
            <Form.Item label="Document Type" name="doctype" className="mb-4">
              <Select
                placeholder="Select Document Type"
                className="w-full"
                onChange={handleIncludepermit}
              >
                <Select.Option value="PERMIT">PERMIT</Select.Option>
                <Select.Option value="POLIUTION">POLIUTION</Select.Option>
                <Select.Option value="C.F">C/F</Select.Option>
                <Select.Option value="ROAD TAX">ROAD TAX</Select.Option>
                <Select.Option value="INSURANCE">INSURANCE</Select.Option>
                <Select.Option value="R.C/SMART">R.C/SMART</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Expiry Date"
              name="ExpiryDate"
              className="mb-4"
              rules={[{ required: false, message: "Please input a date!" }]}
            >
              <DatePicker format="DD-MM-YYYY" className="w-full" />
            </Form.Item>
          </div>

          <div className="w-full px-2 mb-4 md:w-1/2">
            <Form.Item
              label="Intimate Days"
              name="IntimateDays"
              className="mb-4"
              rules={[
                { required: true, message: "Please fill in this field!" },
              ]}
            >
              <Input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of days"
              />
            </Form.Item>

            <Form.Item
              label="Next Due Date"
              name="NextDueDate"
              className="mb-4"
              rules={[{ required: false, message: "Please input a date!" }]}
            >
              <DatePicker format="DD-MM-YYYY" className="w-full" />
            </Form.Item>

            <Form.Item
              label="Upload Document"
              name="UploadDocument"
              className="mb-4"
              rules={[
                { required: false, message: "Please upload a document!" },
              ]}
            >
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded-lg py-1.5 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item className="flex justify-center mt-6">
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            loading={loading}
            className="px-8 py-2"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Addbusdocuments;
