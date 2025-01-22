import React, { createContext, useReducer } from "react";
import { globalReducer } from "./globalReducer";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) ?? null,
  toast: {
    message: "",
    type: "",
    show: false,
  },
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
        type,
        show: true,
      }
    });
  }

  function closeToast() {
    dispatch({
      type: "CLOSE_TOAST",
      payload: {
        show: false,
      }
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
