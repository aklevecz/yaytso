import { useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Collection from "./containers/Collection";
import Create from "./containers/Create";
import Nav from "./containers/Nav";
import World from "./containers/World";
import Header from "./Header";

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
            <Route path="/collection" component={Collection} />
            <Route path="/" component={Create} />
          </Switch>
          <Nav />
        </Router>
      </div>
    </div>
  );
}

export default App;
