import { OrderJob } from "../models/order.model";

describe("Worker Job Contract", () => {
  it("OrderJob contains required execution fields", () => {
    const job: OrderJob = {
      orderId: "id",
      tokenIn: "SOL",
      tokenOut: "USDC",
      amount: 1
    };

    expect(job.orderId).toBeDefined();
    expect(job.tokenIn).toBeDefined();
    expect(job.tokenOut).toBeDefined();
    expect(job.amount).toBeGreaterThan(0);
  });
});
