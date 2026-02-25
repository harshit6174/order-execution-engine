import { Queue } from "bullmq";
import redisConnection from "./redis.connection";
import { OrderJob } from "../models/order.model";

export const orderQueue = redisConnection
  ? new Queue<OrderJob>("orders", {
      connection: redisConnection
    })
  : undefined;

export async function enqueueOrder(job: OrderJob): Promise<void> {
  if (!orderQueue) {
    throw new Error("Order queue is not initialized (Redis disabled)");
  }

  await orderQueue.add("execute", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  });
}
