"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = Cookies.get("CookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("CookieConsent", "accepted", { expires: 365, path: "/" });
    setVisible(false);
  };

  const handleDecline = () => {
    Cookies.set("CookieConsent", "declined", { expires: 365, path: "/" });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-black font-medium">
            This website uses cookies to improve your experience.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-black text-white font-medium transition-colors duration-200 hover:bg-gray-800"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-white text-black border border-black font-medium transition-colors duration-200 hover:bg-gray-100"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
