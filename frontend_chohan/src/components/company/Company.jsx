import { Navigate } from "react-router-dom";
import GetAllCompany from "./GetAllCompany";

const Company = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllCompany />
    </>
  );
};

export default Company;
