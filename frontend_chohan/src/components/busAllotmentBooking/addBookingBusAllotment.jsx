import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const AddBookingBusAllotment = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);

  const [isIncludeGST, setIsIncludeGST] = useState();
  const [confirmBookings, setConfirmBookings] = useState(false);
  const handleConfirm = () => {
    setConfirmBookings(true);
  };
  const [initValues, setInitValues] = useState({
    bookingDate: dayjs(),
    BookingNo: `CT/${moment().format("DDMMYYYY")}/${id}`,
  });
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const handleLoadParty = () => {
    // dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  };
  const { list: partyList } = useSelector((state) => state.party);
  const { list: localBookingList } = useSelector(
    (state) => state.localBookingsData
  );
  const handleIncludeGST = (value) => {
    setIsIncludeGST(value);
  };
  const handlePartySelect = (partyId) => {
    const selectedParty = partyList?.find((party) => party.id === partyId);

    if (selectedParty) {
      const { partyName, mobileNo, partyAddr, gstNo, referredBy } =
        selectedParty;
      setInitValues({
        PartyID: partyId,
        ContactPersonName: partyName,
        ContactPersonNo: mobileNo,
        address: partyAddr,
        GSTNO: gstNo,
        referredBy: referredBy,
      });
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
      const data = {
        ...uppercaseValues,
        localBookingList: JSON.stringify(localBookingList),
      };
      if (localBookingList.length > 0 && confirmBookings === true) {
        // const resp = await dispatch(addbookingBusAllotment(data));

        setConfirmBookings(false);

        // if (resp.payload.message === "success") {
        //   setLoader(false);
        //   navigate("/admin/booking-entry");
        //   // Redirect to page = "admin/booking-entry"
        // }
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [initValues, form, localBookingList]);

  return (
    <Form
      form={form}
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      layout="vertical"
      initialValues={initValues}
      onFinishFailed={() => {
        setLoader(false);
      }}
      size="medium"
      autoComplete="off"
    >
      <div className="flex gap-20  ml-4 ">
        <div className=" ml-4 w-1/2">
          <Form.Item
            className="w-80"
            label="Booking No"
            name="BookingNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Enter contact Person Name" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "5px" }}
            label="Party"
            name="PartyID"
            className="w-80 mb-4"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Select
              onSelect={handlePartySelect}
              onClick={handleLoadParty}
              placeholder="Select party"
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
            >
              {partyList?.map((party) => (
                <Select.Option key={party.id} value={party.id}>
                  {party.partyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Booking Date"
            className="w-80"
            name="bookingDate"
            rules={[
              {
                required: false,
                message: "Please input Date!",
              },
            ]}
          >
            <DatePicker
              style={{ marginBottom: "5px", width: "100%" }}
              label="date"
              format={"DD-MM-YYYY"}
              value={dayjs(initValues.date, "DD-MM-YYYY")}
            />
          </Form.Item>

          <Form.Item
            className="w-80"
            label="Contact Person Name"
            name="ContactPersonName"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Enter contact Person Name" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Include GST"
            name="includeGST"
            className="w-80"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Select onChange={handleIncludeGST} placeholder="Include GST?">
              <Select.Option value="1">TRUE</Select.Option>
              <Select.Option value="0">FALSE</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="w-2/2 float-right">
          <Form.Item
            className="w-80"
            label="Contact No"
            name="ContactPersonNo"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input
              className=""
              placeholder="Enter Number"
              size={"small"}
              type="number"
            />
          </Form.Item>
          <Form.Item
            className="w-80"
            style={{ width: "30rem" }}
            label="Party Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input
              className=""
              placeholder="Enter Party address"
              size={"small"}
            />
          </Form.Item>

          <Form.Item
            style={{ width: "30rem" }}
            label="Email"
            className="w-80"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please provide valid input !",
              },
            ]}
          >
            <Input className="" placeholder="Enter Email" size={"small"} />
          </Form.Item>
          <Form.Item
            style={{ width: "30rem" }}
            label="Payment Terms"
            className="w-80"
            name="paymentTerms"
            rules={[
              {
                required: true,
                message: "Please provide valid input !",
              },
            ]}
          >
            <Input
              className=""
              placeholder="Enter Payment Terms"
              size={"small"}
            />
          </Form.Item>
        </div>
      </div>

      {/* <BookingsAdd isIncludeGST={isIncludeGST} /> */}

      <div className="w-80 my-4 float-right m-2">
        <Form.Item
          // hidden={confirmBookings}
          style={{ marginTop: "15px" }}
          className="w-72"
        >
          <Button
            block
            type="primary"
            htmlType="submit"
            onClick={handleConfirm}
            loading={loader}
          >
            Create Booking Entry
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AddBookingBusAllotment;
