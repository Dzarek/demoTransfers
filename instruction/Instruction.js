import styled from "styled-components";
import { MdOutlineClose } from "react-icons/md";
import { useGlobalContext } from "../components/context";
import { useState } from "react";

const hotelMenu = [
  {
    id: 1,
    name: "menu",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 2,
    name: "strona główna",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 3,
    name: "dodaj transfer",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 4,
    name: "lista transferów",
    video: "/instructionVideo/menu.webm",
  },
];
const adminMenu = [
  {
    id: 1,
    name: "menu",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 2,
    name: "strona główna",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 3,
    name: "lista transferów",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 4,
    name: "zarządzanie hotelem",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 5,
    name: "zyski i prowizje",
    video: "/instructionVideo/menu.webm",
  },
  {
    id: 6,
    name: "export i inport danych",
    video: "/instructionVideo/menu.webm",
  },
];

const Instruction = ({ setShowInstruction }) => {
  const { isAdmin } = useGlobalContext();
  const [activeTip, setActiveTip] = useState(hotelMenu[0]);

  return (
    <Wrapper>
      <div className="bigContainer">
        <MdOutlineClose
          className="closeIcon"
          onClick={() => setShowInstruction(false)}
        />
        <h1>
          Instrukcja użytkowania aplikacji
          <br /> dla {isAdmin ? "ADMINISTRATORA" : "HOTELU"}
        </h1>
        {isAdmin ? (
          <div className="instructionWrapper"></div>
        ) : (
          <div className="instructionWrapper">
            <ul>
              {hotelMenu.map((item) => {
                return (
                  <li
                    key={item.id}
                    onClick={() => setActiveTip(item)}
                    className={activeTip === item ? "activeTip" : ""}
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
            <video
              src={activeTip.video}
              controls
              playsInline
              type="video/mp4"
              className="video"
            ></video>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  z-index: 10000000000000000000000000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  /* overflow-y: auto; */
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  /* @media screen and (max-width: 900px) {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  } */
  .bigContainer {
    width: 80vw;
    height: 80vh;
    padding: 20px;
    background: white;
    border: 5px solid var(--secondaryColor);
    border-radius: 5px;
    position: relative;
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
  h1 {
    text-transform: uppercase;
    text-align: center;
    color: var(--secondaryColor);
    font-size: 1.6rem;
    margin-top: 5vh;
    margin-bottom: 10vh;
    letter-spacing: 2px;
    @media screen and (max-width: 1200px) {
      margin-top: 10vh;
    }
  }
  .instructionWrapper {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .video {
      height: 40vh;
      border: 1px solid #aaa;
      border-radius: 5px;
    }
    ul {
      width: 28%;
      padding: 2vh 0;
      border-right: 2px solid #222;

      li {
        margin-top: 2vh;
        margin-bottom: 2vh;
        font-size: 1.1rem;
        cursor: pointer;
        transition: 0.4s;
        width: 100%;
        :hover {
          color: var(--secondaryColor);
        }
      }
      .activeTip {
        color: var(--secondaryColor);
        font-weight: 600;
        margin-left: 20%;
      }
    }
  }
`;

export default Instruction;
