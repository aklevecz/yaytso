import { useContext, useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { Context } from "..";
import { NAV } from "../components/graphical/NAV";

const eggNav = (): HTMLElement => document.getElementById("EGG-NAV")!;
const collectionNav = (): HTMLElement => document.getElementById("COLLECTION")!;
const worldNav = (): HTMLElement => document.getElementById("WORLD")!;

const clear = () => {
  eggNav().classList.remove("active");
  collectionNav().classList.remove("active");
  worldNav().classList.remove("active");
};

function Nav() {
  const [openNav, setOpenNav] = useState(false);
  const context = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    eggNav().onclick = () => {
      history.push("/");
    };
    collectionNav().onclick = () => history.push("/collection");
    worldNav().onclick = () => history.push("/world");

    window.onclick = (e: any) => {
      if (
        e.target.parentElement === null ||
        (e.target.parentElement &&
          e.target.parentElement.className !== "nav-container")
      ) {
        setOpenNav(false);
      }
    };
  }, []);

  useEffect(() => {
    clear();
    const path = history.location.pathname;
    if (path === "/") {
      eggNav().classList.add("active");
    } else if (path === "/collection") {
      collectionNav().classList.add("active");
    } else if (path === "/world") {
      worldNav().classList.add("active");
    }
  });
  const openHeight = window.innerWidth > 768 ? "130px" : "100px";
  return (
    <div
      style={{ height: openNav ? openHeight : "0%" }}
      className="nav-container"
    >
      <NAV />
      <div
        onClick={() => setOpenNav(!openNav)}
        style={{
          bottom: openNav ? 100 : 5,
          left: openNav ? 0 : 5,
          background: openNav ? "linear-gradient(#e488ff, lightgrey)" : "black",
          borderRadius: openNav ? "0px 10px 0px 0" : 40,
        }}
        className="nav-button"
      ></div>
      {!context.user?.address && (
        <button
          className="web3-connect"
          style={{ bottom: openNav ? 100 : 5 }}
          onClick={() => context.web3Connect()}
        >
          connect to web3
        </button>
      )}
    </div>
  );
}

export default withRouter(Nav);
