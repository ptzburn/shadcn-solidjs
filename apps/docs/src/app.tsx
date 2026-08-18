/// <reference types="filesystem-routing/types" />
import { createRouter } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";
import { getRequestEvent, isServer } from "@solidjs/web";

import { MetaTags } from "~/components/meta-tags.tsx";
import {
  ColorModeProvider,
  cookieStorageManagerSSR,
} from "~/lib/color-mode.tsx";
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

  return (
    <>
      <MetaTags />
      <ColorModeProvider storageManager={storageManager}>
        <StyleProvider initial={initialStyle}>
          <Router>
            {(props) => <Loading>{props.children}</Loading>}
          </Router>
          <Toaster />
        </StyleProvider>
      </ColorModeProvider>
    </>
  );
}
