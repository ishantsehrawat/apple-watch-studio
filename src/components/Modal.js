import React, { useEffect, useState } from "react";

export default function Modal({ children, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in effect when the component is mounted
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    // Trigger fade-out effect and close after animation ends
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Close the modal when the background is clicked
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-start pt-[60px] justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackgroundClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg max-w-md relative transition-transform duration-300 `}
      >
        {children}
      </div>
    </div>
  );
}
