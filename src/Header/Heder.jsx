import "./Header.css";
import img from "../assets/github.svg";

import PropTypes from "prop-types";

function Header({ toggle, algName }) {
  const link =
    " https://github.com/Dagmbisrat/Data-and-Algorithm-Visualizer.git";

  return (
    <>
      <header>
        <button className="tittle-button" onClick={toggle}>
          Algorithm Visualizer{algName}
        </button>
        <a className="imgCover" href={link} target="_blank">
          <img className="gitIMG" src={img} />
        </a>
      </header>
    </>
  );
}
Header.prototype = {
  toggle: PropTypes.func.isRequired,
};
export default Header;
