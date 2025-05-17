import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.route.js";
import { customerRoutes } from "./routes/customer.route.js";
import { AuthController } from "./controllers/auth.controller.js";
import cors from "@fastify/cors";

export const app = Fastify();
const authController = new AuthController();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
app.register(fastifyJwt, {
  secret: "keysecret123",
});

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.register(authRoutes, {
  prefix: "/login",
  controller: authController,
});

app.register(customerRoutes, {
  prefix: "/customers",
});
