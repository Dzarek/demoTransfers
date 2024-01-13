import webpush from "web-push";
import { query } from "../../lib/db";

// const CONFIG = {
//   PUBLIC_KEY:
//     "BO9u94YZU2Kt19Vhq7uFcG9bHpimZ1zPnQ4Ky2okSN2mi1FzJ61Z_825_n278QwbMOLk37-NHWqwUHhXq7Wz-Kk",
//   PRIVATE_KEY: "olIX4Wp8KWJDF-YjrE1A3W3r7-oWNIvOf3rmPquf2Fo",
// };
// webpush.setVapidDetails(
//   "mailto:dzarekcoding@gmail.com",
//   CONFIG.PUBLIC_KEY,
//   CONFIG.PRIVATE_KEY
// );

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_WEB_PUSH_EMAIL,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_WEB_PUSH_PRIVATE_KEY
);

const handler = async (request, response) => {
  if (request.method === "POST") {
    const subscriptionMain = await request.body;
    if (!subscriptionMain) {
      console.error("No subscription was provided!");
      return;
    }
    const { tag, title, body, subscription } = subscriptionMain;
    const { endpoint, expirationTime, keys } = subscription;
    const { p256dh, auth } = keys;
    const addProduct = await query({
      query:
        "INSERT INTO notifications (tag, title, body, endpoint, expirationTime, p256dh, auth) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values: [tag, title, body, endpoint, expirationTime, p256dh, auth],
    });

    return response.json({ message: "success", addProduct });
  }
  if (request.method === "GET") {
    const notifyMsql = await query({
      query: "SELECT * FROM notifications",
      values: [],
    });

    const subscriptions = notifyMsql;
    subscriptions.forEach(async (s) => {
      const oneSubscription = subscriptions[subscriptions.length - 1];
      const { endpoint, expirationTime, p256dh, auth } = s;
      const subscription = { endpoint, expirationTime, keys: { p256dh, auth } };
      const payload = JSON.stringify({
        title: oneSubscription.title,
        body: oneSubscription.body,
        tag: oneSubscription.tag,
      });
      await webpush.sendNotification(subscription, payload);
    });
    const deleteProduct = await query({
      query:
        "DELETE t1 FROM notifications t1 JOIN notifications t2 ON t1.auth = t2.auth AND t1.id < t2.id",
    });
    return response.json({
      message: `${notifyMsql.length} messages sent!`,
      deleteProduct,
    });
  }
};

export default handler;
