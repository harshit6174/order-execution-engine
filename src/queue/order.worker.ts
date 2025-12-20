import "dotenv/config"; // ✅ MUST be first

import { Worker, Job } from "bullmq";
import redisConnection from "./redis.connection";
import { routeOrder } from "../dex/dexRouter";
import { MockDex } from "../dex/mockDex";
import { emitStatus } from "../websocket/orders.socket";
import { updateOrderStatus } from "../db/order.repository";
import pool from "../db/postgres";
import { OrderJob } from "../models/order.model";

const dex = new MockDex();

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("[Worker][Startup] Database connection established");
  } catch (err) {
    console.error(
      "[Worker][Startup] Failed to connect to database. Shutting down.",
      err
    );
    process.exit(1);
  }
})();


new Worker<OrderJob>(
  "orders",
  async (job: Job<OrderJob>) => {
    const { orderId } = job.data;
    await new Promise((r) => setTimeout(r, 10000));

    try {
      emitStatus(orderId, { status: "routing" });
      await updateOrderStatus(orderId, "routing");

      const route = await routeOrder();

      console.log(
        `[Routing] Order ${orderId} → ${route.dex} (price=${route.quote.price})`
      );

      emitStatus(orderId, {
        status: "building",
        dex: route.dex
      });
      await updateOrderStatus(orderId, "building", route.dex);

      const tx = await dex.execute(route.dex);

      emitStatus(orderId, {
        status: "confirmed",
        txHash: tx.txHash
      });

      await updateOrderStatus(
        orderId,
        "confirmed",
        route.dex,
        tx.txHash
      );
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Unknown error";

      emitStatus(orderId, {
        status: "failed",
        error
      });

      await updateOrderStatus(orderId, "failed");
      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 10
  }
);
