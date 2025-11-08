import React from "react";
import { Navigate } from "react-router-dom";
import GetAllStaff from "./getAllstaff";

const Staff = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllStaff />
    </>
  );
};

export default Staff;
