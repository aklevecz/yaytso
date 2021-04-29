import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/create.css";
import "./styles/egg.css";
import "./styles/upload.css";
import "./styles/nav.css";
import "./styles/collection.css";
import "./styles/viewer.css";
import "./styles/modal.css";
import App from "./App";
import CanvasProvider from "./contexts/CanvasContext";
import UIProvider from "./contexts/UIContext";
import WalletContextProvider from "./contexts/WalletContext";

declare global {
  interface Window {
    ethereum: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <CanvasProvider>
      <WalletContextProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </WalletContextProvider>
    </CanvasProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
