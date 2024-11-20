import { Html, Head, Main, NextScript } from "next/document";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="App for visualisation of crypto adresses in Bitcoin and Ethereum."
        />
      </Head>
      <body>
        <InitColorSchemeScript attribute="class" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
