import Fastify from "fastify";
import { sendEmail } from "./service/mailService.js";
 
const app = Fastify();
 
app.get("/", async (request, reply) => {
    return {
        "View Users": "/Users",
        "Add Users": "/AddUser",
        "Email": "/email"
    };
});
 
app.get("/email", async (request, reply) => {
 
    await sendEmail(
        "farhansathik67@gmail.com",
        "Sapdiyaaaaa",
        "Message sent!"
    );
 
    return {
        message: "Mail sent successfully!"
    };
});
 
app.listen({ port: 3000 }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
 
    console.log("Server running on http://localhost:3000");
});