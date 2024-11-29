export const decodeAddress = (hex) => {
  return hex.replace("000000000000000000000000", "");
};

export const encodeAddress = (hex) => {
  return `0x000000000000000000000000${hex.replace(/^0x/, "")}`;
};
