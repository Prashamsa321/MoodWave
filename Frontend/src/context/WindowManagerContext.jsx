import { createContext, useContext } from "react";

const WindowManagerContext = createContext(null);

export function WindowManagerProvider({ value, children }) {
  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  return useContext(WindowManagerContext);
}
