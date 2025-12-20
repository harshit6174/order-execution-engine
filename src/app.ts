import Fastify from "fastify";
import websocket from "@fastify/websocket";
import orderRoutes from "./routes/orders.routes";

export function buildApp() {
  const app = Fastify();
  app.register(websocket);
  app.register(orderRoutes, { prefix: "/api/orders" });
  return app;
}
