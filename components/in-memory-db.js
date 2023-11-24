export const dummyDb = { subscriptions: [] };

// fake Promise to simulate async call
export const saveSubscriptionToDb = async (subscription) => {
  dummyDb.subscriptions.push(subscription);
  return Promise.resolve(dummyDb);
};

export const getSubscriptionsFromDb = () => {
  return Promise.resolve(dummyDb.subscriptions);
};
