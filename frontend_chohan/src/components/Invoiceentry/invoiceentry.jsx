import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateDrawer from "../CommonUi/CreateDrawer";
import axios from "axios";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Button, Select, DatePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { loadAllBooking } from "../../redux/rtk/features/booking/bookingSlice";
import SimpleButton from "../Buttons/SimpleButton";
import {
  deleteproformaInvoice,
  loadAllproformaInvoice,
} from "../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";
import Performainvoicedrawer from "../entry/proformaInvoice/performainvoiceprintdrawer";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import dayjs from "dayjs";

let invoiceentrydata = [];
const Invoiceentry = () => {
  const onClose = () => {};
  //----------------API CALL HELPER-------------------//
  let [list2, setList] = useState([]);
  const [dailylist, setDailyList] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const { list: companyList } = useSelector((state) => state.companies);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/invoiceentry`);
        setList(response.data.data);
        invoiceentrydata = response.data.data;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []);

  //-------------END---------------------------//

  const navigate = useNavigate();

  const handleLinkClick = (invoiceNo) => {
    navigate(`/admin/update-Invoice/${invoiceNo}`);
    window.location.reload();
  };

  const [maxId, setMaxId] = useState(0);
  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(`${apiUrl}/invoiceentry/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          window.location.reload();

          // Assuming you have a function to reload or refresh the invoices
          // loadAllProformaInvoice({ status: true, page: 1, count: 1000 });
        } else {
          console.error("Failed to delete the invoice.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Delete action canceled by user.");
    }
  };

  const apiUrl = import.meta.env.VITE_APP_API;

  const dispatch = useDispatch();
  const { list, total, loading } = useSelector(
    (state) => state.proformaInvoices
  );
  const [isTransferVisible, setIsTransferVisible] = useState(true);

  const onTransfer = (invoiceNo, restData) => {
    //   if (window.confirm("Are you sure you want to transfer this invoice?") && restData.status!="transfered") {
    //     axios.post(`${apiUrl}/invoicetransfer`, {
    //         invoiceNo
    //     })
    //     .then(response => {
    //         console.log('Transfer successful:', response.data);
    //         toast.success('Transfer successful!');
    //     })
    //     .catch(error => {
    //         console.error('Transfer failed:', error);
    //     });
    // } else {
    //   toast.error('dublicate!');
    //     console.log('Transfer canceled by user or Du');
    // }
  };
  const onPrint = () => {
    console.log("print");
  };

  const columns = [
    {
      id: 1,
      title: "Invoice No.",
      dataIndex: "RefInvoiceNo",
      key: "RefInvoiceNo",
      // render: (id) => (
      //   <Link to={`/admin/Detailproforma-invoice/${encodeURIComponent(id)}`}>
      //     {id}
      //   </Link>
      // ),
      width: 100,
    },
    {
      id: 2,
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      // render: (createdAt) => {
      //   const parsedDate = moment(createdAt, 'YYYY-MM-DD');
      //   return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : 'Invalid date';
      // },
      width: 110,
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      id: 8,
      title: "Party",
      dataIndex: "partyName",
      key: "partyName",
      width: 200,
    },
    {
      id: 3,
      title: "Contact Person Name",
      dataIndex: `contactPersonName`,
      key: "contactPersonName",
      width: 170,
    },
    {
      id: 3,
      title: "Contact Person No",
      dataIndex: `contactPersonNo`,
      key: "contactPersonNo",
      width: 170,
    },

    {
      id: 6,
      title: "Gross Amount ",
      dataIndex: "grossAmount",
      key: "grossAmount",
      align: "right",
      width: 140,
    },
    {
      id: 5,
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      width: 110,
    },

    //Update Supplier Name here

    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 150,
      render: ({ invoiceNo, COMPANY_ID, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-proformaInvoice">
            <Link onClick={() => handleLinkClick(invoiceNo)}>
              <EditOutlined
                className="p-2 text-white bg-gray-600 rounded-md"
                style={{ fontSize: "15px", cursor: "pointer" }}
              />
            </Link>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-proformaInvoice"}>
            <DeleteOutlined
              onClick={() => onDelete(invoiceNo)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
          <button
            className="px-4 py-2 font-bold text-white transition duration-300 bg-green-600 rounded hover:bg-green-700"
            style={{ width: "120px" }}
            onClick={() =>
              window.open(`/admin/invoiceprint/${2}/${invoiceNo}`, "_blank")
            }
          >
            Print Page
          </button>
          {/* <div>
        {isTransferVisible && (
          <Button
            type="primary"
            className="flex text-center text-white bg-green-600 rounded-md"
            style={{ width: "80px" }}
            loading={loading}
            onClick={() => onTransfer(invoiceNo,restData)} // Pass the invoiceNo to the onTransfer function
          >
            Transfer
          </Button>
        )}
      </div> */}
          <div></div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    // Find the maximum ID from the list
    const ids = list2?.map((item) => parseInt(item.ID));
    const maxId = ids?.length === 0 ? 0 : ids && Math.max(...ids);
    setMaxId(maxId);
  }, [list2]);

  const filteredList = list2?.filter((item) => {
    const matchesCompany = selectedCompany
      ? item.COMPANY_ID == selectedCompany
      : true;

    const matchesDate = dateFilter
      ? dayjs(item.invoiceDate)
          .startOf("day")
          .isSame(dayjs(dateFilter).startOf("day"))
      : true;

    return matchesCompany && matchesDate;
  });

  return (
    <>
      <div className="mt-2 card card-custom">
        <div className="card-body">
          <Card
            className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            <div className="items-center justify-between pb-3 md:flex">
              <h1 className="text-lg font-bold">Invoice</h1>
              <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
                <div className="flex xxs:w-1/2 md:w-full xxs:flex-col md:flex-row xxs:gap-1 md:gap-5">
                  <UserPrivateComponent permission={"create-proformaInvoice"}>
                    <Link to={`/admin/add-Invoice/${maxId + 1}`}>
                      <SimpleButton title={"Add Invoice"} />
                    </Link>
                  </UserPrivateComponent>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-end">
              {/* Company Select */}
              <div className="w-full md:w-1/3">
                <Select
                  labelInValue
                  allowClear
                  value={
                    selectedCompany
                      ? {
                          value: selectedCompany,
                          label: companyList.find(
                            (c) => c.Id === selectedCompany
                          )?.Name,
                        }
                      : undefined
                  }
                  onChange={(option) => {
                    setSelectedCompany(option ? option.value : null);
                  }}
                  placeholder="Filter by Company"
                  optionFilterProp="children"
                  showSearch
                  style={{ width: "100%" }}
                >
                  {companyList?.map((company) => (
                    <Select.Option key={company.Id} value={company.Id}>
                      {company.Name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Date Filter */}
              <div className="w-full md:w-1/4">
                <DatePicker
                  allowClear
                  placeholder="Filter by Date"
                  onChange={(date) => setDateFilter(date)}
                  style={{ width: "100%" }}
                  value={dateFilter}
                  format="DD-MM-YYYY"
                />
              </div>
            </div>
            <UserPrivateComponent permission={"readAll-proformaInvoice"}>
              <TableComponent
                list={filteredList}
                columns={columns}
                loading={loading}
                total={total}
                paginatedThunk={loadAllBooking}
                scrollX={1700}
                csvFileName={"Booking List"}
              />
            </UserPrivateComponent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Invoiceentry;
