import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const paramsSchema = z.object({
    videoId: z.string().uuid(),
})

const bodySchema = z.object({
    prompt: z.string(),
})
export async function createTranscriptionRoute(app: FastifyInstance) {
    app.post("/videos/:videoId/transcription", async (request, reply) => {

        const { videoId } = paramsSchema.parse(request.params);
        const { prompt } = bodySchema.parse(request.body);

        return reply.send({videoId, prompt});
    })
}