import styled from "styled-components";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { useRouter } from "next/router";
import moment from "moment/min/moment-with-locales";
import { v4 as uuidv4 } from "uuid";
import { IoAddCircle, IoCheckmark } from "react-icons/io5";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { sendConfirmation } from "../lib/api";

let minDate = moment().format("YYYY-MM-DD");
let maxDate = moment().add(90, "days").format("YYYY-MM-DD");

let minTime = new Date().toLocaleTimeString().slice(0, 5);

const ReservationPage = () => {
  const { transfers, setTransfers, postProducts, isAdmin, name, moneyData } =
    useGlobalContext();
  const [date, setDate] = useState(minDate);
  const [time, setTime] = useState(null);
  const [nameOfGuest, setNameOfGuest] = useState("");
  const [direction, setDirection] = useState(`${name} - Kraków Airport`);
  const [people, setPeople] = useState(null);
  const [flight, setFlight] = useState("");
  const [phone, setPhone] = useState(null);
  const [details, setDetails] = useState(null);
  const [price, setPrice] = useState(0);
  const [provision, setProvision] = useState(0);
  const [sendForm, setSendForm] = useState(false);

  const [specialTransfer, setSpecialTransfer] = useState(false);

  const { push } = useRouter();

  useEffect(async () => {
    if (people === null) {
      setPrice(0);
      setProvision(0);
    }
    if (moneyData) {
      moneyData.forEach((item) => {
        if (people >= item.minPeople && people <= item.maxPeople) {
          setPrice(item.price);
          setProvision(item.provision);
        }
      });
    }
  }, [people]);

  const directions = [
    `${name} - Kraków Airport`,
    `Kraków Airport - ${name}`,
  ].map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });

  const handleSubmit = (e) => {
    const createdDate = moment().valueOf();
    e.preventDefault();
    const id = uuidv4();
    const status = "pending";
    const newTransfer = {
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
      createdDate,
      specialTransfer,
    };
    setTransfers([...transfers, newTransfer]);
    postProducts(
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
      createdDate,
      specialTransfer
    );
    setSendForm(true);
    setTimeout(() => {
      setDate(minDate);
      setTime(null);
      setNameOfGuest("");
      // setDirection(`${name} - Kraków Airport`);
      setPeople(null);
      setFlight("");
      setPhone(null);
      setDetails(null);
      setPrice(0);
      setProvision(0);
      setSendForm(false);
      setSpecialTransfer(false);
    }, 2000);
    handleEmailConfirm();
  };

  if (isAdmin) {
    push("/");
    return <p></p>;
  }

  const handleEmailConfirm = async () => {
    const convertDate = moment(date).format("L");
    const data = { name, convertDate };
    await sendConfirmation(data);
  };

  return (
    <Wrapper>
      <div className="imgContainer">
        <h2>
          Rezerwacja <br /> <p>(max 90 dni do przodu)</p>
        </h2>

        <img
          src="/images/car2.png"
          alt=""
          className={sendForm ? "carRide" : "carBack"}
        />
      </div>
      {sendForm ? (
        <h3 className="sendFormInfo">
          Transfer został dodany <br />
          <IoCheckmark />
        </h3>
      ) : (
        <>
          {specialTransfer ? (
            <form onSubmit={(e) => handleSubmit(e)} className="specialForm">
              <div>
                <section>
                  <label htmlFor="date">Data:</label>
                  <input
                    type="date"
                    name="date"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </section>
                <section>
                  <label htmlFor="time">Godzina:</label>
                  <input
                    type="time"
                    name="time"
                    value={time}
                    min={date === minDate && minTime}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </section>
              </div>
              <section>
                <label htmlFor="name">Imię i Nazwisko:</label>
                <input
                  type="text"
                  name="name"
                  value={nameOfGuest}
                  onChange={(e) => setNameOfGuest(e.target.value)}
                  required
                />
              </section>
              <section>
                <label htmlFor="direction">Kierunek:</label>
                <select
                  name="direction"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  required
                >
                  {directions}
                </select>{" "}
              </section>
              <div>
                <section>
                  <label htmlFor="people">Liczba osób:</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={99}
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                  />
                  <p>(max 99)</p>
                </section>
                <section>
                  <label htmlFor="flyNumber">Numer lotu:</label>
                  <input
                    type="text"
                    required={direction === `Kraków Airport - ${name}`}
                    value={flight}
                    onChange={(e) => setFlight(e.target.value)}
                  />
                </section>
                <section>
                  <label htmlFor="flyNumber">Telefon:</label>
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </section>
              </div>
              <section>
                <label htmlFor="details">Uwagi:</label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </section>
              <div>
                <section className="specialPrice">
                  <label htmlFor="price">Cena:</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <p> PLN</p>
                  <FaLockOpen />
                </section>
                <section className="specialPrice">
                  <label htmlFor="provision">Prowizja:</label>
                  <input
                    type="number"
                    value={provision}
                    onChange={(e) => setProvision(e.target.value)}
                  />
                  <p> PLN</p>
                  <FaLockOpen />
                </section>
              </div>
              <button className="reservebutton" type="submit">
                <IoAddCircle />
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => handleSubmit(e)}>
              <div>
                <section>
                  <label htmlFor="date">Data:</label>
                  <input
                    type="date"
                    name="date"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </section>
                <section>
                  <label htmlFor="time">Godzina:</label>
                  <input
                    type="time"
                    name="time"
                    value={time}
                    min={date === minDate && minTime}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </section>
              </div>
              <section>
                <label htmlFor="name">Imię i Nazwisko:</label>
                <input
                  type="text"
                  name="name"
                  value={nameOfGuest}
                  onChange={(e) => setNameOfGuest(e.target.value)}
                  required
                />
              </section>
              <section>
                <label htmlFor="direction">Kierunek:</label>
                <select
                  name="direction"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  required
                >
                  {directions}
                </select>{" "}
              </section>
              <div>
                <section>
                  <label htmlFor="people">Liczba osób:</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={8}
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                  />
                  <p>(max 8)</p>
                </section>
                <section>
                  <label htmlFor="flyNumber">Numer lotu:</label>
                  <input
                    type="text"
                    required={direction === `Kraków Airport - ${name}`}
                    value={flight}
                    onChange={(e) => setFlight(e.target.value)}
                  />
                </section>
                <section>
                  <label htmlFor="flyNumber">Telefon:</label>
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </section>
              </div>
              <section>
                <label htmlFor="details">Uwagi:</label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </section>
              <div>
                <section className="price">
                  <label htmlFor="price">Cena:</label>
                  <h4>{price} PLN</h4>
                  <FaLock />
                </section>
                <section className="price">
                  <label htmlFor="provision">Prowizja:</label>
                  <h4>{provision} PLN</h4>
                  <FaLock />
                </section>
              </div>
              <button className="reservebutton" type="submit">
                <IoAddCircle />
              </button>
            </form>
          )}
        </>
      )}
      {specialTransfer ? (
        <button
          className="specialTransfer"
          onClick={() => setSpecialTransfer(false)}
          style={{ background: "#e9d7b6", color: "#111" }}
        >
          zmień na transfer zwykły
        </button>
      ) : (
        <button
          className="specialTransfer"
          onClick={() => setSpecialTransfer(true)}
          style={{ background: "#50708ccb" }}
        >
          zmień na transfer specjalny
        </button>
      )}
      {specialTransfer && (
        <p className="specialInfo">
          Dodając transfer specjalny możesz ustalić własne ceny, prowizje oraz
          liczbę osób. Przed rezerwacją porozmawiaj ze swoim opiekunem.{" "}
        </p>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding-top: 20vh;
  background: #111;
  min-height: 74vh;
  color: #111;
  position: relative;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
  h2 {
    text-transform: uppercase;
    color: var(--secondaryColor);
    align-self: center;
    margin-bottom: 4vh;
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: 3px;
    text-align: center;
    p {
      margin-top: 2vh;
      color: white;
      font-size: 1.1rem;
      text-transform: lowercase;
      @media screen and (max-width: 900px) {
        font-size: 1rem;
      }
    }
  }
  .imgContainer {
    height: 100%;
    min-height: 74vh;
    width: 40vw;
    background-color: #111;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 900px) {
      width: 90vw;
    }
    img {
      margin-left: 2vw;
      width: 100%;
    }
    .carRide {
      animation: carMove2 1s ease 1 forwards;
    }
    .carBack {
      animation: carMove 1s ease 1 forwards;
    }
    @keyframes carMove {
      0% {
        opacity: 0;
        transform: translateX(-100px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes carMove2 {
      0% {
        opacity: 1;
        transform: translateX(0);
      }
      90% {
        opacity: 0;
      }
      100% {
        opacity: 0;
        transform: translateX(20vw);
      }
    }
  }

  form {
    width: 50vw;
    margin-right: 5vw;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 900px) {
      width: 90vw;
      margin: 0 auto 10vh;
    }
    div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      section {
        width: 49%;
        p {
          font-weight: 500;
          margin-left: 10px;
        }
      }
      :nth-of-type(2) {
        section {
          input {
            width: 20%;
          }
          :nth-of-type(1) {
            width: 26%;
          }
          :nth-of-type(2) {
            width: 32%;
          }
          :nth-of-type(3) {
            width: 38%;
          }
        }
      }
      @media screen and (max-width: 2000px) {
        flex-wrap: wrap;
        section {
          width: 49%;
        }
        :nth-of-type(2) {
          section {
            width: 49%;

            :nth-of-type(1) {
              width: 49%;
            }
            :nth-of-type(2) {
              width: 49%;
            }
            :nth-of-type(3) {
              width: 100%;
            }
          }
        }
      }
      @media screen and (max-width: 900px) {
        flex-direction: column;
        section {
          width: 100%;
        }
        :nth-of-type(2) {
          section {
            input {
              width: 100%;
            }
            :nth-of-type(1) {
              width: 100%;
            }
            :nth-of-type(2) {
              width: 100%;
            }
            :nth-of-type(3) {
              width: 100%;
            }
          }
        }
      }
    }
    section {
      background: #fff;
      margin-bottom: 1.5vh;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-radius: 5px;
      padding: 5px 10px;

      @media screen and (max-width: 900px) {
        flex-direction: column;
        justify-content: center;
      }
      label {
        font-size: 1rem;
        font-weight: 500;
        margin-right: 20px;
        @media screen and (max-width: 900px) {
          margin-right: 0px;
        }
      }
      input,
      select {
        width: 50%;
        font-size: 1rem;
        font-family: var(--textFont);
        font-weight: 600;
        text-transform: uppercase;
        padding: 3px 10px;
        flex-grow: 1;
        border: 2px solid var(--secondaryColor);
        border-radius: 5px;
        text-align: center;
        @media screen and (max-width: 900px) {
          width: 100%;
        }
      }
    }
    .price {
      background-color: var(--secondaryColor);
      text-align: center;
      justify-content: center;
      position: relative;
      padding: 9px 10px;

      label,
      h4 {
        font-weight: 600;
        font-size: 1rem;
      }
      svg {
        position: absolute;
        top: 50%;
        right: 10%;
        transform: translateY(-50%);
        font-size: 1rem;
      }
    }
  }
  .reservebutton {
    background: transparent;
    color: #fff;
    font-size: 3rem;
    border: none;
    cursor: pointer;
    transition: 0.4s;
    margin-top: 4vh;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    :hover {
      transform: scale(1.2);
      color: var(--secondaryColor);
    }
  }

  .sendFormInfo {
    color: white;
    font-size: 1.8rem;
    text-transform: uppercase;
    text-align: center;
    width: 50vw;
    margin-right: 5vw;
    position: relative;
    svg {
      display: none;
    }
    @media screen and (max-width: 900px) {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      background: #111;
      font-size: 1.4rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 999999999999999999;
      svg {
        margin-top: 5vh;
        display: block;
        color: var(--secondaryColor);
        font-size: 4rem;
        animation: svgShow 1s ease 1 forwards;
      }
      @keyframes svgShow {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }
  .specialForm {
    input,
    select {
      border-color: var(--specialTransfser);
    }
    div {
      flex-wrap: wrap;
      .specialPrice {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        @media screen and (max-width: 900px) {
          flex-direction: row;
          flex-wrap: wrap;
          label {
            width: 100%;
            text-align: center;
          }
        }

        input {
          flex-grow: 1;
          width: 40%;

          @media screen and (max-width: 900px) {
            width: 80%;
          }
        }
        svg {
          font-size: 1.2rem;
          margin: 0 20px;
          @media screen and (max-width: 1300px) {
            display: none;
          }
        }
      }
      section {
        width: 49%;
        @media screen and (max-width: 900px) {
          width: 100%;
        }
      }
      :nth-of-type(2) {
        section {
          width: 49%;

          :nth-of-type(1) {
            width: 49%;
          }
          :nth-of-type(2) {
            width: 49%;
          }
          :nth-of-type(3) {
            width: 100%;
          }
          @media screen and (max-width: 900px) {
            width: 100%;
            :nth-of-type(1) {
              width: 100%;
            }
            :nth-of-type(2) {
              width: 100%;
            }
            :nth-of-type(3) {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .specialTransfer {
    position: absolute;
    right: 5vw;
    bottom: 2vh;
    background: #fff;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-family: var(--textFont);
    opacity: 0.8;
    transition: 0.5s;
    font-size: 0.8rem;
    :hover {
      opacity: 1;
    }
  }
  .specialInfo {
    position: absolute;
    left: 3%;
    width: 40vw;
    bottom: 2vh;
    color: #fff;
    font-size: 0.9rem;
    @media screen and (max-width: 900px) {
      position: static;
      width: 90vw;
      margin: -2vh auto 14vh;
      text-align: center;
    }
  }
`;

export default ReservationPage;
