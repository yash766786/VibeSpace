import React from "react";
import { useAlert } from "../../context/AlertState.jsx";

function AlertBox() {
  const { alert } = useAlert();

  // Mapping alert types to their respective styles
  const alertStyles = {
    success: "text-green-700 bg-green-100 border-green-500",
    danger: "text-red-800 bg-red-100 border-red-500",
    warning: "text-yellow-700 bg-yellow-100 border-yellow-500",
    info: "text-blue-700 bg-blue-100 border-blue-500",
  };

  return (
    <div
      // className={`ml-auto lg:ml-40 lg:top-0 fixed top-4 right-0 z-50 flex justify-center w-full ${
      //   alert ? "visible" : "invisible"
      // }`}
      className={`lg:ml-80 lg:top-2 fixed top-4 right-0 z-50 flex justify-center lg:w-[50vw] w-[70vw]  ${
        alert ? "visible" : "invisible"
      }`}
    >
      {alert && (
        <div
          className={`w-full right-0 text-xl md:text-2xl lg:text-3xl font-bold pt-1 mb-1 text-center border-l-4 border-b-2 p-2  ${
            alertStyles[alert.type] || "text-gray-700 bg-gray-100 border-gray-500"
          }`}
          role="alert"
        >
          {alert.message}
        </div>
      )}
    </div>
  );
}

export default AlertBox;
