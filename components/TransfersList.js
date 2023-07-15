import styled from "styled-components";
import { useGlobalContext } from "./context";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment/min/moment-with-locales";
import Aos from "aos";
import "aos/dist/aos.css";
import DeleteModal from "./DeleteModal";
import { IoCalendar, IoBody } from "react-icons/io5";
import { IoMdTrash } from "react-icons/io";
import { TbArrowsLeftRight } from "react-icons/tb";
import {
  MdAccessTimeFilled,
  MdPerson,
  MdOutlineAirplanemodeActive,
  MdInfo,
  MdSmartphone,
  MdCancel,
  MdOutlineClose,
} from "react-icons/md";
import { GiReceiveMoney, GiMoneyStack } from "react-icons/gi";
import {
  ImCheckboxChecked,
  ImCheckboxUnchecked,
  ImCheckmark,
} from "react-icons/im";

const TransfersList = ({ transfers }) => {
  const { setConfirmDelete, setDeleteId, confirmDelete, isAdmin } =
    useGlobalContext();
  const [showModal, setShowModal] = useState(null);
  const router = useRouter();
  const handleDeleteShow = (id) => {
    setConfirmDelete(true);
    setDeleteId(id);
  };
  const currentDay = moment().format("L");

  useEffect(() => {
    Aos.init({ duration: 1000, offset: -100 });
  }, []);

  return (
    <>
      <Wrapper>
        {transfers.map((item) => {
          const {
            id,
            status,
            date,
            time,
            nameOfGuest,
            direction,
            people,
            details,
            flight,
            phone,
            price,
            provision,
            specialTransfer,
          } = item;
          const convertDate = moment(date).format("L");
          let t = time; // hh:mm
          let ms =
            Number(t.split(":")[0]) * 60 * 60 * 1000 +
            Number(t.split(":")[1]) * 60 * 1000;
          const classOld = moment(date).valueOf() + ms < Date.now();

          const liClass =
            status === "cancel"
              ? "cancel"
              : "" || convertDate === currentDay
              ? "todayClass"
              : "";
          return (
            <div
              className={classOld ? "classOld" : ""}
              key={id}
              data-aos="zoom-in"
            >
              <li
                className={liClass}
                style={{
                  animation: classOld && "none",
                  borderColor: specialTransfer && "rgb(59, 122, 204)",
                }}
              >
                {status === "ok" && (
                  <p className="status good">
                    <ImCheckboxChecked />
                  </p>
                )}
                {status === "pending" && (
                  <p className="status pending">
                    <ImCheckboxUnchecked />
                  </p>
                )}
                {status === "cancel" && (
                  <p className="status cancel">
                    <MdCancel />
                  </p>
                )}
                <div className="info">
                  <section>
                    <p>
                      <IoCalendar
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      {convertDate}
                    </p>
                    <p>
                      <MdAccessTimeFilled
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      {time}
                    </p>
                  </section>
                  <section>
                    <p>
                      <MdPerson
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      {nameOfGuest}
                    </p>
                  </section>
                  <section>
                    <p>
                      <TbArrowsLeftRight
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      {direction}
                    </p>
                  </section>
                  <section>
                    <p>
                      <IoBody
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />{" "}
                      {people}
                    </p>
                    <p style={{ textTransform: "uppercase" }}>
                      <MdOutlineAirplanemodeActive
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      {flight}
                    </p>
                  </section>
                  <section>
                    <p>
                      <MdSmartphone
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      +{phone}
                    </p>
                  </section>

                  {details && (
                    <section>
                      <p>
                        <MdInfo
                          style={{
                            cursor: "pointer",
                            color: specialTransfer && "rgb(59, 122, 204)",
                          }}
                          onClick={() => setShowModal(id)}
                        />
                        <div
                          className={
                            showModal === id
                              ? "infoModal activeInfo"
                              : "infoModal"
                          }
                        >
                          <p>
                            <span>Uwagi: </span>
                            {details}
                          </p>
                          <button onClick={() => setShowModal("")}>
                            <MdOutlineClose />
                          </button>
                        </div>
                      </p>
                    </section>
                  )}
                  <section>
                    <p>
                      <GiMoneyStack
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      {status !== "cancel" ? price : 0} PLN
                    </p>
                    <p>
                      <GiReceiveMoney
                        style={{
                          color: specialTransfer && "rgb(59, 122, 204)",
                        }}
                      />
                      {status !== "cancel" ? provision : 0} PLN
                    </p>
                  </section>
                </div>
                {isAdmin && router.pathname !== "/" && (
                  <>
                    {status !== "cancel" && status !== "ok" && !classOld && (
                      <button
                        className="deleteBtn"
                        onClick={() => handleDeleteShow(id)}
                        disabled={classOld}
                      >
                        <ImCheckmark
                          style={{ color: "#598c50" }}
                          className="iconOK"
                        />
                      </button>
                    )}
                  </>
                )}
                {!isAdmin && (
                  <>
                    {status !== "cancel" && !classOld && (
                      <button
                        className="deleteBtn"
                        onClick={() => handleDeleteShow(id)}
                        disabled={classOld}
                      >
                        <IoMdTrash style={{ color: "darkred" }} />
                      </button>
                    )}
                  </>
                )}
              </li>
            </div>
          );
        })}
      </Wrapper>
      {confirmDelete && <DeleteModal />}
    </>
  );
};

