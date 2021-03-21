import { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { NAV } from "../NAV";

const eggNav = (): HTMLElement => document.getElementById("EGG-NAV")!
const collectionNav = ():HTMLElement => document.getElementById("COLLECTION")!
const worldNav = ():HTMLElement => document.getElementById("WORLD")!

const clear = () => {
  eggNav().classList.remove("active")
  collectionNav().classList.remove("active")
  worldNav().classList.remove("active")
}

function Nav() {
  const [openNav, setOpenNav] = useState(false);
  const history = useHistory();

  useEffect(() => {
    eggNav().onclick = () => {
      history.push("/");
    };
    collectionNav().onclick = () =>
      history.push("/collection");
      worldNav().onclick = () => history.push("/world")
  },[]);

  useEffect(() => {
    clear()
    const path = history.location.pathname;
    if (path === "/") {
      eggNav().classList.add("active")
    } else if (path === "/collection") {
      collectionNav().classList.add("active")
    } else if (path === "/world") {
      worldNav().classList.add("active")
    }
  })
  const openHeight = window.innerWidth > 768 ? "130px" : "100px" 
  return (
    <div style={{ height: openNav ?openHeight : "0%" }} className="nav-container">
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
