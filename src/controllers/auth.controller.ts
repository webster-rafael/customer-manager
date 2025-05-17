import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service.js"; 

const authService = new AuthService();

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };

    try {
      await authService.login(username, password);
      const token = await reply.jwtSign({ username });

      return reply.send({ token });
    } catch (err) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }
  }
}
