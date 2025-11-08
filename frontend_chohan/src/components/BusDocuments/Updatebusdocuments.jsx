import { Button, Form, Input, Select, Typography, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllBranch } from "../../redux/rtk/features/branch/branchSlice";
import { loadAllBusCategory } from "../../redux/rtk/features/busCategory/busCategorySlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const Updatebusdocuments = ({ id, data, onBusChange }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { list: busList } = useSelector((state) => state.buses);
  const selectedBus = busList.find(
    (bus) => String(bus.id) === String(data.BusID)
  );
  const selectedBusNo = selectedBus ? selectedBus.busNo : "";

  const apiUrl = import.meta.env.VITE_APP_API;

  // Load necessary data
  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    dispatch(loadAllBranch({ page: 1, count: 10000, status: true }));
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  // Set preview if document exists

  useEffect(() => {
    if (data?.ID) {
      setPreviewImage(`${apiUrl}/busdocuments/file/${data.ID}`);
    }
  }, [data?.ID]);

  // Set form values dynamically
  useEffect(() => {
    form.setFieldsValue({
      BusID: selectedBusNo,
      ExpiryDate: data?.ExpiryDate ? dayjs(data.ExpiryDate) : null,
      IntimateDays: data?.IntimateDays || "",
      NextDueDate: data?.NextDueDate ? dayjs(data.NextDueDate) : null,
      TaskName: data?.TaskName || "",
      doctype: data?.doctype || "",
    });
  }, [data, selectedBusNo, form]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const onFinish = async (values) => {
    const ID = data.ID;
    try {
      setLoading(true);
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
        formData.append("UploadDocument", file.name);
      }

      formData.append("ID", parseInt(ID));
      formData.append("BusID", parseInt(data.BusID));
      formData.append("TaskName", values.TaskName);
      formData.append("IntimateDays", values.IntimateDays);
      formData.append("doctype", values.doctype);

      const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : null;
      formData.append("ExpiryDate", formatDate(values.ExpiryDate));
      formData.append("NextDueDate", formatDate(values.NextDueDate));

      const response = await axios.post(`${apiUrl}/busdocuments/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 && response.data?.result?.status === 1) {
        toast.success("Document updated successfully!");
        onBusChange(response.data.result.data[0].BusID);

        // Clear everything
        form.resetFields();
        // setFile(null);
        // setPreviewImage(null);
      } else {
        toast.error(response.data?.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <Title level={4} className="m-3 text-center">
        Update Bus Documents
      </Title>
      <Form
        form={form}
        layout="vertical"
        style={{ margin: "0 40px" }}
        onFinish={onFinish}
        autoComplete="off"
        labelAlign="left"
      >
        <div className="flex flex-wrap -mx-2">
          <div className="w-full px-2 mb-4 md:w-1/2">
            <Form.Item label="Document Type" name="doctype" className="mb-4">
              <Select placeholder="Select Document Type" className="w-full">
                <Select.Option value="PERMIT">PERMIT</Select.Option>
                <Select.Option value="POLIUTION">POLIUTION</Select.Option>
                <Select.Option value="C.F">C/F</Select.Option>
                <Select.Option value="ROAD TAX">ROAD TAX</Select.Option>
                <Select.Option value="INSURANCE">INSURANCE</Select.Option>
                <Select.Option value="R.C/SMART">R.C/SMART</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Expiry Date" name="ExpiryDate" className="mb-4">
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
              <Input type="number" placeholder="Enter number of days" />
            </Form.Item>

            <Form.Item
              label="Next Due Date"
              name="NextDueDate"
              className="mb-4"
            >
              <DatePicker format="DD-MM-YYYY" className="w-full" />
            </Form.Item>

            <Form.Item
              label="Upload Document"
              name="UploadDocument"
              className="mb-4"
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

        {previewImage && (
          <img
            alt="Bus Document"
            style={{ width: "60%", maxHeight: "50vh", objectFit: "contain" }}
            src={previewImage}
          />
        )}

        <Form.Item className="flex justify-center mt-6">
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            loading={loading}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Updatebusdocuments;
