import "dotenv/config";
import Fastify from "fastify";
import formbody from "@fastify/formbody";
import autoload from "@fastify/autoload";
import multipart from "@fastify/multipart";
import path from "path";
import cors from "@fastify/cors";

const app = Fastify({ ignoreTrailingSlash: true, logger: true });

app.register(cors, {
  origin: "*",
  credentials: true,
});
app.register(formbody);
app.register(multipart);
app.register(autoload, {
  dir: path.join(__dirname, "routes"),
  options: { prefix: "/api/v1" },
});

app.get("/", async (req, rep) => {
  rep.send("Hello World");
});

export default app;
