const CONFIG = {
  PUBLIC_KEY:
    "BO9u94YZU2Kt19Vhq7uFcG9bHpimZ1zPnQ4Ky2okSN2mi1FzJ61Z_825_n278QwbMOLk37-NHWqwUHhXq7Wz-Kk",
  PRIVATE_KEY: "olIX4Wp8KWJDF-YjrE1A3W3r7-oWNIvOf3rmPquf2Fo",
};

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
};

const registerServiceWorker = async () => {
  return navigator.serviceWorker.register("sw.js");
};

const saveSubscription = async (subscription, title, body, tag) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/push`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription,
      title,
      body,
      tag,
    }),
  });
  return response.json();
};

export const subscribe = async (title, body, tag) => {
  await unregisterServiceWorkers();

  const swRegistration = await registerServiceWorker();
  await Notification.requestPermission();

  try {
    const options = {
      applicationServerKey: CONFIG.PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription, title, body, tag);

    // console.log({ subscription });
  } catch (err) {
    console.error("Error", err);
  }
};
