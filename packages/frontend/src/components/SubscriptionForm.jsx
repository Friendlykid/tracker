import { Bitcoin } from "@/components/Icons/Bitcoin";
import { Ethereum } from "@/components/Icons/Ethereum";
import { BITCOIN, ETHEREUM } from "@/lib/constants";
import { useIsAddressDuplicate, useSubscribe } from "@/lib/mutations";
import { useBtcBlockHeight, useEthBlockHeight, useUser } from "@/lib/query";
import { isValidBtcAddress, isValidEthAddress } from "@/lib/validation";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDebounceCallback } from "@react-hook/debounce";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";

const MAX_TEXT_FIELD_WIDTH = 500;
const DEBOUNCE = 200;

const INVALID_ADDRESS_MESSAGE = "Address is not valid";
const DUPLICATE_ADDRESS_MESSAGE = "You are already tracking this address";
const EMPTY_ADDRESS_MESSAGE = "Should not be empty";

export const SubscriptionForm = ({
  isEdit = false,
  defaultAddr = "",
  defaultblockchain = null,
  defaultName = "",
  defaultAlert = true,
  defaultErc20 = false,
}) => {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blockchain, setBlockchain] = useState(defaultblockchain);
  const [name, setName] = useState(defaultName);
  const [address, setAddress] = useState(defaultAddr);
  const [isEmail, setIsEmail] = useState(defaultAlert);
  const [isErc20, setIsErc20] = useState(defaultErc20);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isAddressEmptyError, setIsAddressEmptyError] = useState(false);
  const { data: btcBlockHeight, isFetched: isBtcBlockHeight } =
    useBtcBlockHeight();
  const { data: ethBlockHeight, isFetched: isEthBlockHeight } =
    useEthBlockHeight();
  const { mutate: checkForDuplicate } = useIsAddressDuplicate({
    onSuccess: (data) => {
      setIsDuplicate(data);
    },
  });
  const { mutate: setSubscription } = useSubscribe({
    onSuccess: () => {
      enqueueSnackbar(
        isEdit ? "Subscription changed" : "Subscription Created",
        { variant: "success" }
      );
      router.push(`/dashboard/${blockchain}_wallet/` + address);
    },
  });

  const debouncedDuplicateCheck = useDebounceCallback(() => {
    checkForDuplicate({ blockchain, address });
  }, DEBOUNCE);

  const isAddressInvalid = useMemo(
    () =>
      !!blockchain &&
      address !== "" &&
      !(blockchain === BITCOIN
        ? isValidBtcAddress(address)
        : isValidEthAddress(address)),
    [address, blockchain]
  );

  const addressLabel = useMemo(
    () =>
      blockchain === BITCOIN
        ? 'Wallet address e.g. "bc1qafs746sr056pay352afq7rtvg27mm9nrdtdjns"'
        : blockchain === ETHEREUM
        ? 'Wallet address e.g. "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5"'
        : "Wallet address",
    [blockchain]
  );

  const isFormValid = useMemo(() => {
    return (
      !isAddressInvalid && !(isDuplicate && isEdit) && !isAddressEmptyError
    );
  }, [isAddressInvalid, isDuplicate, isAddressEmptyError]);

  useEffect(() => {
    if (!isEdit && searchParams.get("addr")) {
      setBlockchain(searchParams.get("addr"));
    }
  }, [searchParams, isEdit]);

  const handleSubmit = async () => {
    if (!address) {
      setIsAddressEmptyError(true);
      return;
    }
    if (!isFormValid) return;

    const data = { blockchain, address };
    if (!isEdit) {
      data.blockHeight =
        blockchain === BITCOIN
          ? Number(btcBlockHeight)
          : Number(ethBlockHeight);
    }
    if (blockchain === ETHEREUM) {
      data.watch_tokens = isErc20;
    }
    data.name = name !== "" ? name : address;
    data.alert = isEmail;
    setSubscription(data);
  };

  const addressHelperText = [
    isAddressInvalid && INVALID_ADDRESS_MESSAGE,
    isDuplicate && DUPLICATE_ADDRESS_MESSAGE,
    isAddressEmptyError && EMPTY_ADDRESS_MESSAGE,
  ]
    .filter(Boolean)
    .join(", ");

  if (!user) return;
  return (
    <Stack gap={3}>
      <Typography
        variant="h4"
        component="h2"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {isEdit ? `Edit ${address}` : "Track new wallet"}
      </Typography>
      <Divider sx={{ mb: 8 }} />
      <TextField
        variant="outlined"
        label='Name, e.g. "MyWallet" (optional)'
        name="walletName"
        value={name}
        onChange={(e) => setName(e.target.value)}
        slotProps={{ htmlInput: { autoComplete: "off" } }}
        sx={{ maxWidth: MAX_TEXT_FIELD_WIDTH }}
      />
      <FormLabel id="blockchain-radio" sx={{ mb: -2 }}>
        Select Blockchain:
      </FormLabel>
      <RadioGroup
        aria-labelledby="blockchain-radio"
        name="blockchain"
        value={blockchain}
        onChange={(_, value) => {
          setBlockchain(value);
        }}
        sx={{
          alignItems: "flex-start",
        }}
      >
        <FormControlLabel
          value={BITCOIN}
          name={BITCOIN}
          label={
            <Stack direction="row" gap={1}>
              <Bitcoin color={blockchain === BITCOIN ? "primary" : undefined} />
              Bitcoin
            </Stack>
          }
          control={<Radio disabled={isEdit} />}
        />
        <FormControlLabel
          value={ETHEREUM}
          name={ETHEREUM}
          label={
            <Stack direction="row" gap={1}>
              <Ethereum
                color={blockchain === ETHEREUM ? ETHEREUM : undefined}
              />
              Ethereum
            </Stack>
          }
          control={<Radio color={ETHEREUM} disabled={isEdit} />}
        />
      </RadioGroup>
      <TextField
        name="address"
        label={addressLabel}
        sx={{ maxWidth: MAX_TEXT_FIELD_WIDTH }}
        value={address}
        disabled={isEdit}
        onChange={(e) => {
          if (isAddressEmptyError) setIsAddressEmptyError(false);
          debouncedDuplicateCheck();
          setAddress(e.target.value);
        }}
        error={isAddressInvalid || isDuplicate || isAddressEmptyError}
        helperText={addressHelperText}
      />
      <FormControlLabel
        sx={{
          width: "fit-content",
        }}
        control={
          <Checkbox
            checked={isEmail}
            onChange={(_, checked) => setIsEmail(checked)}
            name="email"
          />
        }
        label="Do you want to be notified via email?"
      />
      <FormControlLabel
        disabled={blockchain === BITCOIN}
        sx={{
          width: "fit-content",
        }}
        control={
          <Checkbox
            checked={isErc20}
            onChange={(_, checked) => setIsErc20(checked)}
            name="erc20"
          />
        }
        label="Do you want to track ERC-20 Tokens?"
      />
      <Button
        type="submit"
        variant="contained"
        onClick={handleSubmit}
        sx={{ maxWidth: 200 }}
        disabled={!isBtcBlockHeight || !isEthBlockHeight}
      >
        Save
      </Button>
    </Stack>
  );
};
