import { Queue } from "bullmq";
import redisConnection from "./redis.connection";
import { OrderJob } from "../models/order.model";

export const orderQueue = new Queue<OrderJob>("orders", {
  connection: redisConnection
});

export async function enqueueOrder(data: OrderJob): Promise<void> {
  await orderQueue.add("execute", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  });
}
