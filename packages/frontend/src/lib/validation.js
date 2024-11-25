import { isAddress } from "web3-validator";
import { validate } from "bitcoin-address-validation";

export const isValidEthAddress = (addr) => {
  return isAddress(addr);
};

export const isValidBtcAddress = (addr) => {
  return validate(addr);
};
