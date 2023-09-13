import { fastify } from "fastify"
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";

const PORT = 3333;
const app = fastify();

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)

app.listen({
    port: PORT
}).then(()=> console.log(`HTTP Server running in http://localhost:${PORT}`))