import { useState, useEffect } from "react";
import { useGlobalContext } from "../components/context";
import Login from "../components/auth/Login";
import FirstLoading from "../components/FirstLoading";
import Instruction from "../instruction/Instruction";
// import LoginInstruction from "../instruction/LoginInstruction";

const Layout = (props) => {
  const { currentUser } = useGlobalContext();
  const [firstLoading, setFirstLoading] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);

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
        <>
          {!currentUser ? (
            <>
              {/* <LoginInstruction /> */}
              <Login />
            </>
          ) : (
            <>
              {!showInstruction && (
                <button
                  className="showInstructionBtn"
                  onClick={() => setShowInstruction(true)}
                >
                  Instrukcja
                </button>
              )}
              {showInstruction && (
                <Instruction setShowInstruction={setShowInstruction} />
              )}
              <main>{props.children}</main>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Layout;
