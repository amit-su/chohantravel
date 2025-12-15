import { Link } from "react-router-dom";
import { Form, Select, Button, DatePicker, Modal } from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../CommonUi/TableComponent";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../../Buttons/SimpleButton";
import axios from "axios";
import dayjs from "dayjs";
import {
  deletebookingEntry,
} from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import DetailBookingEntry from "./detailBookingEntry";
import AllotBus from "../../busAllotmentBooking/AllotBus";
import GetAllBusAllotmentToBooking from "./../../busAllotmentBooking/GetAllAllotmentToBooking";
import { loadSingleBookingBusAllotment } from "../../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";
import { Tooltip } from "antd";
const GetAllBookingEntry = (data) => {
  //API CALL//
  const [list2, setList] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const apiUrl = import.meta.env.VITE_APP_API;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [partyFilter, setPartyFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const showModal = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    form.resetFields(); // <-- Reset all form fields to initial values
  };

  const fetchData = async (page = 1, limit = 10) => {
    setLoading2(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(partyFilter && { partyId: partyFilter }), // Assuming partyFilter stores ID or Name, backend expects ID? Let's check. 
        // Wait, the select stores "PartyName" as value. The backend expects PartyID. 
        // I need to find the PartyID corresponding to the selected PartyName or change the Select to store ID.
        // The current implementation uses PartyName for filtering on the client side.
        // I should probably change the Select to use PartyID as value.
        // But list2 only has the PartyName from the booking list.
        // I need to fetch the list of parties with IDs to populate the Select properly if I want to filter by ID.
        // OR, I can pass the PartyName to the backend if I modify the SP to filter by PartyName subquery (which I did in the SP update: PartyID IN (SELECT id FROM PartyMast WHERE PartyName LIKE ...)).
        // So passing PartyName as search value or a separate param is fine if I handle it.
        // My SP update handles @SearchValue matching PartyName.
        // But for specific @PartyID filter, I need the ID.
        // Let's check how partyNames is populated: const partyNames = [...new Set(list2?.map((item) => item.PartyName))];
        // This only gets party names from the *current page* of data, which is wrong for server-side filtering.
        // I should fetch all parties for the filter dropdown.
        // For now, I will use the search input for general search and maybe skip the specific party ID filter unless I fetch parties.
        // The user asked for "filter data using party and booking date".
        // I'll assume I can pass the PartyName as a search param or I need to fetch parties.
        // Let's look at the code again.
        // There is `loadAllBookingEntry` which was removed.
        // There is no `loadAllParty` call visible.
        // I will stick to what I have:
        // 1. Search Input: Passes to `search` param (matches BookingNo, ContactPerson, PartyName).
        // 2. Date Filter: Passes to `bookingDate` param.
        // 3. Party Filter: The current dropdown is derived from `list2`, which is paginated. This is bad UX for server-side pagination.
        // I should probably fetch all parties. But I don't want to overcomplicate if not asked.
        // However, the user said "implement filter data using party".
        // If I use the existing `partyFilter` state, I can pass it. But wait, if I select a party from the dropdown (which currently only shows parties on the current page), and then I want to filter...
        // Actually, if I want to filter by Party, I should probably use a proper Party Select that fetches from `party` endpoint.
        // But I don't see `party` slice being used.
        // Let's look at `api_chohan/utils/constants.js` again. `GET_PARTY_PROCEDURE`.
        // I'll check if there is a `loadAllParty` action available in the codebase.
        // For now, I will implement the Search and Date filter first, and for Party, I will try to pass the selected value.
        // Wait, if I use `partyFilter` (which is a name), I can't pass it as `partyId` unless the backend handles it.
        // The backend expects `PartyID`.
        // My SP has `@PartyID INT`.
        // So I must pass an ID.
        // The current `Select` uses `PartyName` as value.
        // I will change the `Select` to use `SearchValue` for now if the user types, or I need to fetch parties.
        // Let's look at the `Select` options: `partyNames.map((party) => ... value={party})`.
        // This is definitely just names.
        // I will modify the frontend to use `SearchValue` for the general search.
        // For the specific "Party" filter, I really should fetch parties.
        // Let's see if I can find `loadAllParty`.
        ...(dateFilter && { bookingDate: dayjs(dateFilter).format("YYYY-MM-DD") }),
        ...(searchFilter && { search: searchFilter }),
      });

      // If partyFilter is selected, and it's a name, I can't pass it as PartyID.
      // But I can pass it as `search` if the user wants to filter by party name?
      // No, that's ambiguous.
      // I will check if I can import `loadAllParty`.

      const response = await axios.get(`${apiUrl}/bookingHead?${queryParams.toString()}`);
      setList(response.data.data);
      setTotalItems(response.data.count);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    dispatch(loadPartyPaginated({ status: true, page: 1, count: 1000 }));
    // Call the function
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, dateFilter, searchFilter, partyFilter]); // Add filters to dependency array
  //END//
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleExpand = (expanded, record) => {
    console.log("record", record);
    if (expanded) {
      setExpandedRowKeys([record.BookingNo]);
    } else {
      setExpandedRowKeys([]);
    }
  };
  const [maxId, setMaxId] = useState(0);

  const onDelete = async (id) => {
    const res = await dispatch(deletebookingEntry(id));
    if (res) {
      window.location.reload();
    }
  };

  const showDeleteConfirm = (booking) => {
    Modal.confirm({
      title: "Are you sure you want to delete this booking?",

      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDelete(booking);
      },
    });
  };

  const dispatch = useDispatch();
  const { list: partyList } = useSelector((state) => state.party);
  const columns = [
    {
      title: "Sl No",
      dataIndex: "slno",
      key: "slno",
      width: 70,
      render: (text, record, index) => index + 1,
      fixed: "left", // Optional: if you want to keep it fixed
    },
    {
      id: 1,
      title: "Booking Number",
      dataIndex: "BookingNo",
      key: "BookingNo",
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 1,
      title: "Invoice Number",
      dataIndex: "UsedInInvoice",
      key: "UsedInInvoice",
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 6,
      title: " Booking Date ",
      dataIndex: "BookingDate",
      key: "TripStartBookingDateDate",
      responsive: ["md"],
      render: (date) => moment(date).format("DD-MM-YYYY"),
      width: 120,
    },
    {
      id: 1,
      title: "Party Name",
      dataIndex: "PartyName",
      key: "PartyName",
      width: 220,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 5,
      title: "Contact Person Name",
      dataIndex: "ContactPersonName",
      key: "ContactPersonName",
      width: 220,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 5,
      title: "Contact Person Number",
      dataIndex: "ContactPersonNo",
      key: "ContactPersonNo",
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 7,
      title: "Reporting Address",
      dataIndex: "ReportAddr",
      key: "ReportAddr",
      width: 210,
      responsive: ["md"],
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 8,
      title: "Payment Terms",
      dataIndex: "PaymentTerms",
      key: "PaymentTerms",
      width: 120,
    },
    {
      id: 3,
      title: "GST Included",
      dataIndex: "GSTInclude",
      key: "GSTInclude",
      width: 90,
      render: (status) => (status === 1 ? "YES" : "NO"),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      align: "right", // Optional
      width: 200, // Adjust based on button size
      render: ({ BookingNo, ...restData }) => (
        <div className="flex items-center justify-end gap-2">
          <UserPrivateComponent permission="update-driver">
            {restData.UsedInInvoice === "" ? (
              <Link
                to={`/admin/update-bookingEntry/${encodeURIComponent(
                  BookingNo
                )}`}
              >
                <EditOutlined
                  className="p-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
                  style={{ fontSize: "15px", cursor: "pointer" }}
                />
              </Link>
            ) : (
              <span
                className="px-2 pb-2 text-white bg-gray-400 rounded-md opacity-50 cursor-not-allowed"
                style={{ fontSize: "15px" }}
                title="Cannot edit (invoice exists)"
              >
                <EditOutlined />
              </span>
            )}
          </UserPrivateComponent>

          <UserPrivateComponent permission="delete-driver">
            <Tooltip
              title={
                restData.UsedInInvoice !== ""
                  ? "Cannot delete (invoice exists)"
                  : "Delete"
              }
            >
              <button
                onClick={() => showDeleteConfirm(BookingNo)}
                disabled={restData.UsedInInvoice !== ""}
                className={`px-2 pb-2 rounded-md transition duration-300 ${restData.UsedInInvoice !== ""
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                style={{ fontSize: "15px" }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </UserPrivateComponent>

          <button
            disabled={restData.UsedInInvoice !== ""}
            onClick={() => showModal({ BookingNo, ...restData })}
            className="p-1 font-bold text-white transition duration-300 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ width: "100px" }}
          >
            Allotment
          </button>
        </div>
      ),
    },
  ];

  // Removed client-side filtering logic as it's now handled server-side
  const filteredData = list2;
  console.log("data", filteredData);

  // Note: Party dropdown currently only shows parties from the fetched page. 
  // To properly filter by Party server-side, we should fetch the full list of parties.
  // For now, I'll keep the existing logic but it might be limited.
  // Actually, I should probably remove the client-side derivation of partyNames if I want true server-side filtering.
  // But without a separate API call for parties, I can't populate the dropdown with *all* parties.
  // I will leave the Party Select as is for now, but it will only filter *client-side* if I don't pass it to backend?
  // No, the user wants server-side.
  // I will add a Search Input.




  return (
    <>
      <div className="mt-2 card card-custom">
        <div className="card-body">
          <Card
            className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            <div className="items-center justify-between pb-3 md:flex">
              <h1 className="text-lg font-bold">Booking list</h1>
              <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
                <div className="flex xxs:w-1/2 md:w-full xxs:flex-col md:flex-row xxs:gap-1 md:gap-5">
                  <UserPrivateComponent permission={"create-bookingEntry"}>
                    <Link to={`/admin/add-bookingEntry/${maxId + 1 || 1}`}>
                      <SimpleButton title={"Add Entry"} />
                    </Link>
                  </UserPrivateComponent>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4 ml-16 md:flex-row">
              <div className="flex gap-2">
                <Select
                  allowClear
                  showSearch
                  placeholder="Filter by Party"
                  onChange={(value) => setPartyFilter(value)}
                  style={{ width: 200 }}
                  value={partyFilter}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {partyList?.map((party) => (
                    <Select.Option key={party.id} value={party.id}>
                      {party.partyName}
                    </Select.Option>
                  ))}
                </Select>
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-2 border rounded"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
                <DatePicker
                  allowClear
                  placeholder="Filter by Date"
                  onChange={(date) => setDateFilter(date)}
                  style={{ width: 200 }}
                  value={dateFilter}
                  format="DD-MM-YYYY"
                />
              </div>
            </div>

            <Table
              dataSource={filteredData}
              columns={columns}
              loading={loading2}
              pagination={{
                current: currentPage,
                pageSize: itemsPerPage,
                total: totalItems,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setItemsPerPage(pageSize);
                },
              }}
              scroll={{ x: 1700 }}
              rowKey="BookingNo"
              rowClassName={(record) => {
                if (record?.UsedInInvoice != 0) return "row-green";
                if (record?.AllotBusQty === 0) return "row-red";
                if (record?.AllotBusQty !== record?.BusQty) return "row-orange";
                return "";
              }}
              expandedRowKeys={expandedRowKeys}
              onExpand={handleExpand}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="expanded-content">
                    <DetailBookingEntry bookingNo={record?.BookingNo} />
                  </div>
                ),
                rowExpandable: (record) => !!record?.BookingNo,
              }}
            />
          </Card>
        </div>
      </div>
      <Modal
        width={900}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <button
            key="cancel"
            onClick={handleCancel}
            className="px-4 py-1 mr-2 text-white bg-gray-600 rounded"
          >
            Cancel
          </button>,
        ]}
      >
        <AllotBus ID={selectedBooking} onSuccess={() => fetchData(currentPage, itemsPerPage)} />
      </Modal>
    </>
  );
};

export default GetAllBookingEntry;
