import fastify from "fastify";
const app=fastify({logger:true})
// let ans=[]
// async function myMiddleware(req,res) {
//     ans=[];
//     ans.push("Excecuted")
// }
// app.get("/",
//     {
//         preHandler : myMiddleware
//     },
//     async (req,res)=>{
   
//     ans.push("router")
//      {ans.push("Success");}
//     return{
//         ans
//     }
// })


// --------------------------------------------------------------------------------------------------
// async function authCheck(req,res) {
//     const token=req.headers.user;
//     if("ananth@24"!==token){
//         return res.code(401).send({message:"NOOOOOOOOOOOOOOOO"});
//     }
// }
// app.get("/stu",{
//     preHandler:authCheck
// },async ()=>{
//     return "Welcome"
// });
// ---------------------------------------------------------------------------------------------


// app.addHook("onRequest",async ()=>{
//     console.log("On Request Print")
// })
// app.get("/student",async()=>{
//     return{
//         mes:"Student run"   
//     }
// })





// app.addHook("onRequest",async(req,res)=>{
//     console.log(req.method +" "+req.url);
// })
// app.addHook("preHandler",async(req,res)=>{
//    const token= req.headers.user;
//    if(token!=="ananth@24"){
//     res.send("noooooooooooooooooooooooooooooooooooooo").code(401)
//    }
// })
// app.get("/s",async(req,res)=>{
//     return "Welcome    "+req.headers.user;
// })




app.addHook("onRequest", async () => {
    console.log("1. Request Received");
});

app.addHook("preHandler", async () => {
    console.log("2. Before Route");
});

app.addHook("onSend", async (request, reply, payload) => {
    console.log("3. Sending Response");
    return payload;
});

app.addHook("onResponse", async () => {
    console.log("4. Response Completed");
});

app.get("/student", async () => {

    console.log("Route Executed");

    return {
        message: "Student Data"
    };

});

fastify.addHook("onRequest", async () => {
    console.log("1. Request Received");
});

fastify.addHook("preHandler", async () => {
    console.log("2. Before Route");
});

fastify.addHook("onSend", async (request, reply, payload) => {
    console.log("3. Sending Response");
    return payload;
});

fastify.addHook("onResponse", async () => {
    console.log("4. Response Completed");
});

fastify.get("/student", async () => {

    console.log("Route Executed");

    return {
        message: "Student Data"
    };

});
app.listen({port:3000});