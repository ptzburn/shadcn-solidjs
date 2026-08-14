/// <reference types="filesystem-routing/types" />
import { createRouter } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";

import "~/styles/app.css";

import { Loading } from "solid-js";

import { pageRoutes } from "virtual:file-routes";

const Router = createRouter({ routes: fileRoutes(pageRoutes) });

export default function App() {
  return (
    <Router>
      {(props) => <Loading>{props.children}</Loading>}
    </Router>
  );
}
