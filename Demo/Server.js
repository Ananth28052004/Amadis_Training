const app = require("fastify")({
    logger: true
});

const db = require("./db");

// GET all students
app.get("/students", async (request, reply) => {

    const [rows] = await db.query(
        "SELECT * FROM students"
    );

    return rows;
});

app.post("/add",async(req,res)=>{
    const { name, age, department } = req.body;
    const [result] = await db.query(
        "INSERT INTO students (name, age, department) VALUES (?, ?, ?)",
        [name, age, department]
    );
    res.send({ message: "Student created successfully", id: result.insertId });
});
const start = async () => {

    try {

        await app.listen({
            port: 5050
        });

        console.log("Server running on port 5050");

    } catch (error) {

        app.log.error(error);
        process.exit(1);

    }
};

start();