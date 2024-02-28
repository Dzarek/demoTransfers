import styled from "styled-components";
import { useGlobalContext } from "../components/context";
import { useEffect, useState } from "react";
import moment from "moment/min/moment-with-locales";
import { Link as ScrollLink } from "react-scroll";
import TransfersList from "../components/TransfersList";
import Loading from "../components/Loading";
import CreateUserModal from "../components/CreateUserModal";
import {
  MdDoubleArrow,
  MdOutlineSettings,
  MdOutlineClose,
} from "react-icons/md";
import { BsFillBuildingFill, BsBuildingAdd } from "react-icons/bs";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import Aos from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/router";

const bg = "/images/tBg.jpg";

const TransfersPage = () => {
  const {
    transfers,
    isAdmin,
    allUsersList,
    setUserID,
    activeHotel,
    setActiveHotel,
    moneyData,
    setMoneyData,
    updateHotelPrice,
    disableUser,
    getAllUsers,
    currentUser,
  } = useGlobalContext();
  const [nextNumber, setNextNumber] = useState(5);
  const [prevNumber, setPrevNumber] = useState(0);
  const [moneyModal, setMoneyModal] = useState(false);
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
  const [openDeleteOption, setOpenDeleteOption] = useState(false);
  const [confirmDeleteOption, setConfirmDeleteOption] = useState(false);

  const router = useRouter();

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

  // END NOTIFICATION

  useEffect(() => {
    Aos.init({ duration: 1000, offset: -100 });
    setActiveHotel(null);
  }, []);

  const firstTransfer = transfers.find(
    (item) =>
      moment(item.date).valueOf() >= moment().subtract(1, "days").valueOf()
  );
  const startTransferIndex = transfers.indexOf(firstTransfer);

  const handleActiveHotel = (id) => {
    setUserID(id);
    const chosenhotel = allUsersList.find((item) => item.id === id);
    setActiveHotel(chosenhotel.userName);
  };

  useEffect(() => {
    if (startTransferIndex >= 0) {
      setPrevNumber(startTransferIndex);
      setNextNumber(5);
    } else {
      setPrevNumber(transfers.length - 7);
      setNextNumber(transfers.length + 1);
    }
  }, [activeHotel, startTransferIndex, transfers]);

  const handleNext = () => {
    if (nextNumber >= transfers.length) {
      setNextNumber(0);
    } else {
      setNextNumber(nextNumber + 3);
    }
  };
  const handlePrev = () => {
    if (prevNumber <= 2) {
      setPrevNumber(0);
    } else {
      setPrevNumber(prevNumber - 3);
    }
  };

  const startPageTransfers = transfers.slice(
    prevNumber,
    startTransferIndex + nextNumber
  );

  if (!isAdmin) {
    setActiveHotel(true);
  }

  const handleHotelMoney = (id) => {
    setUserID(id);
    const chosenhotel = allUsersList.find((item) => item.id === id);
    setMoneyModal(chosenhotel);
  };

  const handleChangePrice = (e, item) => {
    let items = [...moneyData];
    item.price = +e.target.value;
    items[item.index] = item;
    setMoneyData(items);
  };
  const handleChangeProvision = (e, item) => {
    let items = [...moneyData];
    item.provision = +e.target.value;
    items[item.index] = item;
    setMoneyData(items);
  };

  const handleChangeHotelMoney = () => {
    updateHotelPrice();
    setMoneyModal(null);
  };

  const exitOption = () => {
    setMoneyModal(null);
    setOpenDeleteOption(false);
    setConfirmDeleteOption(false);
  };

  const disableUserHanler = () => {
    disableUser();
    exitOption();
    getAllUsers();
  };

  if (!currentUser) {
    router.push("/login");
  }

  return (
    <>
      <Wrapper>
        {isAdmin && (
          <div className="adminContainer">
            <h3>Wybierz hotel</h3>
            <ul>
              {allUsersList.map((item) => {
                const { id, userName } = item;
                return (
                  <div className="itemContainer" key={id}>
                    <p onClick={() => handleHotelMoney(id)}>
                      <MdOutlineSettings className="moneyIcon" />
                    </p>
                    <ScrollLink
                      to="list"
                      spy={true}
                      smooth={true}
                      duration={1000}
                      offset={-100}
                      delay={200}
                      className={activeHotel === userName && "activeBtn"}
                      onClick={() => handleActiveHotel(id)}
                    >
                      <section>
                        <BsFillBuildingFill />
                        <span>{userName}</span>
                      </section>
                    </ScrollLink>
                  </div>
                );
              })}
              <div
                className="itemContainer itemContainerNew"
                onClick={() => setOpenCreateUserModal(true)}
              >
                <a>
                  <section>
                    <BsBuildingAdd />
                    <span>DODAJ NOWY</span>
                  </section>
                </a>
              </div>
            </ul>
          </div>
        )}
        <div className="container" name="list">
          {isAdmin && activeHotel && (
            <h3>
              Lista Transferów dla <span> {activeHotel}</span>
            </h3>
          )}
          {!isAdmin && <h3>Lista Transferów</h3>}
          {activeHotel && transfers.length > 0 ? (
            <>
              {startPageTransfers.length < 1 ? (
                <Loading />
              ) : (
                <>
                  {prevNumber > 0 && (
                    <button className="arrow arrowLeft" onClick={handlePrev}>
                      <MdDoubleArrow />
                    </button>
                  )}
                  <TransfersList transfers={startPageTransfers} />
                  {transfers.length > startTransferIndex + nextNumber && (
                    <button className="arrow arrowRight" onClick={handleNext}>
                      <MdDoubleArrow />
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {activeHotel && (
                <p className="noTransfersInfo">
                  <FaInfoCircle /> brak transferów w bazie danych
                </p>
              )}
              {!isAdmin && (
                <Link href="/reservation">
                  <button className="allTransfers">dodaj transfer</button>
                </Link>
              )}
            </>
          )}
        </div>
        {moneyModal && (
          <div className="moneyModalContainer">
            <div className="moneyModal" data-aos="zoom-in">
              <MdOutlineClose className="closeIcon" onClick={exitOption} />
              <h3>{moneyModal.userName}</h3>
              <h4>CENNIK</h4>
              {moneyData.map((item, index) => {
                return (
                  <article key={index}>
                    <p>
                      {item.minPeople}-{item.maxPeople} osoby:
                    </p>
                    <div className="inputContainer">
                      <label htmlFor="moneyPrice">cena:</label>
                      <input
                        id="moneyPrice"
                        className="moneyPrice"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleChangePrice(e, item)}
                      />
                    </div>
                    <p>PLN</p>
                    <div className="inputContainer">
                      <label htmlFor="moneyProvision">prowizja:</label>
                      <input
                        id="moneyProvision"
                        className="moneyProvision"
                        type="number"
                        value={item.provision}
                        onChange={(e) => handleChangeProvision(e, item)}
                      />
                    </div>
                    <p>PLN</p>
                  </article>
                );
              })}
              <button onClick={handleChangeHotelMoney}>zapisz zmiany</button>
              <h4
                className="deleteTitle"
                onClick={() => setOpenDeleteOption(!openDeleteOption)}
              >
                STREFA DEZAKTYWACJI KONTA{" "}
                {openDeleteOption ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
              </h4>
              {openDeleteOption && (
                <>
                  <div className="deleteAccountContainer">
                    <button onClick={() => setConfirmDeleteOption(true)}>
                      Usuń hotel
                    </button>
                  </div>
                  {confirmDeleteOption && (
                    <div className="confirmDeleteOption">
                      <p>Czy potwierdzasz usunięcie hotelu?</p>
                      <section>
                        <button onClick={disableUserHanler}>TAK</button>
                        <button onClick={() => setConfirmDeleteOption(false)}>
                          NIE
                        </button>
                      </section>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Wrapper>
      {openCreateUserModal && (
        <CreateUserModal setOpenCreateUserModal={setOpenCreateUserModal} />
      )}
    </>
  );
};

const Wrapper = styled.div`
  color: #222;
  padding-top: 20vh;
  min-height: 74vh;
  width: 100vw;
  position: relative;
  background-image: url(${bg});
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: 50% 10%;
  @media screen and (max-width: 900px) {
    padding-top: 30vh;
    padding-top: 30dvh;
    min-height: 74dvh;
  }
  .adminContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1;
    width: 100vw;
    padding: 10vh 3vw 0vh;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    h3 {
      color: #fff;
      text-transform: uppercase;
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 3px;
      margin-bottom: 5vh;
      text-align: center;
      text-shadow: 4px 4px 4px #000;
      @media screen and (max-width: 900px) {
        font-size: 1.2rem;
        font-weight: 600;
      }
    }

    ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .itemContainer {
        position: relative;
        margin: 2vw;
        p {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 5px;
          right: 5px;
          z-index: 2;
          padding: 10px;
          cursor: pointer;

          .moneyIcon {
            font-size: 2rem;
            transition: 1s;
            color: #222;
          }
          :hover .moneyIcon {
            transform: rotate(360deg);
            font-size: 2.2rem;
          }
        }
      }
      a {
        background: #fff;
        width: 240px;
        height: 160px;
        color: #222;
        border-radius: 5px;
        border: 4px solid var(--secondaryColor);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        font-size: 1.1rem;
        font-weight: 600;
        text-align: center;
        position: relative;
        transition: 0.4s;
        cursor: pointer;
        @media screen and (max-width: 900px) {
          width: 70vw;
          min-height: 32vw;
          height: auto;
          font-size: 1rem;
        }

        section {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 240px;
          @media screen and (max-width: 900px) {
            width: 100%;
          }
        }
        svg {
          color: var(--secondaryColor);
          font-size: 3rem;
          margin-bottom: 1vw;
          transition: 0.4s;
          @media screen and (max-width: 900px) {
            font-size: 1.8rem;
            margin-bottom: 1.5vh;
          }
        }
        :hover {
          border-left: 120px solid var(--secondaryColor);
          border-right: 120px solid var(--secondaryColor);
          border-top: 80px solid var(--secondaryColor);
          border-bottom: 80px solid var(--secondaryColor);
          color: white;
          @media screen and (max-width: 900px) {
            border: none;
            background-color: var(--secondaryColor);
          }
        }
        :hover svg {
          color: white;
        }
      }
      .activeBtn {
        background: var(--secondaryColor);
        color: white;
        border: 4px solid white;
        svg {
          color: white;
        }
      }
    }
    .itemContainerNew {
      a {
        background: #222;
        color: #fff;
        border: 4px solid var(--secondaryColor);
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
    padding: 10vh 3vw 10vh;
    background-color: rgba(0, 0, 0, 0.5);
    h3 {
      color: #fff;
      text-transform: uppercase;
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 3px;
      margin-bottom: 5vh;
      text-align: center;
      text-shadow: 4px 4px 4px #000;
      span {
        font-weight: 800;
        font-size: 1.5rem;
        color: var(--secondaryColor);
      }
      @media screen and (max-width: 900px) {
        font-size: 1.2rem;
        span {
          font-size: 1.2rem;
        }
      }
    }
  }
  .arrow {
    font-size: 2.5rem;
    color: #ddd;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: 0.4s;
    margin: 3vh auto;
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
      color: var(--secondaryColor);
    }
  }
  .arrowLeft {
    transform: rotate(-90deg);
  }
  .arrowRight {
    transform: rotate(90deg);
    margin: 1vh auto;
  }
  .moneyModalContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 1200px) {
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      overflow: auto;
    }
  }
  .moneyModal {
    width: 50vw;
    min-height: 50vh;
    padding: 20px;
    color: white;
    background: #111;
    border: 4px solid var(--secondaryColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 1200px) {
      position: absolute;
      width: 100vw;
      min-height: 100vh;
      top: 0;
      left: 0;
    }
    .closeIcon {
      position: absolute;
      top: 5%;
      right: 5%;
      font-size: 2.5rem;
      color: var(--secondaryColor);
      transition: 0.4s;
      cursor: pointer;
      :hover {
        transform: rotate(180deg);
      }
      @media screen and (max-width: 1200px) {
        top: 2%;
      }
    }
    article {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 90%;
      margin: 1vh auto;
      @media screen and (max-width: 1200px) {
        width: 95%;
        flex-direction: column;
      }
      p {
        margin-right: 10px;
        font-size: 1.2rem;
        font-weight: 600;
        margin-top: 30px;
        @media screen and (max-width: 1200px) {
          text-align: center;
          font-size: 1rem;
          margin-right: 10px;
          :nth-of-type(2) {
            display: none;
          }
          :nth-of-type(3) {
            display: none;
          }
        }
      }
      .inputContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 25%;
        margin: 0 20px;
        @media screen and (max-width: 1200px) {
          width: auto;
          margin: 0 5px;
        }
      }
      label {
        margin-bottom: 1vh;
        font-weight: 500;
        font-size: 1.1rem;
        color: var(--secondaryColor);
      }
      input {
        font-size: 1.2rem;
        padding: 10px 10px;
        text-align: center;
        width: 100%;
        font-weight: 600;
      }
    }
    h3 {
      text-transform: uppercase;
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 3vh;
      @media screen and (max-width: 1200px) {
        margin-top: 10vh;
      }
    }
    h4 {
      font-size: 1.4rem;
      color: var(--secondaryColor);
      margin-bottom: 3vh;
      text-align: center;
    }
    button {
      background-color: white;
      color: #111;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      font-size: 1rem;
      margin: 5vh auto;
      transition: 0.4s;
      font-weight: 600;
      :hover {
        background-color: var(--secondaryColor);
        color: white;
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
    background: #222;
    color: #fff;
    font-size: 1rem;
    padding: 10px;
    border: 2px solid #fff;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.4s;
    margin: 5vh auto 5vh;
    :hover {
      background: #fff;
      color: #222;
    }
    @media screen and (max-width: 900px) {
      font-weight: 600;
      font-size: 0.9rem;
    }
  }

  .deleteTitle {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.4s;
    cursor: pointer;
    svg {
      margin-left: 10px;
      font-size: 3rem;
    }
    :hover {
      color: var(--statusCancel);
    }
    @media screen and (max-width: 900px) {
      font-size: 1.2rem !important;
      margin-top: 5vh;
      flex-direction: column;
    }
  }
  .deleteAccountContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: -5vh;

    button {
      text-transform: lowercase;
      color: var(--statusCancel);
      :hover {
        background: var(--statusCancel);
        color: white;
      }
    }
  }
  .confirmDeleteOption {
    position: fixed;
    z-index: 9999999999999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px;
    background: var(--customDarkRed);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--secondaryColor);
    border-radius: 5px;
    @media screen and (max-width: 900px) {
      width: 100vw;
    }
    p {
      text-align: center;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 5vh;
      margin-top: 2vh;
      font-size: 1rem;
    }
    section {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      button {
        background-color: white;
        color: #111;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        font-size: 1rem;
        margin: 5vh auto;
        transition: 0.4s;
        font-weight: 600;
        :hover {
          background-color: var(--secondaryColor);
          color: white;
        }
      }
    }
  }
`;

export default TransfersPage;
