import styled from "styled-components";
import { useGlobalContext } from "./context";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { MdOutlineClose } from "react-icons/md";

const ImportModal = ({ setOpenImportModal }) => {
  const { uploadData, file, setFile, deleteData } = useGlobalContext();

  const readJsonFile = (file) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target) {
          resolve(JSON.parse(e.target.result));
        }
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });

  const handleChangeFile = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const parsedData = await readJsonFile(e.target.files[0]);
      setFile(parsedData);
    }
  };

  const handleSubmitImport = (e) => {
    e.preventDefault();
    if (file) {
      deleteData();
      uploadData();
      setOpenImportModal(false);
      alert("Baza danych została uaktualniona!");
    }
  };

  useEffect(() => {
    Aos.init({ duration: 1000, offset: -100 });
  }, []);

  return (
    <Wrapper>
      <div className="bigContainer" data-aos="zoom-in">
        <MdOutlineClose
          onClick={() => setOpenImportModal(false)}
          className="closeBtn"
        />
        <h3>Import bazy danych</h3>
        <form onSubmit={(e) => handleSubmitImport(e)}>
          <label htmlFor="upload">
            Wybierz plik z kopią zapasową w formacie JSON.
          </label>
          <input
            type="file"
            id="upload"
            name="upload"
            onChange={(e) => handleChangeFile(e)}
            required
            accept=".json,application/json"
          />
          <button type="submit">Potwierdź</button>
        </form>
        <p>
          UWAGA !!! <br /> Potwierdzając import nowej bazy danych, aktualne
          listy transferów zostaną zastąpione nowymi!
        </p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0%;
  left: 0%;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  .bigContainer {
    width: 50vw;
    min-height: 50vh;
    background: var(--customDarkRed);
    border: 4px solid var(--secondaryColor2);
    border-radius: 5px;
    padding: 30px;
    position: relative;

    @media screen and (max-width: 900px) {
      position: absolute;
      width: 100vw;
      min-height: 100vh;
      top: 0;
      left: 0;
    }
  }
  .closeBtn {
    position: absolute;
    top: 5%;
    right: 5%;
    font-size: 2.5rem;
    color: var(--secondaryColor2);
    transition: 0.4s;
    cursor: pointer;
    :hover {
      transform: rotate(180deg);
    }
    @media screen and (max-width: 1200px) {
      top: 2%;
    }
  }
  h3 {
    text-transform: uppercase;
    text-align: center;
    color: var(--secondaryColor2);
    font-size: 2rem;
    margin-top: 7vh;
    margin-bottom: 7vh;
    letter-spacing: 2px;
    @media screen and (max-width: 1200px) {
      margin-top: 10vh;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 5vh auto;
    label {
      margin-bottom: 2vh;
      text-align: center;
    }
    input {
      font-family: var(--textFont);
      font-weight: 600;
      text-transform: lowercase;
      padding: 5px 10px;
      background: white;
      color: #222;
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
      margin: 5vh auto 0;
      transition: 0.4s;
      font-weight: 600;
      :hover {
        background-color: var(--secondaryColor);
        color: white;
      }
    }
  }
  p {
    text-align: center;
    font-weight: 500;
    @media screen and (max-width: 1200px) {
      margin-top: 10vh;
    }
  }
`;

export default ImportModal;
