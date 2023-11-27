const CONFIG = {
  PUBLIC_KEY:
    "BKA8Tv4SCygZtL9oHVZXCsVsb_k2RGnfzZ820f_m4F0GovyhG3UigN9mfmrpXxV6yRWrGNBqt2Ko7o__GF3kly8",
  PRIVATE_KEY: "m_mhR0RrCeWKZYkIlg_MJk_sEszpDK9EhqPXzTrQ7To",
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
