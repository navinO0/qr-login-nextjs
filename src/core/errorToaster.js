import React, { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const ErroToaster = ({ message }) => {
  const toastIdRef = useRef(null);
  const timeoutRef = useRef(null); // Store timeout reference

  useEffect(() => {
    if (message) {
      // Prevent multiple toasts
      if (!toastIdRef.current || !toast.isActive(toastIdRef.current)) {
        timeoutRef.current = setTimeout(() => {
          toastIdRef.current = toast.error(message, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
            transition: Bounce,
          });
        }, 50); // 2-second delay before showing toast
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message]); // Runs only when `message` changes

  return <ToastContainer />;
};

export default ErroToaster;
