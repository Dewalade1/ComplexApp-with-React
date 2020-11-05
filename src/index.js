import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import registerServiceWorker from "./registerServiceWorker";

Sentry.init({
  dsn: "https://35b0f590ebec4c888de4178bb72156fa@o471166.ingest.sentry.io/5502827",
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.8,
});

ReactDOM.render(<App />, document.getElementById("app"));
registerServiceWorker();
