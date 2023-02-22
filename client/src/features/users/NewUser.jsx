import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { useAddNewUserMutation } from "./usersApiSlice";
import { ROLES, Roles } from "../../config/roles";
import useTitle from "../../hooks/useTitle";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#%]{4,19}$/;

const NewUser = () => {
  useTitle("Add new user");
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dashboard/users");
    }
  }, [isSuccess, navigate]);

  const onUsernameChange = (e) => setUsername(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);
  const onRolesChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
    console.log(values);
  };

  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUser = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveUser}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-button">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <AiFillSave style={{ color: "white" }} />
            </button>
          </div>
        </div>
        <label htmlFor="username" className="form__label">
          Username: <span className="nowrap">[3 to 20 letters]</span>
        </label>
        <input
          type="text"
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          autoComplete="off"
          value={username}
          onChange={onUsernameChange}
        />
        <label htmlFor="password" className="form__label">
          Password: <span className="nowrap">[4-19 chars incl. !@#$%]</span>
        </label>
        <input
          type="password"
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          autoComplete="off"
          value={password}
          onChange={onPasswordChange}
        />
        <label htmlFor="roles" className="form__label">
          Roles: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <select
          className={`form__input ${validRolesClass}`}
          id="roles"
          name="roles"
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChange}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewUser;
