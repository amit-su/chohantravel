import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { Card, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import CreateDrawer from "../../CommonUi/CreateDrawer";
import TableNoPagination from "../../CommonUi/TableNoPagination";
import AddPartyBusListDrawer from "./addPartyBusListDrawer";
import UpdatePartyBusListDrawer from "./updatePartyBusListDrawer";
import { toast } from "react-toastify";
import axios from "axios";
const CreateProformaInvoice = ({
  isIncludeGST,
  onBookingClose,
  list,
  loading,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [bookingArray, setBookingArray] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    setBookingArray(list || []);
  }, [list]);

  const onDelete = async (index) => {
    try {
      let itemToDelete;

      setBookingArray((prevList) => {
        itemToDelete = prevList[index];
        return prevList;
      });

      console.log("sl no ", itemToDelete);

      // Check if SLNO is valid
      if (itemToDelete?.SLNO !== 0) {
        Modal.confirm({
          title: "Are you sure you want to delete this Bus?",

          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          async onOk() {
            const response = await axios.delete(
              `${apiUrl}/proformaInvoice/proformatran/${itemToDelete.SLNO}`
            );

            if (response.data.status === 1) {
              // Only update UI if delete was successful
              setBookingArray((prevList) =>
                prevList.filter((_, i) => i !== index)
              );
              toast.success("Delete successful");
            } else {
              toast.error("Delete failed");
            }
          },
        });
      } else {
        // SLNO is 0, so just remove it from UI
        setBookingArray((prevList) => prevList.filter((_, i) => i !== index));
        toast.success("Deleted from UI only");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Error deleting booking");
    }
  };

  const handleAddItem = (values) => {
    setOpen(false);
    setChildrenDrawer(false);
    // Assign a temporary unique ID for new items if SLNO is not present
    const newId = values.SLNO || Date.now();
    const newItem = { ...values, SLNO: newId, key: newId };
    setBookingArray((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (index, values) => {
    setOpen(false);
    setChildrenDrawer(false);
    setBookingArray((prev) => {
      const newArray = [...prev];
      if (index >= 0 && index < newArray.length) {
        // Ensure the key is preserved during an update
        const originalItem = newArray[index];
        newArray[index] = {
          ...originalItem,
          ...values,
          key: originalItem.key || originalItem.SLNO,
        };
      }
      return newArray;
    });
  };

  useEffect(() => {
    if (!open) {
      setChildrenDrawer(false);
    }
  }, [open]);

  useEffect(() => {
    onBookingClose(bookingArray);
  }, [bookingArray, onBookingClose]);

  const columns = [
    {
      id: 2,
      title: "Bus Type",
      dataIndex: "busCategory",
      key: "busCategory",
    },
    {
      id: 3,
      title: "Sitting Capacity",
      dataIndex: "sittingCapacity",
      key: "sittingCapacity",
    },
    {
      id: 4,
      title: "Trip Description",
      dataIndex: "tripDescription",
      key: "tripDescription",
    },
    {
      id: 5,
      title: "Trip Start Date",
      dataIndex: "ReportDate",
      key: "ReportDate",
    },
    {
      id: 6,
      title: "Trip End Date",
      dataIndex: "tripEndDate",
      key: "tripEndDate",
    },
    {
      id: 7,
      title: "Report Time",
      dataIndex: "reportTime",
      key: "reportTime",
    },
    {
      id: 8,
      title: "No of Bus",
      dataIndex: "busQty",
      key: "busQty",
    },
    {
      id: 9,
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      id: 10,
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      id: 11,
      title: "Action",
      key: "action",
      render: (text, record, index) => {
        const { SLNO, ...restData } = record;
        return (
          <div className="flex items-center gap-2">
            <CreateDrawer
              update={1}
              permission={"update-driver"}
              title={"Edit Bus"}
              open={open}
              minimalEdit
            >
              <UpdatePartyBusListDrawer
                data={{ ...restData, SLNO }}
                onClose={(values) => handleUpdateItem(index, values)}
              />
            </CreateDrawer>

            <DeleteOutlined
              onClick={() => onDelete(index)}
              className="p-2 text-white bg-red-600 rounded-md cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Party Bus List</h1>
        <div className="flex items-center gap-3">
          <CreateDrawer
            permission={"create-bus"}
            title={"Add Bus"}
            width={35}
            open={open}
          >
            <AddPartyBusListDrawer onClose={handleAddItem} />
          </CreateDrawer>
        </div>
      </div>

      <UserPrivateComponent permission={"readAll-setup"}>
        <TableNoPagination
          columns={columns}
          list={bookingArray}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default CreateProformaInvoice;
