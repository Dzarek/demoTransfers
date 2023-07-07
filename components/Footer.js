import styled from "styled-components";
import { MdPhoneAndroid } from "react-icons/md";
import {
  footerCompanyContact,
  footerCompanyContactAHref,
} from "../companyInfo/CompanyInfo";

const logoJarek = "/images/logoJarek.png";

const Footer = () => {
  return (
    <Wrapper>
      {/* DEMO VERSION */}
      <a className="logoJarek" href="https://www.jarekjanas.com">
        <p>projekt i wykonanie</p>
        <img src={logoJarek} alt="logo Jarosław Janas" />
      </a>{" "}
      {/* END DEMO VERSION */}
      <p className="allRights">
        &copy; {new Date().getFullYear()} Jarosław Janas. Wszelkie prawa
        zastrzeżone.
      </p>
      <a href={footerCompanyContactAHref} className="phone">
        <MdPhoneAndroid /> <span>{footerCompanyContact}</span>
      </a>
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  width: 100vw;
  height: 6vh;
  background: #111;
  border-top: 4px solid var(--secondaryColor);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3vw;
  @media screen and (max-width: 900px) {
    min-height: 25vh;
    height: auto;
    padding: 0vh 3vw 2vh;
    flex-direction: column-reverse;
  }
  .allRights {
    font-size: 0.9rem;
    text-align: center;
  }
  .phone {
    text-decoration: none;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    transition: 0.4s;
    @media screen and (max-width: 900px) {
      width: 100vw;
      padding: 3vh 1vw;
      background-color: #000;
      font-weight: 600;
    }
    svg {
      margin-right: 10px;
      font-size: 1.2rem;
    }
    :hover {
      color: var(--secondaryColor);
    }
  }
  .logoJarek {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-decoration: none;
    img {
      width: 25px;
      height: 25px;
      margin-left: 10px;
      transition: 0.4s;
      opacity: 0.8;
    }
    p {
      font-size: 12px;
      letter-spacing: 1px;
      transition: 0.4s;
    }
    :hover img {
      filter: invert(100%);
    }
    :hover p {
      color: var(--secondaryColor);
    }
  }
`;

export default Footer;
