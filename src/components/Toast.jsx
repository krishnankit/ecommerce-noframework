import React, { useContext } from "react";
import { globalContext } from "../context/globalState";

function Toast() {
  const { globalState: { toast }, closeToast } = useContext(globalContext);

  if (!toast) return;

  const getBgColor = {
    "info": "secondary",
    "success": "green",
    "error": "red"
  }

  return (
    <div className="absolute px-3 py-2 left-1/2 top-5 -translate-x-1/2 flex items-center bg-white shadow-lg gap-3">
      <div className={`bg-${getBgColor[toast.type] || "secondary"} w-2 h-8`}></div>
      <p className="ml-2">{toast.message}</p>
      <button
        className="cursor-pointer"
        onClick={closeToast}
      >
        <svg
          viewBox="0 0 12 12"
          width="12"
          height="12"
        >
          <line
            x1="0" y1="0"
            x2="12" y2="12"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1="0" y1="12"
            x2="12" y2="0"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
