import { useState, useEffect } from "react";
import { useGlobalContext } from "../components/context";
import FirstLoading from "../components/FirstLoading";
import Login from "../pages/login";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useRouter } from "next/router";

const Layout = (props) => {
  const { currentUser } = useGlobalContext();
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFirstLoading(false);
    }, 5000);
  }, []);

  const router = useRouter();

  return (
    <>
      {firstLoading ? (
        <FirstLoading />
      ) : (
        <>
          {!currentUser ? (
            <Login />
          ) : (
            <>
              {router.pathname !== "/login" && currentUser && <Navbar />}
              <main>{props.children}</main>
              {router.pathname !== "/login" && currentUser && <Footer />}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Layout;
