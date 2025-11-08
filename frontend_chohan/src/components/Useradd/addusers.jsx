import { Button, Card, Form, Input, Select, Typography } from "antd";

import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { addCity, loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllState } from "../../redux/rtk/features/state/stateSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadRolePaginated } from "../../redux/rtk/features/hr/role/roleSlice";

const AddUser = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const { list } = useSelector((state) => state.StateNames);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API;

  const [data, dataList] = useState([]);
  const [total, setTotal] = useState(0);
  // const [loading, setLoading] = useState(false);

  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const { list: cityList } = useSelector((state) => state.city);
  const handleLoadState = () => {
    dispatch(loadAllState({ page: 1, count: 10000, status: true }));
  };
  const { list: stateList } = useSelector((state) => state.StateNames);
  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      console.log(uppercaseValues, "postvalie");
      const { username, password, email, roleId } = uppercaseValues;
      const response = await axios.post(`${apiUrl}/users`, {
        username,
        password,
        email,
        roleId,
      });
      toast.success(" Deatils successful Insert!");
      window.location.reload();
      // const resp = await dispatch(addCity(uppercaseValues, dispatch));
      if (resp.payload.message === "success") {
        dispatch(loadAllCity({ page: 1, count: 1000, status: true }));
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  const onClick = () => {
    setLoading(true);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const result = await dispatch(
        loadRolePaginated({ status: true, page: 1, count: 1000 })
      );
      dataList(result.payload.data || []);
      setTotal(result.payload.total || 0);
    };
    fetchRoles();
  }, [dispatch]);

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add User
        </Title>
        <Form
          form={form}
          className=""
          name="basic"
          // labelCol={{
          //   span: 5,
          // }}
          // wrapperCol={{
          //   span: 16,
          // }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="User Name"
            name="username"
            rules={[
              {
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select Role">
              {data.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            className="flex justify-center mt-[24px]"
          >
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              onClick={onClick}
            >
              Add User
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddUser;
