import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createReadStream } from "node:fs"
import { openai } from "../lib/openai"


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

        if (!videoId)
            return reply.send({ error: `videoId not found` })

        const { path: pathVideo } = await prisma.video.findFirstOrThrow({
            where: {
                id: videoId
            }
        })

        if (!pathVideo)
            return reply.send({ error: `Video with id: ${videoId} not found!` })

        const audioReadStream = createReadStream(pathVideo);

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: "whisper-1",
            language: "pt",
            response_format: "json",
            temperature: 0,
            prompt: prompt
        })

        const transcription = response.text
        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                transcription
            }
        })
        return reply.send({ transcription: transcription });
    })
}