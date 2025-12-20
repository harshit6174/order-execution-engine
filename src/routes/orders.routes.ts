import { FastifyInstance, FastifyRequest } from "fastify";
import { v4 as uuid } from "uuid";
import WebSocket from "ws";

import { enqueueOrder } from "../queue/order.queue";
import { createOrder } from "../db/order.repository";
import { OrderJob } from "../models/order.model";
import { registerSocket } from "../websocket/orders.socket";

interface ExecuteOrderBody {
  tokenIn: string;
  tokenOut: string;
  amount: number;
}

interface OrderWsQuery {
  orderId: string;
}

export default async function (app: FastifyInstance) {
  
  app.post(
    "/execute",
    async (req: FastifyRequest<{ Body: ExecuteOrderBody }>) => {
      const { tokenIn, tokenOut, amount } = req.body;
      const orderId = uuid();

      await createOrder(orderId, tokenIn, tokenOut, amount);

      const job: OrderJob = {
        orderId,
        tokenIn,
        tokenOut,
        amount
      };

      await enqueueOrder(job);

      return { orderId };
    }
  );

 
  app.get(
    "/ws",
    { websocket: true },
    (socket: WebSocket, req) => {
      const { orderId } = req.query as OrderWsQuery;

      if (!orderId) {
        socket.close();
        return;
      }

      registerSocket(orderId, socket);
    }
  );
}
