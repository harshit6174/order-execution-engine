import { buildApp } from "./app";

const start = async () => {
  const app = buildApp();

  const port = Number(process.env.PORT) || 3000;

  await app.listen({
    port,
    host: "0.0.0.0"
  });

  console.log(`Server running on port ${port}`);
};

start();
