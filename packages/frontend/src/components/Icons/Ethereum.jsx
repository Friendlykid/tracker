import { useTheme } from "@mui/material";

export const Ethereum = ({ color, other }) => {
  const theme = useTheme();
  return (
    <svg
      fill={theme.palette?.[color]?.main ?? "currentColor"}
      width={24}
      height={24}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      stroke={theme.palette?.[color]?.main ?? "currentColor"}
      strokeWidth={0.1}
      {...other}
    >
      <path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0l-9.819 16.297 9.819 5.807 9.823-5.801z" />
    </svg>
  );
};
