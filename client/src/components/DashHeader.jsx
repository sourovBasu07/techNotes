import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { FiLogOut } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import {
  AiOutlineUserAdd,
  AiOutlineSetting,
  AiOutlinePoweroff,
} from "react-icons/ai";
import { MdOutlineNoteAdd } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";
import PulseLoader from "react-spinners/PulseLoader";

const DASH_REGEX = /^\/dashboard(\/)?$/;
const NOTES_REGEX = /^\/dashboard\/notes(\/)?$/;
const USERS_REGEX = /^\/dashboard\/users(\/)?$/;

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  const onAddNewNote = () => navigate("/dashboard/notes/new");
  const onAddNewUser = () => navigate("/dashboard/users/new");
  const onUsersClicked = () => navigate("/dashboard/users");
  const onNotesClicked = () => navigate("/dashboard/notes");

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button className="icon-button" title="New note" onClick={onAddNewNote}>
        <MdOutlineNoteAdd />
      </button>
    );
  }

  let newUserButton;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button className="icon-button" title="New user" onClick={onAddNewUser}>
        <AiOutlineUserAdd />
      </button>
    );
  }

  let usersButton;
  if (
    (isManager || isAdmin) &&
    !USERS_REGEX.test(pathname) &&
    pathname.includes("/dashboard")
  ) {
    usersButton = (
      <button
        className="icon-button"
        title="Users Settings"
        onClick={onUsersClicked}
      >
        <AiOutlineSetting />
      </button>
    );
  }

  let notesButton;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dashboard")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <BiNotepad />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <AiOutlinePoweroff />
    </button>
  );

  let buttonContent;
  if (isLoading) {
    buttonContent = <PulseLoader color={"#FFF"} />;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {usersButton}
        {notesButton}
        {logoutButton}
      </>
    );
  }

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dashboard">
            <h1 className="dash-header__title">techNotes</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  );

  return content;
};

export default DashHeader;
