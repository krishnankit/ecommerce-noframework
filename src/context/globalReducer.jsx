export function globalReducer(state, { type, payload }) {
  switch(type) {
    case "LOGIN": {
      localStorage.setItem("user", payload.user);
      return {
        ...state,
        currentUser: payload.user,
      }
    }
    case "LOGOUT": {
      localStorage.removeItem("user");
      return {
        ...state,
        currentUser: null,
      }
    }
    case "DISPLAY_TOAST": {
      return {
        ...state,
        toast: payload,
      }
    }
    case "CLOSE_TOAST": {
      return {
        ...state,
        toast: null,
      }
    }
    default: {
      return state;
    }
  }
}
