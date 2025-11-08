import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateDrawer from "../../CommonUi/CreateDrawer";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Button, Select, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../CommonUi/TableComponent";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import { loadAllBooking } from "../../../redux/rtk/features/booking/bookingSlice";
import SimpleButton from "../../Buttons/SimpleButton";
import {
  deleteproformaInvoice,
  loadAllproformaInvoice,
} from "../../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";
import Performainvoicedrawer from "./performainvoiceprintdrawer";
import { loadAllCompany } from "../../../redux/rtk/features/company/comapnySlice";
// import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const GetAllProformaInvoice = () => {
  const onClose = () => {};
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  const handleLinkClick = (invoiceNo) => {
    navigate(`/admin/update-proformaInvoice/${invoiceNo}`);
    window.location.reload();
  };

  const [maxId, setMaxId] = useState(0);
  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const res = await dispatch(deleteproformaInvoice(id));
      if (res) {
        dispatch(
          loadAllproformaInvoice({ status: true, page: 1, count: 1000 })
        );
      }
    } else {
      console.log("Delete action canceled by user.");
    }
  };

  const handleNavigation = (invoiceNo, companyId) => {
    navigate(`/admin/performainvoiceprint/${companyId}/${invoiceNo}`);
  };

  const apiUrl = import.meta.env.VITE_APP_API;

  const dispatch = useDispatch();
  const { list, total, loading } = useSelector(
    (state) => state.proformaInvoices
  );
  const [isTransferVisible, setIsTransferVisible] = useState(true);

  const onTransfer = (invoiceNo, restData) => {
    console.log(restData, "restdata");

    if (
      window.confirm("Are you sure you want to transfer this invoice?") &&
      restData.status != "transfered"
    ) {
      axios
        .post(`${apiUrl}/invoicetransfer`, {
          invoiceNo,
        })
        .then((response) => {
          console.log("Transfer successful:", response.data);
          toast.success("Transfer successful!");
        })
        .catch((error) => {
          console.error("Transfer failed:", error);
        });
    } else {
      toast.error("dublicate!");

      console.log("Transfer canceled by user or Du");
    }
  };
  const onPrint = () => {
    console.log("print");
  };

  const { list: companyList } = useSelector((state) => state.companies);

  console.log("list", list);
  const columns = [
    {
      id: 1,
      title: "Proforma Invoice No.",
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
      title: "Proforma Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      render: (date) => moment(date).format("DD-MM-YYYY"),
      width: 110,
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
      id: 4,
      title: "No of Bus Required",
      dataIndex: "busQtyRequired",
      key: "busQtyRequired",
      align: "right",
      width: 90,
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
    {
      id: 7,
      title: "Advance Received",
      dataIndex: "advanceReceived",
      key: "advanceReceived",
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
      width: 300,
      render: ({ invoiceNo, ID, COMPANY_ID, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-proformaInvoice">
            <Link onClick={() => handleLinkClick(ID)}>
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
          <div>
            {isTransferVisible && (
              <Button
                type="primary"
                className="flex text-center text-white bg-green-600 rounded-md"
                style={{ width: "80px" }}
                loading={loading}
                onClick={() => onTransfer(invoiceNo, restData)} // Pass the invoiceNo to the onTransfer function
              >
                Transfer
              </Button>
            )}
          </div>
          <div>
            <button
              className="px-4 py-2 font-bold text-white transition duration-300 bg-green-600 rounded hover:bg-green-700"
              style={{ width: "120px" }}
              onClick={() =>
                window.open(
                  `/admin/performainvoiceprint/${COMPANY_ID}/${invoiceNo}`,
                  "_blank"
                )
              }
            >
              Print Page
            </button>
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(loadAllproformaInvoice({ status: true, page: 1, count: 1000 }));
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    // Find the maximum ID from the list
    const ids = list?.map((item) => parseInt(item.ID));
    const maxId = ids?.length === 0 ? 0 : ids && Math.max(...ids);
    setMaxId(maxId);
  }, [list]);

  const filteredList = list?.filter((item) => {
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
              <h1 className="text-lg font-bold">Proforma Invoice</h1>
              <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
                <div className="flex xxs:w-1/2 md:w-full xxs:flex-col md:flex-row xxs:gap-1 md:gap-5">
                  <UserPrivateComponent permission={"create-proformaInvoice"}>
                    <Link to={`/admin/add-proformaInvoice/${maxId + 1}`}>
                      <SimpleButton title={"Add Proforma Invoice"} />
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

export default GetAllProformaInvoice;
