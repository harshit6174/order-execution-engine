import { Worker } from "bullmq";
import redisConnection from "./redis.connection";
import { routeOrder } from "../dex/dexRouter";
import { MockDex } from "../dex/mockDex";
import { emitStatus } from "../websocket/orders.socket";
import { updateOrderStatus } from "../db/order.repository";
import { OrderJob } from "../models/order.model";

if (!redisConnection) {
  console.warn("Redis not available — worker not started");
  process.exit(0);
}

const dex = new MockDex();

new Worker<OrderJob>(
  "orders",
  async (job) => {
    const { orderId } = job.data;

    try {
      emitStatus(orderId, { status: "routing" });
      await updateOrderStatus(orderId, "routing");

      const route = await routeOrder(orderId);

      emitStatus(orderId, { status: "building" });
      await updateOrderStatus(orderId, "building", route.dex);

      const tx = await dex.execute(route.dex);

      emitStatus(orderId, {
        status: "confirmed",
        txHash: tx.txHash
      });

      await updateOrderStatus(orderId, "confirmed", route.dex, tx.txHash);
    } catch (err) {
      const error = err as Error;

      emitStatus(orderId, {
        status: "failed",
        error: error.message
      });

      await updateOrderStatus(orderId, "failed", undefined, undefined, error.message);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 10
  }
);

console.log("Order worker started");
