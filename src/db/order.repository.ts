import pool from "./postgres";
import { OrderStatus } from "../models/order.model";

export async function createOrder(
  id: string,
  tokenIn: string,
  tokenOut: string,
  amount: number
) {
  await pool.query(
    `
    INSERT INTO orders (id, token_in, token_out, amount, status)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [id, tokenIn, tokenOut, amount, "pending"]
  );
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  dex?: string,
  txHash?: string
) {
  await pool.query(
    `
    UPDATE orders
    SET status = $2,
        dex = COALESCE($3, dex),
        tx_hash = COALESCE($4, tx_hash)
    WHERE id = $1
    `,
    [id, status, dex, txHash]
  );
}
