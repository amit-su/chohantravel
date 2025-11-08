import { Button, Form, Input, Select } from "antd";
import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAllCity,
  updateCity,
} from "../../redux/rtk/features/city/citySlice";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import {
  loadAllSite,
  updateSite,
} from "../../redux/rtk/features/site/siteSlice";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

function UpdateSite({ data, id }) {

  const labelStyle = { fontSize: "14px", fontWeight: "bold" };

  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_APP_API;

  const dispatch = useDispatch();
  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const handleLoadParty = () => {
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  };
  const { list: cityList } = useSelector((state) => state.city);
  const { list: partyList } = useSelector((state) => state.party);
  const [userList, setUserList] = useState([]);

  const [loader, setLoader] = useState();
  const [initValues, setInitValues] = useState({
    ...data,
  });



  const GateAlluser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      const data = response.data.data;
      console.log(data);
      setUserList(response.data.data); // update state with user data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading2(false);
    }
  };

  
  useEffect(() => {
    GateAlluser();
    handleLoadCity();
  }, []);

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const res = await dispatch(updateSite({ id, values: uppercaseValues }));
      if (res) {
        dispatch(loadAllSite({ status: true, page: 1, count: 1000 }));
      }
      setInitValues({});
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const onFinishFailed = () => {};

  return (
    <>
      <div className="">
        <Form
          form={form}
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={initValues} // Set initial values here
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label={<span style={labelStyle}>Site Name</span>}
            name="siteName"
            rules={[
              {
                required: false,
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
                required: false,
                message: "Please fill input !",
              },
            ]}
          >
            <Input />
          </Form.Item>

       

          <Form.Item
            style={{ marginBottom: "10px" }}
            label={<span style={labelStyle}>City</span>}
            name="cityID"
            rules={[
              {
                required: false,
                message: "Please input state!",
              },
            ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
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
            name="pinCode"
            rules={[
              {
                required: false,
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
                required: false,
                message: "Please fill input !",
              },
            ]}
          >
            <TextArea placeholder="Enter address" rows={4} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label={<span style={labelStyle}>Party</span>}
            name="partyName"
            rules={[
              {
                required: false,
                message: "Please input site!",
              },
            ]}
          >
            <Select onClick={handleLoadParty} placeholder="Select site">
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
                required: false,
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
            className="flex justify-center mt-[24px]"
            style={{ marginBottom: "10px" }}
          >
            <Button
              onClick={() => setLoader(true)}
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
    </>
  );
}

export default UpdateSite;
