import { useState } from "react";
import Header from "./Header/Heder.jsx";
import Menu from "./Menu/Menu.jsx";

function App() {
  const [menuVisablity, toggleMenuVisability] = useState(true);
  const [algName, setAlgName] = useState("");

  const toggleMenu = () => {
    toggleMenuVisability(!menuVisablity);
    console.log("clicked");
  };

  const doAnimation_ = (newName) => {
    setAlgName("  ⇾   " + newName);
  };

  return (
    <div>
      <Header toggle={toggleMenu} algName={algName} />
      <Menu menuToggle={menuVisablity} doAnimation={doAnimation_} />
    </div>
  );
}

export default App;
