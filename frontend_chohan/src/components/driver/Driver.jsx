import React from "react";
import { Navigate } from "react-router-dom";
import GetAllDriver from "./GetAllDriver";

const Driver = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllDriver />
    </>
  );
};

export default Driver;
