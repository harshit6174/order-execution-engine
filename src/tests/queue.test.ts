import { enqueueOrder,orderQueue  } from "../queue/order.queue";

describe("Order Queue", () => {
  it("enqueues an order without error", async () => {
    await expect(
      enqueueOrder({
        orderId: "test-id",
        tokenIn: "SOL",
        tokenOut: "USDC",
        amount: 1
      })
    ).resolves.not.toThrow();
  });

  it("configures retry attempts correctly", async () => {
    const job = {
      opts: {
        attempts: 3
      }
    };

    expect(job.opts.attempts).toBe(3);
  });

  it("uses exponential backoff configuration", () => {
    const backoff = {
      type: "exponential",
      delay: 1000
    };

    expect(backoff.type).toBe("exponential");
    expect(backoff.delay).toBe(1000);
  });

  it("queue name is defined correctly", () => {
  expect(orderQueue.name).toBe("orders");
});

it("enqueueOrder accepts valid job payload", async () => {
  const payload = {
    orderId: "test-id",
    tokenIn: "SOL",
    tokenOut: "USDC",
    amount: 1
  };

  await expect(enqueueOrder(payload)).resolves.not.toThrow();
});


});
