import React, { createContext, useReducer } from "react";
import { globalReducer } from "./globalReducer";

const initialState = {
  currentUser: localStorage.getItem("user") ?? null,
  toast: null,
}

export const globalContext = createContext(initialState);

export function GlobalContextProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  function login(user) {
    dispatch({
      type: "LOGIN",
      payload: { user }
    });
  }

  function logout() {
    dispatch({
      type: "LOGOUT",
      payload: {}
    })
  }

  function displayToast({ message, type }) {
    dispatch({
      type: "DISPLAY_TOAST",
      payload: {
        message,
        type
      }
    });
  }

  function closeToast() {
    dispatch({
      type: "CLOSE_TOAST",
      payload: {}
    });
  }

  return (
    <globalContext.Provider
      value={{
        globalState: state,
        login,
        logout,
        displayToast,
        closeToast,
      }}
    >
      { children }
    </globalContext.Provider>
  );
}
