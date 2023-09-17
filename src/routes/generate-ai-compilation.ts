import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";
import { streamToResponse, OpenAIStream } from "ai";


const bodySchema = z.object({
    videoId: z.string().uuid(),
    prompt: z.string(),
    temperature: z.number().min(0).max(1).default(0.5),
})
export async function generateAICompilation(app: FastifyInstance) {
    app.post("/ai/complete", async (request, reply) => {

        const { temperature, prompt, videoId } = bodySchema.parse(request.body);

        const { transcription } = await prisma.video.findFirstOrThrow({
            where: {
                id: videoId
            }
        })

        if (!transcription)
            return reply.status(400).send({ error: "Video transcription was not generated yet." })

        const promptMessage = prompt.replace("{transcription}", transcription);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            temperature,
            messages: [
                {
                    role: "user",
                    content: promptMessage
                }
            ],
            stream: true
        })

        const stream = OpenAIStream(response);

        streamToResponse(stream, reply.raw, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, CREATE, PUT, DELETE',

            }
        })
    })
}