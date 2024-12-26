import { useState, useEffect } from "react";

const OfflineNotification = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Define event listeners for online and offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    !isOnline && (
      <div className="sticky top-0 my-5 left-0 right-0 w-full bg-red-400 text-white text-center py-2 z-50">
        <p className="font-semibold text-sm opacity-1">
          You are currently offline. Some features may not be available.
        </p>
      </div>
    )
  );
};

export default OfflineNotification;
