import { sleep } from "../utils/sleep";

export class MockDex {
  async raydiumQuote() {
    await sleep(200);
    return { price: 20 * (0.98 + Math.random() * 0.04), fee: 0.003 };
  }

  async meteoraQuote() {
    await sleep(200);
    return { price: 20 * (0.97 + Math.random() * 0.05), fee: 0.002 };
  }

  async execute(dex: string) {
    await sleep(2000);
    return {
      txHash: `MOCK_${dex}_${Date.now()}`,
      executedPrice: 21.1
    };
  }
}
