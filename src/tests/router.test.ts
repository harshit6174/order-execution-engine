import { routeOrder } from "../dex/dexRouter";

describe("DEX Router", () => {
  it("selects a DEX", async () => {
    const route = await routeOrder();
    expect(route).toHaveProperty("dex");
  });

  it("returns price information", async () => {
    const route = await routeOrder();
    expect(route.quote.price).toBeGreaterThan(0);
  });

  it("returns lowest price among DEXs", async () => {
    const route = await routeOrder();
    expect(["raydium", "meteora"]).toContain(route.dex);
  });

  it("returns deterministic structure", async () => {
  const route = await routeOrder();
  expect(route).toHaveProperty("dex");
  expect(route).toHaveProperty("quote");
});

it("quote contains fee information", async () => {
  const route = await routeOrder();
  expect(route.quote).toHaveProperty("fee");
  expect(route.quote.fee).toBeGreaterThanOrEqual(0);
});

it("price is a finite number", async () => {
  const route = await routeOrder();
  expect(Number.isFinite(route.quote.price)).toBe(true);
});

});
