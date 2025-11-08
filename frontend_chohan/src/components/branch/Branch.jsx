import { Navigate } from "react-router-dom";
import GetAllBranch from "./GetAllBranch";

const Branch = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllBranch />
    </>
  );
};

export default Branch;
