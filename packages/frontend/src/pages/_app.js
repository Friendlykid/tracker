import { CssBaseline, NoSsr } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import ThemeProvider from "@/theme/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              <Component {...pageProps}></Component>
            </LocalizationProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </RecoilRoot>
  );
}
