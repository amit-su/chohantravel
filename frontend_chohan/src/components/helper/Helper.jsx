import React from "react";
import { Navigate } from "react-router-dom";
import GetAllHelper from "./GetAllHelper";

const Helper = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllHelper />
    </>
  );
};

export default Helper;
