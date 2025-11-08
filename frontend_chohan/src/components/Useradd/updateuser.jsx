import { Button, Form, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import axios from "axios";
import { loadRolePaginated } from "../../redux/rtk/features/hr/role/roleSlice";

function UpdateUser({ data: userData, id }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_APP_API;
  const [roles, setRoles] = useState([]); // <-- role list
  const [loader, setLoader] = useState(false);

  const [initValues, setInitValues] = useState({
    username: userData.username,
    id: userData.id,
    password: userData.password,
    email: userData.email,
    roleId: userData.roleId, // <-- Important
  });

  useEffect(() => {
    const fetchRoles = async () => {
      const result = await dispatch(loadRolePaginated({ status: true, page: 1, count: 1000 }));
      setRoles(result.payload.data || []); // <-- Correct variable
    };
    fetchRoles();
  }, [dispatch]);

  const onFinish = async (values) => {
    try {
      setLoader(true);
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string" ? values[key].toUpperCase() : values[key];
        return acc;
      }, {});

      const { username, password, email, roleId } = uppercaseValues; // <-- include roleId

      const response = await axios.put(`${apiUrl}/users/${id}`, {
        username,
        password,
        email,
        roleId, // <-- Send roleId
      });

      if (response.data?.status === 1) {
        toast.success("Details updated successfully!");
        dispatch(loadAllCity({ status: true, page: 1, count: 1000 }));
        form.resetFields();
      } else {
        toast.error("Failed to update user.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="text-center">
      <Form
        initialValues={initValues}
        form={form}
        layout="vertical"
        name="updateUserForm"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="User Name"
          name="username"
          rules={[{ required: true, message: "Please fill input!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please fill input!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please fill input!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="roleId"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select Role">
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            onClick={() => setLoader(true)}
            block
            type="primary"
            htmlType="submit"
            loading={loader}
            shape="round"
          >
            Update Now
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdateUser;
