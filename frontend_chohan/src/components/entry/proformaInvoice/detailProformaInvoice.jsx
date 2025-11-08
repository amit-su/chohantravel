import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";

import moment from "moment";
import {
  loadSingleBookingEntry,
  updatebookingEntry,
} from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import {
  addLocalBooking,
  clearLocalBooking,
} from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import dayjs from "dayjs";
import CreateProformaInvoice from "./CreateProformaInvoice";
const DetailProformaInvoice = () => {
  const { bookingEntry, total, loading } = useSelector(
    (state) => state.bookingEntry
  );
  const { id } = useParams();
  const decodedBookingID = decodeURIComponent(id);
  const [initValues, setInitValues] = useState({
    bookingDate: dayjs(),
    BookingNo: decodedBookingID,
    ContactPersonName: "",
    PartyID: 0,
    includeGST: false,
    ContactPersonNo: "",
    address: "",
    email: "",
    paymentTerms: "",
    localBookingList: [],
  });

  const formattedBookingID = decodedBookingID.replace(/\//g, "-");

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [isIncludeGST, setIsIncludeGST] = useState();

  const [confirmBookings, setConfirmBookings] = useState(false);
  const handleConfirm = () => {
    setConfirmBookings(true);
  };

  const dispatch = useDispatch();
  const [form] = Form.useForm();

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
      form.setFieldsValue({
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
        const resp = await dispatch(updatebookingEntry(data));
        setConfirmBookings(false);
        if (resp.payload.message === "success") {
          setLoader(false);
          navigate("/admin/booking-entry");
        }
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    const res = dispatch(
      loadSingleBookingEntry({ id: formattedBookingID, decodedBookingID })
    );
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  }, [dispatch, formattedBookingID, form, decodedBookingID]);

  // console.log("bookingEntry in update", bookingEntry);
  useEffect(() => {
    // Parse the LocalBookingList string into an array of objects
    if (bookingEntry && bookingEntry[0]?.LocalBookingList) {
      const parsedList = JSON.parse(
        bookingEntry && bookingEntry[0]?.LocalBookingList
      );
      console.log("parsedList", parsedList);
      dispatch(clearLocalBooking());
      // dispatch(addLocalBooking(parsedList[0]));
      if (parsedList && parsedList.length > 0) {
        parsedList.forEach((item) => {
          dispatch(addLocalBooking(item));
        });
      }
    }
  }, [bookingEntry, dispatch]);

  useEffect(() => {
    if (bookingEntry && bookingEntry[0]) {
      const entry = bookingEntry[0];
      form.setFieldsValue({
        bookingDate: moment(entry.bookingDate),
        BookingNo: entry.BookingNo,
        ContactPersonName: entry.ContactPersonName,
        PartyID: parseInt(entry.PartyID),
        includeGST: entry.GSTInclude,
        ContactPersonNo: entry.ContactPersonNo,
        address: entry.partyAddr,
        email: entry.Email,
        paymentTerms: entry.PaymentTerms,
      });
      handlePartySelect(parseInt(entry.PartyID));
    }
  }, [bookingEntry, form]);

  return <CreateProformaInvoice isIncludeGST={initValues?.includeGST} />;
};

export default DetailProformaInvoice;
