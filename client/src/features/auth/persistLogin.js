import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import PulseLoader from "react-spinners/PulseLoader";

const PersistLogin = () => {
  const [persist] = usePersist();
  const effectRan = useRef(false);
  const token = useSelector(selectCurrentToken);
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("Verifying refresh token");
        try {
          const response = await refresh();
          const { accessToken } = response.data;
          console.log(accessToken);
          setTrueSuccess(true);
        } catch (error) {
          console.log(error);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;

  if (!persist) {
    console.log("No persist");
    content = <Outlet />;
  } else if (isLoading) {
    console.log("Loading");
    content = <PulseLoader color={"#FFF"} />;
  } else if (isError) {
    console.log("Error");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} `}
        <Link to="/login">Please login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("Success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("Token and Uninitialized");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
