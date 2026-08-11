// @refresh reload
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { getCookie } from "@solidjs/start/http";
import { FileRoutes } from "@solidjs/start/router";

import { MetaTags } from "~/components/meta-tags.tsx";
import { parseStyleCookie, StyleProvider } from "~/lib/style-context.tsx";

import { Toaster } from "~/registry/ui/sonner.tsx";
import "~/styles/app.css";
import "~/styles/typeset.css";

import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

function getServerStyleCookie() {
  "use server";
  const style = getCookie("style");
  return style ? `style=${style}` : "";
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );
  // Matches what entry-server.tsx put on <body>, so the provider starts
  // in sync with the markup the client hydrates.
  const initialStyle = parseStyleCookie(
    isServer ? getServerStyleCookie() : document.cookie,
  );
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <MetaTags />
          <ColorModeScript storageType={storageManager.type} />
          <ColorModeProvider storageManager={storageManager}>
            <StyleProvider initial={initialStyle}>
              <main>
                <Suspense>{props.children}</Suspense>
              </main>
              <Toaster position="top-center" />
            </StyleProvider>
          </ColorModeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
