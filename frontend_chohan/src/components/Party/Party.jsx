import React from "react";
import { Navigate } from "react-router-dom";
import GetAllParty from "./GetAllParty";

const Party = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllParty />
    </>
  );
};

export default Party;
