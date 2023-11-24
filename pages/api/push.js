import webpush, { PushSubscription } from "web-push";
import {
  getSubscriptionsFromDb,
  saveSubscriptionToDb,
} from "../../components/in-memory-db";

const CONFIG = {
  PUBLIC_KEY:
    "BKA8Tv4SCygZtL9oHVZXCsVsb_k2RGnfzZ820f_m4F0GovyhG3UigN9mfmrpXxV6yRWrGNBqt2Ko7o__GF3kly8",
  PRIVATE_KEY: "m_mhR0RrCeWKZYkIlg_MJk_sEszpDK9EhqPXzTrQ7To",
};

webpush.setVapidDetails(
  "mailto:dzarekcoding@gmail.com",
  CONFIG.PUBLIC_KEY,
  CONFIG.PRIVATE_KEY
);
const handler = async (request, response) => {
  if (request.method === "POST") {
    const subscription = request.body;

    if (!subscription) {
      console.error("No subscription was provided!");
      return;
    }

    const updatedDb = await saveSubscriptionToDb(subscription);

    return response.json({ message: "success", updatedDb });
  }
  if (request.method === "GET") {
    const subscriptions = await getSubscriptionsFromDb();

    subscriptions.forEach((s) => {
      const payload = JSON.stringify({
        title: "WebPush Notification!",
        body: "Hello World",
      });
      webpush.sendNotification(s, payload);
    });

    return response.json({
      message: `${subscriptions.length} messages sent!`,
    });
  }
};

export default handler;