const Wrapper = styled.ul`
  list-style: none;
  width: 100%;
  max-width: 1680px;
  margin: 5vh auto;
  li {
    width: 100%;
    background: #fff;
    color: #222;
    margin-bottom: 2vh;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    font-weight: 500;
    border: 3px solid var(--secondaryColor);
    overflow: hidden;

    .info {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      flex-grow: 1;
      position: relative;
      @media screen and (max-width: 1200px) {
        order: 3;
      }

      section {
        display: flex;
        align-items: center;
        justify-content: inherit;
        flex-grow: 1;

        @media screen and (max-width: 900px) {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          width: 100%;
          justify-content: center;
        }
      }
      p {
        margin: 0 5px;
      }
      .infoModal {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background: #222;
        color: white;
        padding: 0 5%;
        width: 100%;
        height: 100%;
        z-index: 999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: 0.4s;
        top: 200%;
        p {
          text-transform: lowercase;
          span {
            text-transform: capitalize;
            color: var(--secondaryColor);
            margin-right: 10px;
          }
        }
        button {
          background: transparent;
          color: var(--secondaryColor);
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            transition: 0.4s;
            font-size: 1.8rem;
            :hover {
              transform: rotate(180deg);
            }
          }
        }
      }
      .activeInfo {
        transition: 0.4s;
        top: 0%;
      }
    }
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      padding: 1.5vh 0vw;
      text-transform: capitalize;
      svg {
        color: var(--secondaryColor);
        margin-right: 10px;
        font-size: 1.2rem;
      }
    }
    .status {
      height: 100%;
      padding: 1.9vh 2vh;
      align-self: flex-start;
      @media screen and (max-width: 1200px) {
        flex-grow: 1;
        width: 50%;
        order: 1;
        padding: 1.6vh 2vh;
      }
      svg {
        font-size: 1.3rem;
        color: white;
        margin-right: 0px;
        @media screen and (max-width: 1200px) {
          font-size: 1.5rem;
        }
      }
    }
  }
  .good {
    background-color: var(--statusOk);
  }
  .pending {
    background-color: var(--statusPending);
  }
  .cancel {
    background-color: var(--statusCancel);
    color: whitesmoke;
  }
  .todayClass {
    animation: todayAnim 0.5s linear infinite alternate;
    font-weight: 600;
  }
  @keyframes todayAnim {
    100% {
      background: var(--secondaryColorLight);
    }
  }
  .deleteBtn {
    background: transparent;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 1vh 1vw;
    @media screen and (max-width: 1200px) {
      order: 2;
      width: 50%;
      padding: 1.6vh 1vw;
      background: var(--lightred);
    }
    svg {
      font-size: 1.5rem;
      transition: 0.4s;
    }
    :hover {
      svg {
        transform: scale(1.2);
      }
    }
    .iconOK {
      animation: iconOKAnim 1s linear infinite alternate;
      :hover {
        animation: none;
        transform: scale(1.2);
      }
    }
    @keyframes iconOKAnim {
      0% {
        transform: rotate(-15deg);
      }
      100% {
        transform: rotate(15deg);
      }
    }
  }
`;

export default TransfersList;
