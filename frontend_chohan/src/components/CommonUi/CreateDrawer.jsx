import {
  CheckCircleOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Drawer } from "antd";
import { useState, useEffect } from "react";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { Link } from "react-router-dom";
import { MdAssignmentTurnedIn } from "react-icons/md";

export default function CreateDrawer({
  title,
  width,
  permission,
  children,
  update,
  color,
  minimalEdit,
  Allot,
  id,
  extOpen,
}) {
  // Drawer state
  const [open, setOpen] = useState(false);
  console.log("create drawer");

  useEffect(() => {
    console.log("extOpen prop:", extOpen);
    if (extOpen != undefined) {
      setOpen(extOpen);
    }
  }, [extOpen]);
  const onClose = () => {
    setOpen(false);
  };

  if (minimalEdit) {
    return (
      <UserPrivateComponent permission={permission}>
        <EditOutlined
          onClick={() => setOpen(true)}
          className="bg-gray-600 p-2 text-white rounded-md"
          style={{ fontSize: "15px", cursor: "pointer" }}
        />
        <Drawer
          width={
            window.innerWidth <= 768 ? "100%" : width ? `${width}%` : "35%"
          }
          title={`${title}`}
          placement="right"
          onClose={onClose}
          open={open}
        >
          <div className="px-5 pt-5"> {children}</div>
        </Drawer>
      </UserPrivateComponent>
    );
  }
  if (Allot) {
    return (
      <UserPrivateComponent permission={permission}>
        <Link to={`/admin/booking-busAllotment/${encodeURIComponent(id)}`}>
          <MdAssignmentTurnedIn
            className="bg-green-600 p-2 text-white rounded-md"
            style={{ fontSize: "35px", cursor: "pointer" }}
          />
        </Link>
      </UserPrivateComponent>
    );
  }
  return (
    <UserPrivateComponent permission={permission}>
      <button
        onClick={() => setOpen(true)}
        className={`xs:px-1 px-1 text-sm md:text-base py-2 lg:px-5  border ${
          color ? color : `bg-violet-700`
        } hover:bg-gray-500 text-white rounded cursor-pointer`}
      >
        <div className="flex items-center justify-center gap-1">
          {update ? <EditOutlined /> : <PlusOutlined />}
          <div className="min-w-[50px]">{title}</div>
        </div>
      </button>
      <Drawer
        width={window.innerWidth <= 768 ? "60%" : width ? `${width}%` : "35%"}
        title={`${title}`}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div className="px-5 pt-5"> {children}</div>
      </Drawer>
    </UserPrivateComponent>
  );
}
