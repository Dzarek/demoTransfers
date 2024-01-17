import styled from "styled-components";
import { useGlobalContext } from "../components/context";
import Link from "next/link";
import TransfersList from "../components/TransfersList";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import { FaCar, FaInfoCircle } from "react-icons/fa";
// import { subscribe } from "../components/Notification";

const bg3 = "/images/bg3.jpg";

export default function Home() {
  const { next5transfers, transfers, loading, isAdmin, lastAddedTransfers } =
    useGlobalContext();
  const [lastAddedList, setLastAddedList] = useState(false);

  // NOTIFICATION
  useEffect(() => {
    if (isAdmin) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("sw.js")
          .then(function (registration) {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch(function (error) {
            console.error("Service Worker registration failed:", error);
          });
      }
      if ("Notification" in window && "PushManager" in window) {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            console.log("Notification permission granted.");
          }
        });
      }
    }
  }, [isAdmin]);

  // const handleSub = async () => {
  //   const title = `nowy tytuł`;
  //   const tag = new Date();
  //   const body = `index body ${tag}`;
  //   await subscribe(title, body, tag, isAdmin);
  // };
  // END NOTIFICATION

  return (
    <Wrapper>
      {/* <button onClick={handleSub} className="notiBtn">
        Click to check notification
      </button> */}
      {isAdmin ? (
        <div className="containerAdmin">
          <div className="titleContainer">
            <h3
              onClick={() => setLastAddedList(false)}
              className={lastAddedList ? "noActive" : ""}
            >
              <FaCar />
              transfery na najbliższe 24 godziny{" "}
              <span>({next5transfers.length})</span>
            </h3>
            <h3
              onClick={() => setLastAddedList(true)}
              className={lastAddedList ? "" : "noActive"}
            >
              <FaCar />
              ostatnio dodane transfery{" "}
              <span>({lastAddedTransfers.length})</span>
            </h3>
          </div>
          {lastAddedList ? (
            <>
              {lastAddedTransfers.length < 1 && loading ? (
                <Loading />
              ) : (
                <>
                  {lastAddedTransfers.length > 0 ? (
                    <TransfersList transfers={lastAddedTransfers} />
                  ) : (
                    <p className="noTransfersInfo">
                      <FaInfoCircle /> przez ostatnie 24h nie dodano żadnych
                      nowych transferów
                    </p>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {next5transfers.length < 1 && loading ? (
                <Loading />
              ) : (
                <>
                  {next5transfers.length > 0 ? (
                    <TransfersList transfers={next5transfers} />
                  ) : (
                    <p className="noTransfersInfo">
                      <FaInfoCircle /> w najbliższych 24h nie ma żadnych
                      transferów do zrealizowania
                    </p>
                  )}
                </>
              )}
            </>
          )}
          <Link href="/transfers">
            <button className="allTransfers">zobacz wszystkie transfery</button>
          </Link>
        </div>
      ) : (
        <div className="container">
          <div className="titleContainer">
            <h3>5 najbliższych transferów</h3>
          </div>
          {transfers.length < 1 && loading ? (
            <Loading />
          ) : (
            <>
              {next5transfers.length > 0 ? (
                <TransfersList transfers={next5transfers} />
              ) : (
                <p className="noTransfersInfo">
                  <FaInfoCircle /> w najbliższym czasie nie ma żadnych
                  transferów
                </p>
              )}
            </>
          )}
          <Link href="/transfers">
            <button className="allTransfers">zobacz wszystkie transfery</button>
          </Link>
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  color: #222;
  padding-top: 20vh;
  min-height: 74vh;
  width: 100vw;
  position: relative;
  background-image: url(${bg3});
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: 50% 10%;
  @media screen and (max-width: 900px) {
    padding-top: 30vh;
    padding-top: 30dvh;
    min-height: 74dvh;
  }
  .notiBtn {
    position: fixed;
    top: 10vh;
    left: 10vw;
    z-index: 99999999999999999;
    font-size: 2rem;
  }
  .containerAdmin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    z-index: 1;
    height: 100%;
    min-height: 74vh;
    width: 100vw;
    padding: 10vh 3vw 3vh;
    background-color: rgba(0, 0, 0, 0.5);
    .titleContainer {
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 3vh;
      @media screen and (max-width: 900px) {
        flex-direction: row;
        justify-content: space-between;
        width: 98%;
      }
    }
    h3 {
      color: #fff;
      text-transform: uppercase;
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-align: center;
      width: auto;
      margin-bottom: 2vh;
      display: flex;
      align-items: center;
      text-shadow: 4px 4px 4px #000;
      span {
        font-size: 1rem;
        margin-left: 10px;
      }
      svg {
        color: var(--secondaryColor2);
        margin-right: 20px;
        animation: rideCar 0.6s linear infinite alternate;
        font-size: 1.6rem;
      }
      @keyframes rideCar {
        0% {
          transform: translateY(-2px);
        }
        100% {
          transform: translateY(2px);
        }
      }
      @media screen and (max-width: 900px) {
        background: #111;
        width: 48%;
        height: 30vh;
        padding: 5px;
        flex-direction: column;
        justify-content: space-around;
        font-size: 0.8rem;
        border-radius: 5px;
        span {
          font-size: 0.8rem;
        }
        svg {
          /* display: none; */
          margin-right: 0px;
        }
      }
    }
    .noActive {
      opacity: 0.5;
      font-size: 1.2rem;
      cursor: pointer;
      transition: 0.5s;
      border-bottom: 2px solid transparent;
      svg {
        opacity: 0;
      }
      span {
        font-size: 1rem;
      }
      :hover {
        border-bottom: 2px solid var(--secondaryColor);
        opacity: 0.8;
      }
      @media screen and (max-width: 900px) {
        font-size: 0.8rem;
        opacity: 0.6;
        span {
          font-size: 0.8rem;
        }
      }
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    z-index: 1;
    height: 100%;
    min-height: 74vh;
    width: 100vw;
    padding: 10vh 3vw 3vh;
    background-color: rgba(0, 0, 0, 0.5);
    .titleContainer {
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 3vh;
    }
    h3 {
      color: #fff;
      text-transform: uppercase;
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-align: center;
      width: auto;
      margin-bottom: 2vh;
      display: flex;
      align-items: center;
      text-shadow: 4px 4px 4px #000;
      svg {
        color: var(--secondaryColor2);
        margin-right: 20px;
        animation: rideCar 0.6s linear infinite alternate;
        font-size: 1.6rem;
      }
      @keyframes rideCar {
        0% {
          transform: translateY(-2px);
        }
        100% {
          transform: translateY(2px);
        }
      }
      @media screen and (max-width: 900px) {
        font-size: 1.2rem;
        svg {
          display: none;
        }
      }
    }
    .noActive {
      opacity: 0.5;
      font-size: 1.2rem;
      cursor: pointer;
      transition: 0.5s;
      border-bottom: 2px solid transparent;
      svg {
        display: none;
      }
      :hover {
        border-bottom: 2px solid var(--secondaryColor);
        opacity: 0.8;
      }
      @media screen and (max-width: 900px) {
        font-size: 0.9rem;
      }
    }
  }
  .noTransfersInfo {
    color: white;
    margin: 7vh auto 10vh;
    font-size: 1.1rem;
    max-width: 80vw;
    text-align: center;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    svg {
      color: var(--secondaryColor2);
      margin-right: 10px;
    }
    @media screen and (max-width: 900px) {
      font-size: 1rem;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.9);
      color: #111;
      svg {
        margin-right: 0px;
        margin-bottom: 10px;
        font-size: 1.5rem;
        color: var(--secondaryColor);
      }
    }
  }
  .allTransfers {
    background: #fff;
    color: #222;
    font-size: 1rem;
    padding: 10px 20px;
    border: 2px solid #fff;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.4s;
    margin: 5vh auto 5vh;
    :hover {
      background: #000;
      color: #fff;
      border: 2px solid #fff;
    }
    @media screen and (max-width: 900px) {
      font-weight: 600;
      font-size: 0.9rem;
    }
  }
`;
