import { Navigate } from "react-router-dom";
import GetAllBus from "./getAllBus";

const Bus = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllBus />
    </>
  );
};

export default Bus;
