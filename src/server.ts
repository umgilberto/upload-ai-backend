import { fastify } from "fastify"

const PORT = 3333;
const app = fastify();

app.get("/", ()=> "hello word")
app.listen({
    port: PORT
}).then(()=> console.log(`HTTP Server running in http://localhost:${PORT}`))