import { Navigate } from "react-router-dom";
import GetAllFuel from "./getAllFuel";

const Fuel = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllFuel />
    </>
  );
};

export default Fuel;
