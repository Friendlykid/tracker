import {
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import SwitchTheme from "../SwitchTheme";
import { useRouter } from "next/router";
import { ExpandLess, ExpandMore, Add } from "@mui/icons-material";
import { Bitcoin } from "../Icons/Bitcoin";
import { useCallback, useState } from "react";
import { Ethereum } from "../Icons/Ethereum";
import { useSearchParams } from "next/navigation";
import { BITCOIN, ETHEREUM } from "@/lib/constants";
import { useBtcSubscriptions, useEthSubscriptions } from "@/lib/query";
import { SubscriptionList } from "./SubscriptionList";

export const DrawerContent = () => {
  const [subOpen, setSubOpen] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: btcSubscriptions, isFetched: isBtcFetched } =
    useBtcSubscriptions();
  const { data: ethSubscriptions, isFetched: isEthFetched } =
    useEthSubscriptions();
  console.log(btcSubscriptions);
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <Stack justifyContent="space-between" my={2} height="100%">
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          "& .MuiListItemButton-root": { mb: 0.5 },
        }}
        component="nav"
      >
        <ListItemButton
          selected={router.asPath.includes("/new")}
          onClick={() => setSubOpen((old) => !old)}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary="New Subscription"
            sx={{ whiteSpace: "nowrap" }}
          />

          {subOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={subOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              selected={router.asPath.includes(
                "/dashboard/new" + "?" + createQueryString("addr", BITCOIN)
              )}
              sx={{ pl: 4 }}
              onClick={() => {
                router.push(
                  "/dashboard/new" + "?" + createQueryString("addr", BITCOIN)
                );
              }}
            >
              <ListItemIcon>
                <Bitcoin />
              </ListItemIcon>
              <ListItemText primary="Track Bitcoin wallet" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding>
            <ListItemButton
              selected={router.asPath.includes(
                "/dashboard/new" + "?" + createQueryString("addr", ETHEREUM)
              )}
              sx={{ pl: 4 }}
              onClick={() => {
                router.push(
                  "/dashboard/new" + "?" + createQueryString("addr", ETHEREUM)
                );
              }}
            >
              <ListItemIcon>
                <Ethereum />
              </ListItemIcon>
              <ListItemText primary="Track Ethereum wallet" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Stack>
        <Divider />
        <SubscriptionList
          shouldCollapse={isBtcFetched ? btcSubscriptions > 3 : false}
          Icon={Bitcoin}
          subs={isBtcFetched ? btcSubscriptions : undefined}
          title="Bitcoin Subscriptions"
          path={"/dashboard/btc_wallet/"}
        />
        <Divider sx={{ mb: 4 }} />
        <SubscriptionList
          shouldCollapse={isEthFetched ? ethSubscriptions > 3 : false}
          Icon={Ethereum}
          subs={isEthFetched ? ethSubscriptions : undefined}
          title="Ethereum Subscriptions"
          path={"/dashboard/eth_wallet/"}
        />
        <SwitchTheme />
      </Stack>
    </Stack>
  );
};
