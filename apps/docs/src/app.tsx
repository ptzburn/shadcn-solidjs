/// <reference types="filesystem-routing/types" />
import { createRouter } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";
import { getRequestEvent, isServer } from "@solidjs/web";

import { MetaTags } from "~/components/meta-tags.tsx";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "~/lib/color-mode.tsx";

import "~/styles/app.css";

import { Loading } from "solid-js";

import { pageRoutes } from "virtual:file-routes";

const Router = createRouter({ routes: fileRoutes(pageRoutes) });

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer
      ? getRequestEvent()?.request.headers.get("cookie") ?? ""
      : document.cookie,
  );

  return (
    <>
      <MetaTags />
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <Router>
          {(props) => <Loading>{props.children}</Loading>}
        </Router>
      </ColorModeProvider>
    </>
  );
}
