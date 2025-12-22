"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const AgeVerification: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const ageVerified = Cookies.get("ageVerified");
    if (!ageVerified) {
      setVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    Cookies.set("ageVerified", "true", { expires: 365, path: "/" });
    setVisible(false);
  };

  const handleDecline = () => {
    setVisible(false);
    router.push("/ota-yhteytta");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          onClick={handleDecline}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="text-center space-y-4 sm:space-y-6 pr-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Aldersverifisering
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Du må være 18 år eller eldre for å gå inn.
          </p>

          <div className="pt-2 sm:pt-4">
            <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Er du 18 år eller eldre?
            </p>
            <div className="flex gap-3 sm:gap-4">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 text-base sm:text-lg font-medium transition-colors"
              >
                Ja
              </Button>
              <Button
                onClick={handleDecline}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 text-base sm:text-lg font-medium transition-colors"
              >
                Nei
              </Button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-2 sm:pt-4">
            Ved å gå inn godtar du våre vilkår.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
