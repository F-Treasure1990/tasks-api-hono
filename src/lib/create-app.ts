import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import { pinoLogger } from "@/middleware/pino-logger";

import type { AppBindings } from "./types";

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>({
    strict: false,
  });
  app.use(serveEmojiFavicon("👋"));
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
