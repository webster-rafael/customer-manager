import { FastifyPluginAsync } from "fastify";
import { AuthController } from "../controllers/auth.controller.js";

interface AuthRoutesOptions {
  controller?: AuthController;
}

export const authRoutes: FastifyPluginAsync<AuthRoutesOptions> = async (
  app,
  opts
) => {
  const controller = opts?.controller ?? new AuthController();

  app.post("/", controller.login.bind(controller));
};
