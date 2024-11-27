import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";
import { ThemeContextProvider } from "@/theme/ThemeContextProvider";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider autoHideDuration={5000}>
          <ThemeContextProvider>
            <CssBaseline />
            <Component {...pageProps}></Component>
          </ThemeContextProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
