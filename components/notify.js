import { useEffect } from "react";
const CONFIG = {
  PUBLIC_KEY:
    "BO9u94YZU2Kt19Vhq7uFcG9bHpimZ1zPnQ4Ky2okSN2mi1FzJ61Z_825_n278QwbMOLk37-NHWqwUHhXq7Wz-Kk",
  PRIVATE_KEY: "olIX4Wp8KWJDF-YjrE1A3W3r7-oWNIvOf3rmPquf2Fo",
};

export default function Notifications() {
  useEffect(() => {
    const notificationsSupported = () =>
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    if (!notificationsSupported()) {
      return alert("Please install the PWA first!");
    }
  }, []);

  return (
    <div style={{ zIndex: "9999999999999999999", position: "fixed" }}>
      <h3>WebPush PWA</h3>
      <button onClick={subscribe}>Ask permission and subscribe!</button>
    </div>
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
    body: JSON.stringify({
      subscription: subscription,
      title: "notifyTitle",
      body: "notifyText",
      tag: "notifyTag",
    }),
  });
  return response.json();
};
