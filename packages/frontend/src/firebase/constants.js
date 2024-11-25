export const COLLECTIONS = {
  USERS: "users",
  BTC_SUBSCRIPTIONS: (uid) => `users/${uid}/btc_subscriptions`,
  ETH_SUBSCRIPTIONS: (uid) => `users/${uid}/eth_subscriptions`,
  BTC_ADDRESSES: "btc_addresses",
  ETH_ADDRESSES: "eth_addresses",
  ETH_TXS: (addr, hash) => `eth_addresses/${addr}/transactions/${hash}`,
  BTC_TXS: (addr) => `btc_addresses/${addr}/transactions`,
  TOKENS: "tokens",
};
