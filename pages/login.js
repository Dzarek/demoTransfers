import styled from "styled-components";
import { useState } from "react";
import { useGlobalContext } from "../components/context";
import LoginInstruction from "../instruction/LoginInstruction";

const loginBg = "/images/loginBg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPasswordSend, setNewPasswordSend] = useState(false);

  const { login, changePasswordWhenLogin } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorLogin("Proszę uzupełnić pola logowania!");
      return;
    }
    try {
      await login(email, password);
      setErrorLogin("");
    } catch (err) {
      setErrorLogin("Nieprawidłowy email lub hasło!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorLogin("Proszę podać adres email!");
      return;
    }
    try {
      await changePasswordWhenLogin(email);
      setErrorLogin("");
      setNewPasswordSend(true);
      setEmail("");
    } catch (error) {
      setErrorLogin("Nieprawidłowy email!");
      setNewPasswordSend(false);
    }
  };

  const handleChangeStart = () => {
    setForgotPassword(true);
    setNewPasswordSend(false);
  };

  return (
    <WrapperBG>
      <LoginInstruction setEmail={setEmail} setPassword={setPassword} />
      <Wrapper>
        {forgotPassword ? (
          <div className="container">
            <h2>Resetowanie hasła</h2>
            {newPasswordSend ? (
              <>
                <h4 className="errorInfo">
                  Link do resetowania hasła został przesłany. Sprawdź swoją
                  skrzynkę email.
                </h4>
                <button
                  type="button"
                  className="forgotPasswordLinkBtn"
                  onClick={() => setForgotPassword(false)}
                >
                  Panel Logowania
                </button>
              </>
            ) : (
              <>
                {errorLogin ? (
                  <h4 className="errorInfo">{errorLogin}</h4>
                ) : (
                  <h4 className="errorInfo">
                    Podaj adres email na który zostanie przesłany link do
                    resetowania hasła.
                  </h4>
                )}
                <section>
                  <img src="/images/loginImg2.png" alt="" />
                  <form onSubmit={(e) => handleResetPassword(e)}>
                    <input
                      type="email"
                      placeholder="Adres Email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                    <p
                      className="forgotPasswordLink"
                      onClick={() => setForgotPassword(false)}
                    >
                      Panel Logowania
                    </p>
                    <button type="submit">wyślij nowe</button>
                  </form>
                </section>
              </>
            )}
          </div>
        ) : (
          <div className="container">
            <h2>Logowanie</h2>
            {errorLogin && <h4 className="errorInfo">{errorLogin}</h4>}
            <section>
              <img src="/images/loginImg.png" alt="" />
              <form onSubmit={(e) => handleSubmit(e)}>
                <input
                  type="email"
                  placeholder="Adres Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <input
                  type="password"
                  placeholder="Hasło"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <p className="forgotPasswordLink" onClick={handleChangeStart}>
                  Nie pamiętam hasła...
                </p>
                <button type="submit">zaloguj się</button>
              </form>
            </section>
          </div>
        )}
      </Wrapper>
    </WrapperBG>
  );
};

const WrapperBG = styled.div`
  background-image: url(${loginBg});
  background-position: bottom right;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  animation: bgMove 15s linear infinite alternate;
  @keyframes bgMove {
    0% {
      background-size: 100%;
    }
    100% {
      background-size: 110%;
    }
  }
  @media screen and (max-width: 1200px) {
    animation: none;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .container {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 30px;
    width: 45vw;
    min-height: 60vh;
    @media screen and (max-width: 1200px) {
      width: 100vw;
      height: 100vh;
    }
    section {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 50%;
      }
      @media screen and (max-width: 800px) {
        flex-direction: column;
      }
    }
  }
  .errorInfo {
    font-size: 1.1rem;
    text-align: center;
    color: darkred;
    font-weight: 500;
    text-transform: uppercase;
    width: 80%;
    @media screen and (max-width: 800px) {
      width: 90%;
    }
  }
  h2 {
    text-transform: uppercase;
    color: var(--secondaryColor);
    font-size: 2rem;
    margin-bottom: 7vh;
    letter-spacing: 2px;
    text-align: center;
  }
  form {
    margin: 3vh auto 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;
    @media screen and (max-width: 800px) {
      width: 90%;
    }
    input {
      font-size: 1rem;
      width: 100%;
      margin: 1vh auto;
      padding: 10px 20px;
      border: 1px solid #111;
      border-radius: 5px;
      font-weight: 500;
      font-family: var(--textFont);
    }
  }
  .forgotPasswordLink {
    color: #888;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.4s;
    margin-top: 10px;
    text-align: right;
    align-self: flex-end;
    :hover {
      color: var(--secondaryColor);
    }
  }
  button {
    margin: 6vh auto 0vh;
    padding: 10px 30px;
    color: #000;
    border-radius: 10px;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    font-family: var(--textFont);
    cursor: pointer;
    transition: 0.4s;
    background-color: #eee;
    :hover {
      background-color: var(--secondaryColor);
      color: white;
    }
  }
`;

export default Login;
