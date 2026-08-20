/// <reference types="filesystem-routing/types" />
import { createRouter } from "@solidjs/router";
import { getRequestEvent, isServer } from "@solidjs/web";
import { MetaTags } from "~/components/meta-tags.tsx";

import {
  BaseColorProvider,
  parseBaseColorCookie,
} from "~/lib/base-color-context.tsx";
import {
  ColorModeProvider,
  cookieStorageManagerSSR,
} from "~/lib/color-mode.tsx";
import { fileRoutes } from "~/lib/file-routes.ts";
import { parseStyleCookie, StyleProvider } from "~/lib/style-context.tsx";
import { Toaster } from "~/registry/ui/toast.tsx";

import "~/styles/app.css";
import "~/styles/typeset.css";

import { Loading } from "solid-js";

import { pageRoutes } from "virtual:file-routes";

const Router = createRouter({ routes: fileRoutes(pageRoutes) });

export default function App() {
  const cookie = isServer
    ? getRequestEvent()?.request.headers.get("cookie") ?? ""
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
            <Router>
              {(props) => <Loading>{props.children}</Loading>}
            </Router>
            <Toaster />
          </BaseColorProvider>
        </StyleProvider>
      </ColorModeProvider>
    </>
  );
}
