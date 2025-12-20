import "dotenv/config"; 

import { buildApp } from "./app";

const start = async () => {
  const app = buildApp();
  await app.listen({ port: 3000 });
  console.log("Server running on http://localhost:3000");
};

start();
