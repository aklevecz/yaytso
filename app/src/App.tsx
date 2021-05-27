import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Collection from "./containers/Collection";
import Create from "./containers/Create";
import Nav from "./containers/Nav";
import World from "./containers/World";
import Header from "./components/Header";
import EggViewer from "./containers/EggViewer";
import Map from "./containers/Map";
import Wallet from "./containers/Wallet";
import Discover from "./containers/Discover";

function App() {
  const [bodyHeight, setBodyHeight] = useState(0);

  useEffect(() => {
    const { height: headerHeight } = document
      .querySelector(".header")!
      .getBoundingClientRect();
    const { height: footerHeight } = document
      .querySelector(".nav-container")!
      .getBoundingClientRect();

    setBodyHeight(window.innerHeight - footerHeight - headerHeight);
  }, []);

  return (
    <div className="App">
      <Header />
      <div
        style={{
          height: bodyHeight,
        }}
        className="container-of-containerz"
      >
        <Router>
          <Switch>
            <Route path="/world" component={World} />
            <Route path="/map" component={Map} />
            <Route path="/collection" component={Collection} />
            <Route path="/egg/:id" component={EggViewer} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/discover/:sig/:bId/:nonce" component={Discover} />
            <Route path="/" component={Create} />
          </Switch>
          <Nav />
        </Router>
      </div>
    </div>
  );
}

export default App;
