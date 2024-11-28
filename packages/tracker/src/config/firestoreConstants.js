export const COLLECTIONS = {
  USERS: "users",
  BTC_ADDRESSES: "btc_addresses",
  ETH_ADDRESSES: "eth_addresses",
  ETH_TXS: (addr, hash) => `eth_addresses/${addr}/transactions/${hash}`,
  BTC_TXS: (addr, hash) => `btc_addresses/${addr}/transactions/${hash}`,
  TOKENS: "tokens",
};
