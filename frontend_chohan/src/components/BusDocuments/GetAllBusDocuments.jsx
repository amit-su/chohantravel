import { Card, Form, Select, Modal, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { deleteBus, loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import AddBusdocs from "./Addbusdocuments";
import Updatebusdocuments from "./Updatebusdocuments";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let id = null;
const documentTypes = [
  "PERMIT",
  "POLIUTION",
  "C.F",
  "ROAD TAX",
  "INSURANCE",
  "R.C/SMART",
];

const GetBusDocumentsDetails = () => {
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_APP_API;
  const { list: busList } = useSelector((state) => state.buses);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBus, setSelectedBus] = useState(null);
  const [list, setList] = useState([]);
  const [pendingVisible, setPendingVisible] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  const onBusChange = async (busId) => {
    setSelectedBus(busId);
    id = busId;
    try {
      const response = await axios.get(`${apiUrl}/busdocuments/${busId}`);
      setList(response.data.data);
    } catch (error) {
      console.error("Error fetching bus document data:", error);
    }
  };

  const showPendingDocs = async () => {
    try {
      const response = await axios.get(`${apiUrl}/busdocuments/`);
      if (response.data.status === 1) {
        const formatted = response.data.data.map((bus) => ({
          ...bus,
          documents: JSON.parse(bus.documents),
        }));
        setPendingList(formatted);
        setPendingVisible(true);
      }
    } catch (error) {
      toast.error("Failed to load pending documents");
    }
  };

  const transformData = (rawList) => {
    return rawList.map((bus) => {
      const row = { busNo: bus.busNo };
      documentTypes.forEach((type) => {
        const doc = bus.documents.find(
          (d) => d.doctype?.toUpperCase() === type
        );
        row[type] = !!(doc && doc.DocumentPath);
      });
      return row;
    });
  };

  const onDelete = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/busdocuments/${id}`);
      if (response.status === 200) {
        toast.success("Deleted details successfully!");
        onBusChange(selectedBus);
      }
    } catch (error) {
      console.error("Error deleting the item:", error);
    }
  };

  const columns = [
    {
      title: "Documents Name",
      dataIndex: "doctype",
      key: "doctype",
      width: 120,
    },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDate",
      key: "ExpiryDate",
      width: 120,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Intimate Days",
      dataIndex: "IntimateDays",
      key: "IntimateDays",
      width: 120,
    },
    {
      title: "Next Due Date",
      dataIndex: "NextDueDate",
      key: "NextDueDate",
      width: 120,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 160,
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-party">
            <CreateDrawer
              update={1}
              permission={"update-party"}
              title={"Edit Bus Documents Details"}
              minimalEdit
              width={60}
            >
              <Updatebusdocuments
                data={restData}
                id={id}
                onBusChange={onBusChange}
              />
            </CreateDrawer>
          </UserPrivateComponent>

          <UserPrivateComponent permission="delete-party">
            <DeleteOutlined
              onClick={() => onDelete(restData.ID)}
              className="p-2 text-white bg-red-600 rounded-md cursor-pointer"
            />
          </UserPrivateComponent>

          <UserPrivateComponent permission="delete-party">
            <Button
              disabled={restData.DocumentPath === null}
              onClick={() =>
                window.open(apiUrl + "/busdocuments/file/" + restData.ID)
              }
              className="bg-blue-600 border-none hover:bg-blue-700"
              icon={<EyeOutlined />}
              size="small"
            >
              View
            </Button>
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <div className="flex items-center">
          <Form.Item
            style={{ marginBottom: "10px", width: "500px" }}
            label="Bus No:"
            name="AllotedBusNo"
          >
            <Select
              showSearch
              placeholder="Select Bus No"
              optionFilterProp="children"
              onChange={onBusChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {busList?.map((bus) => (
                <Select.Option key={bus.id} value={bus.id}>
                  {bus.busNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Button
          onClick={showPendingDocs}
          className="text-white bg-orange-500 border-none"
        >
          View Pending Documents
        </Button>

        <div className="flex items-center gap-3">
          <CreateDrawer
            permission={"create-bus"}
            title={"Add Bus Documents"}
            width={45}
          >
            <AddBusdocs id={id} onBusChange={onBusChange} />
          </CreateDrawer>
        </div>
      </div>

      <UserPrivateComponent permission={"readAll-bus"}>
        <TableComponent
          columns={columns}
          csvFileName={"bus"}
          paginatedThunk={loadAllBus}
          list={list}
          scrollX={1000}
        />
      </UserPrivateComponent>

      {/* Modal to show pending documents in table */}
      <Modal
        open={pendingVisible}
        onCancel={() => setPendingVisible(false)}
        footer={null}
        title="Pending Bus Documents"
        width={900}
      >
        <Input
          placeholder="Search by Bus No"
          allowClear
          className="w-1/3 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="max-h-[400px] overflow-auto border rounded">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 bg-gray-100">
                <th className="p-2 bg-gray-100 border">Bus No</th>
                {documentTypes.map((docType) => (
                  <th key={docType} className="p-2 bg-gray-100 border">
                    {docType}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transformData(pendingList)
                .filter((bus) =>
                  bus.busNo.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((bus, index) => (
                  <tr key={index}>
                    <td className="p-2 font-bold border">{bus.busNo}</td>
                    {documentTypes.map((docType) => (
                      <td key={docType} className="p-2 text-center border">
                        {bus[docType] ? (
                          <span className="font-bold text-green-600">✔️</span>
                        ) : (
                          <span className="font-bold text-red-600">❌</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm font-bold text-gray-700">
          Total Buses:{" "}
          {
            transformData(pendingList).filter((bus) =>
              bus.busNo.toLowerCase().includes(searchTerm.toLowerCase())
            ).length
          }
        </div>
      </Modal>
    </Card>
  );
};

export default GetBusDocumentsDetails;
