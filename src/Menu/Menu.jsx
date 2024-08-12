import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Menu.css";
import Stage from "../AnimationStage/Stage.jsx";

const menuData = [
  {
    title: "Simple Data types",
    subMenu: ["Stacks", "Queues", "Stacks-linkedList", "Queues-linkedList"],
  },
  {
    title: "Searching Algorithms",
    subMenu: ["Linear Search", "Binary Search"],
  },
  {
    title: "Sorting",
    subMenu: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Heap Sort"],
  },

  {
    title: "Graph Algorithms",
    subMenu: [
      "Breath First Search",
      "Depth First Search",
      "Dijkstra's Alg",
      "A* Alg",
    ],
  },
  {
    title: "Dynamic Programming",
    subMenu: [],
  },
];

function Menu({ menuToggle, doAnimation }) {
  const [width, setWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [algAnimation, setAlg] = useState(null);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      setWidth(e.pageX);
      // console.log(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleSubMenuClick = (alg) => {
    setAlg(alg);
    doAnimation(alg);
    console.log(algAnimation); //testing
  };

  //changes the width to 0 when menutoogle is false
  useEffect(() => {
    if (!menuToggle) {
      setWidth(0);
    } else {
      setWidth(250);
    }
  }, [menuToggle]);

  return (
    <>
      <div
        className="expandable-container"
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div style={menuToggle ? { width: width } : { width: 0 }}>
          <div
            className="dropdown-menu"
            style={menuToggle ? { width: width } : { width: 0 }}
          >
            {menuData.map((menuItem, index) => (
              <div key={index} className="menu-item">
                <div
                  className="menu-title"
                  onClick={() => handleMenuClick(index)}
                >
                  {menuItem.title}
                </div>
                {activeMenu === index && menuItem.subMenu.length > 0 && (
                  <div className="submenu">
                    {menuItem.subMenu.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="submenu-item"
                        onClick={() => handleSubMenuClick(subItem)} // this is where the logiic of which animation should be passed goes
                      >
                        {subItem}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="resize" onMouseDown={handleMouseDown}></div>
        <Stage Animation_name={algAnimation} menuWidth={width} />
      </div>
    </>
  );
}

Menu.prototype = {
  toggle: PropTypes.func.isRequired,
};
export default Menu;
