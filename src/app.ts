import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.route";
import { customerRoutes } from "./routes/customer.route";
import { AuthController } from "./controllers/auth.controller";
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

app.register(authRoutes, {
  prefix: "/login",
  controller: authController,
});

app.register(customerRoutes, {
  prefix: "/customers",
});
