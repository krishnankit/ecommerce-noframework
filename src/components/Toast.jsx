import React, { useContext, useEffect } from "react";
import { globalContext } from "../context/globalState";

function Toast() {
  const { globalState: { toast }, closeToast } = useContext(globalContext);

  const colors = {
    "info": "indigo-500",
    "success": "green-600",
    "error": "red-700"
  }

  const toastColor = colors[toast?.type] || "indigo-500";

  useEffect(() => {
    if (toast.show) {
      setTimeout(closeToast, 2000);
    }
  }, [toast.show])

  return (
    <div
      className={`fixed min-w-[6rem] px-5 py-2 left-1/2 -top-40 -translate-x-1/2 flex items-center gap-3  bg-gray-50 rounded shadow-sm transition duration-300`}
      style={{
        transform: toast.show ? "translate(-50%, 11rem)" : ""
      }}
    >
      <div className={`bg-${toastColor} w-6 h-6 rounded-[50%]`}></div>
      <p className="ml-2">{toast?.message}</p>
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
