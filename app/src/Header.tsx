import { LOGO } from "./components/graphical/LOGO";

export default function Header() {
  return (
    <div className="header">
      <div
        style={{
          position: "absolute",
          top: 2,
          right: 4,
          marginLeft: 2,
          fontSize: window.innerWidth > window.innerHeight ? "1rem" : "10px",
        }}
      >
        (live on Rinkeby)
      </div>
      <div className="logo">
        <LOGO />
      </div>
    </div>
  );
}
