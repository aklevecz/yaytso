import { useContext, useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { WalletContext } from "../contexts/WalletContext";
import { NAV } from "../components/graphical/NAV";
import { UIContext } from "../contexts/UIContext";
import WhichWallet from "./modals/WhichWallet";

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
  const [pickWallet, setPickWallet] = useState(false);
  const context = useContext(WalletContext);
  const history = useHistory();

  const { isDesk } = useContext(UIContext);

  const connectMetamask = () => context.web3Connect();
  const connectWalletConnect = () => context.connectWalletConnect();

  useEffect(() => {
    eggNav().onclick = () => {
      history.push("/");
    };
    collectionNav().onclick = () => history.push("/collection");
    worldNav().onclick = () => history.push("/map");

    if (isDesk) {
      setOpenNav(true);
    }

    window.onclick = (e: any) => {
      if (isDesk) {
        return;
      }
      if (e.target.className === "nav-container") {
        return;
      }
      if (
        e.target.parentElement === null ||
        (e.target.parentElement &&
          e.target.parentElement.className !== "nav-container")
      ) {
        setOpenNav(false);
      }
    };
  }, [isDesk, history]);

  useEffect(() => {
    clear();
    const path = history.location.pathname;
    if (path === "/") {
      eggNav().classList.add("active");
    } else if (path === "/collection") {
      collectionNav().classList.add("active");
    } else if (path === "/map") {
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
      {!isDesk && (
        <div
          onClick={() => setOpenNav(!openNav)}
          style={{
            bottom: openNav ? 100 : 5,
            left: openNav ? 0 : 5,
            background: openNav
              ? "linear-gradient(#e488ff, lightgrey)"
              : "black",
            borderRadius: openNav ? "0px 10px 0px 0" : 40,
          }}
          className="nav-button"
        ></div>
      )}
      {!context.user?.address && (
        <button
          className="web3-connect"
          style={{ bottom: openNav ? 100 : 5 }}
          // onClick={() => context.web3Connect()}
          onClick={() => setPickWallet(true)}
        >
          connect to web3
        </button>
      )}
      {!context.user?.address && pickWallet && (
        <WhichWallet
          setPickWallet={setPickWallet}
          connectMetamask={connectMetamask}
          connectWalletConnect={connectWalletConnect}
        />
      )}
    </div>
  );
}

export default withRouter(Nav);
