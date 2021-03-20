import { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { NAV } from "../NAV";

function Nav() {
  const [openNav, setOpenNav] = useState(false);
  const history = useHistory();

  useEffect(() => {
    document.getElementById("EGG-NAV")!.onclick = () => {
      console.log("hey");
      history.push("/");
    };
    document.getElementById("COLLECTION")!.onclick = () =>
      history.push("/collection");
  });
  return (
    <div style={{ height: openNav ? "100px" : "0%" }} className="nav-container">
      <NAV />
      <div
        onClick={() => setOpenNav(!openNav)}
        style={{
          bottom: openNav ? 100 : 5,
          background: openNav ? "red" : "black",
          borderRadius: openNav ? 0 : 40,
        }}
        className="nav-button"
      ></div>
    </div>
  );
}

export default withRouter(Nav);
