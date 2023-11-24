import { useEffect } from "react";
const CONFIG = {
  PUBLIC_KEY:
    "BKA8Tv4SCygZtL9oHVZXCsVsb_k2RGnfzZ820f_m4F0GovyhG3UigN9mfmrpXxV6yRWrGNBqt2Ko7o__GF3kly8",
  PRIVATE_KEY: "m_mhR0RrCeWKZYkIlg_MJk_sEszpDK9EhqPXzTrQ7To",
};

// useEffect(() => {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker
//       .register("sw.js")
//       .then(function (registration) {
//         console.log(
//           "Service Worker registered with scope:",
//           registration.scope
//         );
//       })
//       .catch(function (error) {
//         console.error("Service Worker registration failed:", error);
//       });
//   }
//   if ("Notification" in window) {
//     Notification.requestPermission().then(function (permission) {
//       if (permission === "granted") {
//         console.log("Notification permission granted.");
//       }
//     });
//   }
// }, []);

export default function Notifications() {
  useEffect(() => {
    const notificationsSupported = () =>
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    if (!notificationsSupported()) {
      return <h3>Please install the PWA first!</h3>;
    }
  }, []);

  return (
    <>
      <h3>WebPush PWA</h3>
      <button onClick={subscribe}>Ask permission and subscribe!</button>
    </>
  );
}

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
};

const registerServiceWorker = async () => {
  return navigator.serviceWorker.register("sw.js");
};

const subscribe = async () => {
  await unregisterServiceWorkers();

  const swRegistration = await registerServiceWorker();
  await Notification.requestPermission();

  try {
    const options = {
      applicationServerKey: CONFIG.PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription);

    console.log({ subscription });
  } catch (err) {
    console.error("Error", err);
  }
};

const saveSubscription = async (subscription) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/push`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};
