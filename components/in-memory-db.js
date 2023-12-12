export const dummyDb = { subscriptions: [] };

// fake Promise to simulate async call
export const saveSubscriptionToDb = async (subscriptionA) => {
  dummyDb.subscriptions.push({
    title: subscriptionA.title,
    body: subscriptionA.body,
    tag: subscriptionA.tag,
    subscription: subscriptionA.subscription,
  });

  return Promise.resolve(dummyDb);
};

export const getSubscriptionsFromDb = () => {
  return Promise.resolve(dummyDb.subscriptions);
  a;
};

// export let dummyDb = { subscriptions: [] };

// export const saveSubscriptionToDb = async (subscriptionA) => {
//   dummyDb.subscriptions = [
//     {
//       title: subscriptionA.title,
//       body: subscriptionA.body,
//       tag: subscriptionA.tag,
//       subscription: subscriptionA.subscription,
//     },
//   ];

//   return Promise.resolve(dummyDb);
// };

// export const getSubscriptionsFromDb = () => {
//   return Promise.resolve(dummyDb.subscriptions);
// };
