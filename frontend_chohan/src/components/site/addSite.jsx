import { Button, Card, Form, Input, Select, Typography } from "antd";

import { useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { addSite } from "../../redux/rtk/features/site/siteSlice";

import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import TextArea from "antd/es/input/TextArea";
import { loadAllStaff } from '../../redux/rtk/features/user/userSlice'
import axios from "axios";

const AddSite = () => {
  const apiUrl = import.meta.env.VITE_APP_API;
  const dispatch = useDispatch();
  const { Title } = Typography;
  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const handleLoadParty = () => {
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  };
  const labelStyle = { fontSize: "14px", fontWeight: "bold" };

  const { list: cityList } = useSelector((state) => state.city);
  const { list: partyList } = useSelector((state) => state.party);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);


  const GateAlluser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      const data = response.data.data;
      setUserList(response.data.data); // update state with user data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading2(false);
    }
  };
  


  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(addSite(uppercaseValues, dispatch));

      if (resp.payload.message === "success") {
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

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Site
        </Title>
        <Form
          form={form}
          className=""
          name="basic"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: "10px",  }}
            label={<span style={labelStyle}>Site Name</span>}
            name="siteName"
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
            label={<span style={labelStyle}>Short Name</span>}
            name="siteShortName"
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
            label={<span style={labelStyle}>City</span>}
            name="CityId"
            rules={[
              {
                required: true,
                message: "Please input state!",
              },
            ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              onClick={handleLoadCity}
              placeholder="Select city"
            >
              {cityList?.map((city) => (
                <Select.Option key={city.id} value={city.id}>
                  {city.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item
            style={{ marginBottom: "10px" }}
           label={<span style={labelStyle}>Pin Code</span>}

            name="pincode"
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
            label={<span style={labelStyle}>Site Address</span>}

            name="siteAddress"
            rules={[
              {
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <TextArea placeholder="Enter address" rows={4} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label={<span style={labelStyle}>Party</span>}

            name="partyId"
            rules={[
              {
                required: true,
                message: "Please input site!",
              },
            ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              onClick={handleLoadParty}
              placeholder="Select site"
            >
              {partyList?.map((party) => (
                <Select.Option key={party.id} value={party.id}>
                  {party.partyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label={<span style={labelStyle}>Active status</span>}

            name="siteActive"
            rules={[
              {
                required: true,
                message: "Please input status!",
              },
            ]}
          >
            <Select placeholder="Select status">
              <Select.Option value="1">Yes</Select.Option>
              <Select.Option value="0">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label={<span style={labelStyle}>Driver Khuraki</span>}

            name="DriverKhurakiAmt"
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
            label={<span style={labelStyle}>helper Khuraki</span>}
            name="HelperKhurakiAmt"
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
            label={<span style={labelStyle}>User</span>}

            name="UserId"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input User!",
            //   },
            // ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              onClick={GateAlluser}
              placeholder="Select user"
            >
              {userList?.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.username}
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
              Add Site
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddSite;
