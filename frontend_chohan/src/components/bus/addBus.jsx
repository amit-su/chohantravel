import { Button, Form, Input, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBus } from "../../redux/rtk/features/bus/busSlice";
import { loadAllBranch } from "../../redux/rtk/features/branch/branchSlice";
import { loadAllBusCategory } from "../../redux/rtk/features/busCategory/busCategorySlice";
import TextArea from "antd/es/input/TextArea";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

const AddBus = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: helperList } = useSelector((state) => state.helpers);
  const handleLoadBranch = () => {
    dispatch(loadAllBranch({ page: 1, count: 10000, status: true }));
  };
  const { list: branchList } = useSelector((state) => state.branches);

  const handleLoadBusCategories = () => {
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
  };
  const { list: busCategoryList } = useSelector((state) => state.busCategories);
  const { list: companyList } = useSelector((state) => state.companies);

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  const onFinish = async (values) => {
    try {
      const UserID = localStorage.getItem("id");

      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});

      // Add UserID to the object
      const finalValues = { ...uppercaseValues, UserID: UserID };

      const resp = await dispatch(addBus({ values: finalValues, dispatch }));

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
    if (form) {
      setLoading(true);
    }
  };
  useEffect(() => {
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Bus Details
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
          <div className="flex flex-wrap justify-between">
            <div className="w-full p-2 md:w-1/2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Bus Name"
                name="busName"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Input transform={(value) => value.toUpperCase()} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Bus Number"
                name="busNo"
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
                label="Bus Owner"
                name="BusOwner"
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
                label="Bus Description"
                name="busType"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <TextArea placeholder="Enter Description " rows={4} />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Bus Category"
                name="busCategory"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Select
                  optionFilterProp="children" // Filters options based on the content of the children (party names)
                  showSearch
                  onClick={handleLoadBusCategories}
                  placeholder="Select category"
                >
                  {busCategoryList?.map((category) => (
                    <Select.Option
                      key={category.buscategory}
                      value={category.id}
                    >
                      {category.buscategory}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="company"
                name="Company_ID"
                rules={[
                  {
                    required: true,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Select
                  // onSelect={handleCompanySelect}
                  onClick={handleLoadCompany}
                  placeholder="Select company"
                  optionFilterProp="children" // Filters options based on the content of the children (party names)
                  showSearch
                >
                  {companyList?.map((company) => (
                    <Select.Option key={company.Id} value={company.Id}>
                      {company.Name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="w-full p-2 md:w-1/2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Sitting Capacity"
                name="sittingCapacity"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Driver"
                name="driverId"
                rules={[
                  {
                    required: true,
                    message: "Please input driver!",
                  },
                ]}
              >
                <Select
                  optionFilterProp="children"
                  showSearch
                  placeholder="Select driver"
                >
                  {[
                    ...new Map(
                      driverList?.map((item) => [item.name, item])
                    ).values(),
                  ].map((driver) => (
                    <Select.Option key={driver.id} value={driver.id}>
                      {driver.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Helper"
                name="helperId"
                rules={[
                  {
                    required: true,
                    message: "Please provide input!",
                  },
                ]}
              >
                <Select
                  optionFilterProp="children"
                  showSearch
                  placeholder="Select helper"
                >
                  {[
                    ...new Map(
                      helperList?.map((item) => [item.name, item])
                    ).values(),
                  ].map((helper) => (
                    <Select.Option key={helper.id} value={helper.id}>
                      {helper.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Make"
                name="make"
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
                label="Model"
                name="model"
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
                label="Engine No"
                name="engineNo"
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
                label="Chasis No"
                name="chasisNo"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {/* <Form.Item
                style={{ marginBottom: "10px" }}
                label="Branch"
                name="branchId"
                rules={[
                  {
                    required: true,
                    message: "Please input branch!",
                  },
                ]}
              >
                <Select
                  optionFilterProp="children" // Filters options based on the content of the children (party names)
                  showSearch
                  onClick={handleLoadBranch}
                  placeholder="Select branch"
                >
                  {branchList?.map((branch) => (
                    <Select.Option key={branch.Id} value={branch.Id}>
                      {branch.branch_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item> */}
            </div>
          </div>
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
              Add Bus
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddBus;
