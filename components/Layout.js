import { useState, useEffect } from "react";
import { useGlobalContext } from "../components/context";
import Login from "../components/auth/Login";
import FirstLoading from "../components/FirstLoading";
import Instruction from "../instruction.js/Instruction";

const Layout = (props) => {
  const { currentUser } = useGlobalContext();
  const [firstLoading, setFirstLoading] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);

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
          {!showInstruction && (
            <button
              className="showInstructionBtn"
              onClick={() => setShowInstruction(true)}
            >
              Instrukcja
            </button>
          )}

          {!currentUser ? (
            <Login />
          ) : (
            <>
              {" "}
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
