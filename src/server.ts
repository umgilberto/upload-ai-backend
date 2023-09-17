import { fastify } from "fastify"
import { fastifyCors } from "@fastify/cors"
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompilation } from "./routes/generate-ai-compilation"
const PORT = 3333;
const app = fastify();

app.register(fastifyCors, {
    origin: "*"
})
app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompilation)

app.listen({
    port: PORT
}).then(() => console.log(`HTTP Server running in http://localhost:${PORT}`))