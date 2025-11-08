import { Navigate } from "react-router-dom";
import GetAllSetup from "./getAllSetup";

const Setup = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllSetup />
    </>
  );
};

export default Setup;
