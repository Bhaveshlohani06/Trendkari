import React, { useEffect, useState } from "react";
import "./whatsapp.css";

const WhatsappPopup = ({ onClose, autoOpen = true, openDelay = 1500 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Auto open after delay
  useEffect(() => {
    if (autoOpen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, openDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpen, openDelay]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="whatsapp-popup-container">
      <div className="whatsapp-popup-card">
        {/* Close button */}
        <button onClick={handleClose} className="whatsapp-popup-close">
          ×
        </button>

        <h4 className="whatsapp-popup-title">📢 Join Our WhatsApp Group</h4>
        <p className="whatsapp-popup-text">
          Stay updated with breaking news, trending updates, and alerts directly on WhatsApp!
        </p>

        <a
          href="https://chat.whatsapp.com/DHQzCIaKx2m3g4kGBu9Iml"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-popup-join"
        >
          Join Now
        </a>

        <button onClick={handleClose} className="whatsapp-popup-later">
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default WhatsappPopup;
