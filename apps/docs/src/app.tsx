/// <reference types="filesystem-routing/types" />
import { ColorModeProvider, cookieStorageManagerSSR } from "@kobalte/core/color-mode";
import { announceRoutes } from "@solidjs/prerender";
import { createRouter, intentPreload } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";
import { getRequestEvent, isServer } from "@solidjs/web";
import { MetaTags } from "~/components/meta-tags.tsx";

import { BaseColorProvider, parseBaseColorCookie } from "~/lib/base-color-context.tsx";
import { parseStyleCookie, StyleProvider } from "~/lib/style-context.tsx";
import { Toaster } from "~/registry/ui/toast.tsx";

import "~/styles/app.css";
import "~/styles/typeset.css";

import { Loading } from "solid-js";

import { pageRoutes } from "virtual:file-routes";

// A link's page starts loading once the pointer rests on it, it gets focus,
// or a touch starts, so most of the code has arrived by the click.
const Router = createRouter({ routes: fileRoutes(pageRoutes), preloadLinks: intentPreload() });

export default function App() {
  announceRoutes(Router);
  const cookie = isServer
    ? (getRequestEvent()?.request.headers.get("cookie") ?? "")
    : document.cookie;
  const storageManager = cookieStorageManagerSSR(cookie);
  const initialStyle = parseStyleCookie(cookie);
  const initialBaseColor = parseBaseColorCookie(cookie);

  return (
    <>
      <MetaTags />
      <ColorModeProvider storageManager={storageManager}>
        <StyleProvider initial={initialStyle}>
          <BaseColorProvider initial={initialBaseColor}>
            <Router>{(props) => <Loading>{props.children}</Loading>}</Router>
            <Toaster />
          </BaseColorProvider>
        </StyleProvider>
      </ColorModeProvider>
    </>
  );
}
