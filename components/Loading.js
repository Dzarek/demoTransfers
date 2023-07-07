// const loadingGif = "/images/loading2.gif";
import { GiCarWheel } from "react-icons/gi";

const Loading = () => {
  return (
    <div className="loader">
      {/* <img src={loadingGif} alt="loading" /> */}
      <GiCarWheel />
      <h6 className="loaderTitle">WCZYTYWANIE...</h6>
    </div>
  );
};

export default Loading;
