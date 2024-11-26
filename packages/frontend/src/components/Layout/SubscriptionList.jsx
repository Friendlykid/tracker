import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export const SubscriptionList = ({
  subs = [],
  Icon,
  shouldCollapse,
  title,
  path,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (subs.length === 0) return null;
  return (
    <List
      subheader={
        <ListSubheader
          onClick={() => {
            if (shouldCollapse) setIsOpen((old) => !old);
          }}
          component="div"
          id={`${title}-subheader`}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            flexWrap: "wrap",
            "& > *": { alignItems: "center" },
          }}
        >
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={title} />
          {shouldCollapse && <>{isOpen ? <ExpandLess /> : <ExpandMore />}</>}
        </ListSubheader>
      }
    >
      <Collapse
        in={shouldCollapse ? isOpen : true}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding>
          {subs.length > 0 &&
            subs.map((sub) => {
              return (
                <ListItemButton
                  selected={router.asPath.endsWith(sub.address)}
                  key={sub.address}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    router.push(path + sub.address);
                  }}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={sub.name}
                    secondary={
                      sub.address !== sub.name ? sub.address : undefined
                    }
                    primaryTypographyProps={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                    secondaryTypographyProps={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Collapse>
    </List>
  );
};
