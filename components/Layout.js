import { useState, useEffect } from "react";
import { useGlobalContext } from "../components/context";
import FirstLoading from "../components/FirstLoading";
import Login from "../pages/login";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

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
              <main>
                <Toaster
                  position="bottom-center"
                  containerStyle={{
                    top: 20,
                    left: 20,
                    bottom: 80,
                    right: 20,
                  }}
                />
                {props.children}
              </main>
              {router.pathname !== "/login" && currentUser && <Footer />}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Layout;
