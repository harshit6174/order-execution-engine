export type OrderStatus =
  | "pending"
  | "routing"
  | "building"
  | "confirmed"
  | "failed";

export interface OrderJob {
  orderId: string;
  tokenIn: string;
  tokenOut: string;
  amount: number;
}

export interface OrderStatusPayload {
  status: OrderStatus;
  dex?: string;
  txHash?: string;
  error?: string;
}

export type OrderType = "MARKET";

export interface Order {
  id: string;
  type: OrderType;

  tokenIn: string;
  tokenOut: string;
  amount: number;

  selectedDex?: "raydium" | "meteora";
  executedPrice?: number;
  txHash?: string;

  status: OrderStatus;
  createdAt: Date;
}
