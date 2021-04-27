import { useContext } from "react";
import { Context, WalletTypes } from "..";
import { LOGO } from "./graphical/LOGO";
import { METAMASK_LOGO } from "./graphical/METAMASK_LOGO";
import { WALLETCONNECT_ICON } from "./graphical/WALLETCONNECT_ICON";

export default function Header() {
  const context = useContext(Context);

  const disconnect = () => {
    context.disconnectWallet();
  };

  return (
    <div className="header">
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 4,
          marginLeft: 2,
          fontSize: window.innerWidth > window.innerHeight ? "1rem" : "10px",
          fontFamily: "Sen",
        }}
      >
        (live on Rinkeby)
      </div>
      <div className="logo">
        <LOGO />
      </div>
      {context.user && context.user.address && (
        <div className="header-address">
          {context.user.type === WalletTypes.WALLET_CONNECT ? (
            <button
              onClick={disconnect}
              style={{ padding: 10, fontSize: 13, marginRight: 10 }}
              className="disconnect-button"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: 20, height: 20 }}>
                  <WALLETCONNECT_ICON />
                </div>
                disconnect
              </div>
            </button>
          ) : (
            <div className="header-address-metamask">
              <METAMASK_LOGO />
            </div>
          )}
          <div className="address-address">
            {context.user && context.user.address}
          </div>
        </div>
      )}
    </div>
  );
}
