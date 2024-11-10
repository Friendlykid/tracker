import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import ThemeProvider from "@/theme/ThemeProvider";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <ThemeProvider>
            <CssBaseline />
            <Component {...pageProps}></Component>
          </ThemeProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
