import styled from "styled-components";
import { useGlobalContext } from "./context";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { MdOutlineClose } from "react-icons/md";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { Pie } from "react-chartjs-2";

Chart.register(CategoryScale);

let dataChart = [
  {
    id: 1,
    name: "Reszta Hoteli",
    userGain: 0,
    userLost: 0,
  },
  {
    id: 2,
    name: "",
    userGain: 0,
    userLost: 0,
  },
];

const MoneySumCharts = ({ setOpenMoneyCharts }) => {
  const {
    allUsersList,
    setUserID,
    currentMonthYear,
    prevMonthYear,
    monthProvision,
    monthAdminEarn,
    monthAdminEarnAll,
    monthProvisionAll,
    prevMonthProvision,
    prevMonthAdminEarn,
    prevMonthAdminEarnAll,
    prevMonthProvisionAll,
  } = useGlobalContext();

  const [activeMonth, setActiveMonth] = useState(true);
  const [userSelect, setUserSelect] = useState("---");

  const updateDataChart = () => {
    if (activeMonth) {
      dataChart = [
        {
          id: 1,
          name: "Reszta Hoteli",
          userGain: monthAdminEarnAll - monthAdminEarn,
          userLost: 345,
        },
        {
          id: 2,
          name: userSelect,
          userGain: monthAdminEarn,
          userLost: 823,
        },
      ];
    } else {
      dataChart = [
        {
          id: 1,
          name: "Reszta Hoteli",
          userGain: prevMonthAdminEarnAll - prevMonthAdminEarn,
          userLost: 345,
        },
        {
          id: 2,
          name: userSelect,
          userGain: prevMonthAdminEarn,
          userLost: 823,
        },
      ];
    }
  };

  const handleChangeMonth = () => {
    setActiveMonth(!activeMonth);
    updateDataChart();
  };
  const handleActiveHotel = (e) => {
    setUserSelect(e.target.value);
    if (e.target.value === "---") {
      setUserID("0");
    } else {
      const chosenhotel = allUsersList.find(
        (item) => item.userName === e.target.value
      );
      setUserID(chosenhotel.id);
    }
  };

  useEffect(() => {
    updateDataChart();
  }, [userSelect]);

  const allUsersSelect0 = [{ id: 0, userName: "---" }, ...allUsersList];

  const allUsersSelect = allUsersSelect0.map((item) => {
    return (
      <option key={item.id} value={item.userName}>
        {item.userName}
      </option>
    );
  });

  return (
    <Wrapper>
      <div className="bigContainer">
        <MdOutlineClose
          className="closeIcon"
          onClick={() => setOpenMoneyCharts(false)}
        />
        <h3>Zestawienie Zarobków</h3>
        <button className="changeMonthButton">
          {activeMonth ? (
            <>
              {currentMonthYear.toUpperCase()}
              <IoMdArrowDropupCircle onClick={handleChangeMonth} />
            </>
          ) : (
            <>
              {prevMonthYear.toUpperCase()}
              <IoMdArrowDropdownCircle onClick={handleChangeMonth} />
            </>
          )}
        </button>
        <section>
          <h4>
            cały zysk ={" "}
            <span>
              {activeMonth ? monthAdminEarnAll : prevMonthAdminEarnAll} PLN
            </span>
          </h4>
          <h4>
            prowizja hoteli ={" "}
            <span>
              {activeMonth ? monthProvisionAll : prevMonthProvisionAll} PLN
            </span>
          </h4>
        </section>
        <div className="detailsWrapper">
          <div className="detailsWrapper1">
            <label htmlFor="chooseHotel">Wybierz Hotel:</label>
            <select
              name="chooseHotel"
              id="chooseHotel"
              value={userSelect}
              onChange={(e) => handleActiveHotel(e)}
              required
            >
              {allUsersSelect}
            </select>
            {userSelect !== "---" && (
              <article>
                <p>
                  prowizja hotelu ={" "}
                  <span>
                    {activeMonth ? monthProvision : prevMonthProvision} PLN
                  </span>
                </p>
                <p>
                  zysk z hotelu ={" "}
                  <span>
                    {activeMonth ? monthAdminEarn : prevMonthAdminEarn} PLN
                  </span>
                </p>
              </article>
            )}
          </div>
          {userSelect !== "---" && (
            <>
              {activeMonth ? (
                <div className="chart-container">
                  <h4>
                    zarobek <span>{userSelect}</span> do całości
                  </h4>
                  <Pie
                    data={{
                      labels: dataChart.map((data) => data.name),
                      datasets: [
                        {
                          label: "Zysk ",
                          data: [
                            monthAdminEarnAll - monthAdminEarn,
                            monthAdminEarn,
                          ],
                          backgroundColor: ["rgb(255, 250, 233)", "#b99e81"],
                          borderColor: "black",
                          borderWidth: 2,
                        },
                      ],
                    }}
                  />
                </div>
              ) : (
                <div className="chart-container">
                  <h4>
                    zarobek <span>{userSelect}</span> do całości
                  </h4>
                  <Pie
                    data={{
                      labels: dataChart.map((data) => data.name),
                      datasets: [
                        {
                          label: "Zysk ",
                          data: [
                            prevMonthAdminEarnAll - prevMonthAdminEarn,
                            prevMonthAdminEarn,
                          ],
                          backgroundColor: ["rgb(255, 250, 233)", "#b99e81"],
                          borderColor: "black",
                          borderWidth: 2,
                        },
                      ],
                    }}
                  />
                </div>
              )}
            </>
          )}

          {userSelect === "---" && <img src="/images/chartsImg.png" alt="" />}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  border: 4px solid var(--secondaryColor);
  border-radius: 5px;
  color: #222;

  .bigContainer {
    position: absolute;
    width: 100%;
    min-height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 5vh;
    img {
      width: 70%;
      @media screen and (min-width: 901px) {
        width: 40%;
      }
    }
  }
  .closeIcon {
    position: absolute;
    top: 2%;
    right: 5%;
    font-size: 2.5rem;
    color: var(--secondaryColor);
    transition: 0.4s;
    cursor: pointer;
    :hover {
      transform: rotate(180deg);
    }
  }
  h3 {
    text-transform: uppercase;
    text-align: center;
    color: var(--secondaryColor);
    font-size: 1.8rem;
    margin-bottom: 7vh;
    letter-spacing: 2px;
    margin-top: 10vh;
  }
  .changeMonthButton {
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 600;
    font-family: var(--textFont);
    margin-bottom: 5vh;
    svg {
      cursor: pointer;
      margin-left: 10px;
      transition: 0.4s;
      font-size: 1.4rem;
      color: var(--secondaryColor);
      :hover {
        transform: scale(1.1);
      }
      @media screen and (min-width: 901px) {
        font-size: 2rem;
      }
    }
    @media screen and (min-width: 901px) {
      font-size: 1.6rem;
    }
  }
  section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    margin: 0vh auto 5vh;
    width: 100%;
    padding: 20px 10px;
    background-color: #222;
    color: white;

    h4 {
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 1vh;
    }
  }
  .detailsWrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 80%;
    @media screen and (max-width: 900px) {
      flex-direction: column;
      width: 100%;
    }
    .detailsWrapper1 {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 45%;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
    }
    label {
      font-weight: 500;
      font-size: 1.1rem;
      @media screen and (min-width: 901px) {
        font-size: 1.2rem;
      }
    }
    select {
      width: 80%;
      padding: 5px 10px;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      text-align: center;
      font-family: var(--textFont);
      border: 2px solid var(--secondaryColor);
      border-radius: 5px;
      margin: 2vh auto 4vh;
      background-color: var(--secondaryColorLight2);
      @media screen and (min-width: 901px) {
        width: 80%;
        padding: 7px 10px;
        font-size: 1.2rem;
      }
    }
    article {
      p {
        font-weight: 500;
        font-size: 1.1rem;
        text-align: center;
        margin-top: 1vh;
        @media screen and (min-width: 901px) {
          font-size: 1.3rem;
        }
      }
      margin: 3vh auto;
      @media screen and (max-width: 900px) {
        margin: 0 auto 5vh;
      }
    }

    .chart-container {
      margin-top: 3vh;
      width: 40%;
      padding: 0 7%;
      @media screen and (max-width: 900px) {
        width: 80%;
        padding: 0;
      }
      h4 {
        text-align: center;
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 2vh;
        text-transform: uppercase;
        @media screen and (min-width: 901px) {
          font-size: 1.4rem;
        }
      }
    }
  }
  span {
    color: var(--secondaryColor);
    font-weight: 700;
  }
`;

export default MoneySumCharts;
