import webpush from "web-push";
import {
  getSubscriptionsFromDb,
  saveSubscriptionToDb,
} from "../../components/in-memory-db";

const CONFIG = {
  PUBLIC_KEY:
    "BO9u94YZU2Kt19Vhq7uFcG9bHpimZ1zPnQ4Ky2okSN2mi1FzJ61Z_825_n278QwbMOLk37-NHWqwUHhXq7Wz-Kk",
  PRIVATE_KEY: "olIX4Wp8KWJDF-YjrE1A3W3r7-oWNIvOf3rmPquf2Fo",
};
webpush.setVapidDetails(
  "mailto:dzarekcoding@gmail.com",
  CONFIG.PUBLIC_KEY,
  CONFIG.PRIVATE_KEY
);
const handler = async (request, response) => {
  if (request.method === "POST") {
    const subscriptionA = await request.body;
    if (!subscriptionA) {
      console.error("No subscription was provided!");
      return;
    }

    const updatedDb = await saveSubscriptionToDb(subscriptionA);

    return response.json({ message: "success", updatedDb });
  }
  if (request.method === "GET") {
    const subscriptions = await getSubscriptionsFromDb();
    console.log(subscriptions);
    subscriptions.forEach((s) => {
      const payload = JSON.stringify({
        title: s.title,
        body: s.body,
        tag: s.tag,
      });
      webpush.sendNotification(s.subscription, payload);
    });
    // const oneSubscription = subscriptions[0];
    // const payload = JSON.stringify({
    //   title: oneSubscription.title,
    //   body: oneSubscription.body,
    //   tag: oneSubscription.tag,
    // });
    // webpush.sendNotification(oneSubscription.subscription, payload);

    return response.json({
      message: `${subscriptions.length} messages sent!`,
    });
  }
};

export default handler;
