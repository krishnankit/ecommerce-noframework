export function globalReducer(state, { type, payload }) {
  switch(type) {
    case "LOGIN": {
      localStorage.setItem("user", JSON.stringify(payload.user));
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
        toast: {
          ...payload,
          show: true,
        },
      }
    }
    case "CLOSE_TOAST": {
      return {
        ...state,
        toast: {
          ...state.toast,
          show: false,
        },
      }
    }
    default: {
      return state;
    }
  }
}
