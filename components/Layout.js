import { useState, useEffect } from "react";
import { useGlobalContext } from "../components/context";
import Login from "../components/auth/Login";
import FirstLoading from "../components/FirstLoading";

const Layout = (props) => {
  const { currentUser } = useGlobalContext();
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFirstLoading(false);
    }, 5000);
  }, []);

  return (
    <>
      {firstLoading ? (
        <FirstLoading />
      ) : (
        <>{!currentUser ? <Login /> : <main>{props.children}</main>}</>
      )}
    </>
  );
};

export default Layout;
