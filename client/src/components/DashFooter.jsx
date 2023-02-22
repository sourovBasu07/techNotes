import { useNavigate, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
  const { username, status } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dashboard");
  let goHomeButton = null;
  if (pathname !== "/dashboard") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <AiFillHome />
      </button>
    );
  }
  const content = (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
  return content;
};

export default DashFooter;
