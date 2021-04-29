import { createContext, useEffect, useState } from "react";

type UIContextTypes = {
  isDesk: boolean | null;
};

export const UIContext = createContext<UIContextTypes>({
  isDesk: null,
});

const UIProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [isDesk, setIsDesk] = useState(window.innerWidth > 768);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setIsDesk(true);
      } else {
        setIsDesk(false);
      }
    };

    window.addEventListener("resize", onResize, false);

    return () => window.removeEventListener("resize", onResize, false);
  }, []);
  return <UIContext.Provider value={{ isDesk }}>{children}</UIContext.Provider>;
};

export default UIProvider;
