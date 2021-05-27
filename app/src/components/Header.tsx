import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";
import { WalletContext } from "../contexts/WalletContext";
import { WalletTypes } from "../types";
import { LOGO } from "./graphical/LOGO";
import { METAMASK_LOGO } from "./graphical/METAMASK_LOGO";
import { WALLETCONNECT_ICON } from "./graphical/WALLETCONNECT_ICON";

export default function Header() {
  const context = useContext(WalletContext);
  const uIContext = useContext(UIContext);

  const disconnect = () => {
    context.disconnectWallet();
  };

  return (
    <div className="header">
      <div className="header__network">
        {context.user?.chainId === 4 ? "(connected to Rinkeby)" : "MAINNET"}
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
          {uIContext.isDesk && (
            <div className="address-address">
              {context.user && context.user.address}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
