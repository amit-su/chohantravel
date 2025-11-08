import { Navigate } from "react-router-dom";
import GetAllBusCategory from "./getAllBusCategory";

const BusCategory = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllBusCategory />
    </>
  );
};

export default BusCategory;
