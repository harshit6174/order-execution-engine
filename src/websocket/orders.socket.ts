import { WebSocket } from "ws";
import { OrderStatusPayload } from "../models/order.model";

const clients = new Map<string, WebSocket>();

export function registerSocket(
  orderId: string,
  ws: WebSocket
): void {
  clients.set(orderId, ws);
}

export function emitStatus(
  orderId: string,
  payload: OrderStatusPayload
): void {
  const ws = clients.get(orderId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}
