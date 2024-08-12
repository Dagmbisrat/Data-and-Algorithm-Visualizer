import "./Header.css";
import img from "../assets/github.svg";

import PropTypes from "prop-types";
import React, { useState } from "react";

function Header({ toggle, algName }) {
  const [isLoading, setIsLoading] = useState(false);
  const link =
    " https://github.com/Dagmbisrat/Data-and-Algorithm-Visualizer.git";

  const refreshPage = () => {
    setIsLoading(true); // Set loading to true
    window.location.reload();
  };
  return (
    <>
      <header>
        <button className="tittle-button" onClick={toggle}>
          Algorithm Visualizer{algName}
        </button>
        <div class="right-buttons">
          {/* <button class="home-button" onClick={refreshPage}>
            {isLoading ? (
              <span class="load-icon">◌</span>
            ) : (
              <span class="home-icon">⌂</span>
            )}
          </button> */}
          <a className="imgCover" href={link} target="_blank">
            <img className="gitIMG" src={img} />
          </a>
        </div>
      </header>
    </>
  );
}
Header.prototype = {
  toggle: PropTypes.func.isRequired,
};
export default Header;
