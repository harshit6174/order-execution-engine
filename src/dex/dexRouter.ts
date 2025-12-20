import { MockDex } from "./mockDex";

export async function routeOrder(dex = new MockDex()) {
  const ray = await dex.raydiumQuote();
  const met = await dex.meteoraQuote();

  return ray.price >= met.price
    ? { dex: "raydium", quote: ray }
    : { dex: "meteora", quote: met };
}
