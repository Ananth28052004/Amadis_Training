const app=require("fastify")({logger:true});
// app.get("/",async ()=>{
//     return{
//         message : "i am Ananth"
//     }
// })
// app.get("/about",async ()=>{
//     return {
//         about:"Ananth from tenkasi softwer enginner"
//     }
// })
// app.get("/show/:dob",async (req,res)=>{
//     res.type("text/plain");
//     return "hii"
// })

// app.get("/show/parameter/:name",async (req)=>{
//     return{
//         name:"My name is :"+req.params.name
//     }
// })
// app.get("/student",async(req,res)=>{
//     return{
//         name:req.query.name,
//         age:req.query.age
//     }
// })
//     const data=[{
//         name:"Ananth",
//         age:22
//     },
//     {
//         name:"Malr",
//         age:20
//     }]
//     app.get("/findstudent",async(req,res)=>{
//         let temp=req.query.name;
//         return data.find(student => student.name === temp);
//     })


    // -----------------------------------------------------------------------------------------------------------
app.post("/studentdeatiles",async (req,res)=>{
    const data=req.body;
    return{
        message:"Running",
        data:data
    }
})

const students=[];
app.post("/students",async(req,res)=>{
    let val=req.body;
    students.push(val);
    return students;

})
app.post("/data",async (req,res)=>{
     var name=req.query.name;
    return name;
})


const fastify = require("fastify")({ logger: true });

const stu = [
    {
        id: 1,
        name: "Ananth",
        age: 22,
        city: "Tenkasi"
    },
    {
        id: 2,
        name: "Malar",
        age: 20,
        city: "Chennai"
    }
];

//get Allstudente
app.get("/getStudentAll",async()=>{
    return stu;
})
//get  based on id
app.get("/getStudent/:id",async(req,res)=>{
    let data=null
    data=stu.find(s=>s.id===Number(req.params.id));
    if(!data)return{
        message:"noo"
    }
    return data;
})

// -------------------------------------------------------------------------------------------------
app.put("/puts/:id",async(req,res)=>{
    let id=Number(req.params.id);
    let index=stu.findIndex(s=>s.id===id);
    if(index==-1)return {
        no:"no Data"
    }
    else {
        stu[index]=req.body;
        return stu
    }
})

app.delete("/deletes/:id",async(req,res)=>{
    let id=Number(req.params.id);
    let index=stu.findIndex(s=>s.id===id);
    if(index===-1){
        return{
            no:"NOOOOOOOOOOOOOOOOOOOOOOOOOOO"
        }
    }
    else{
        stu.splice(index,1);
        return stu;
    }
})
app.listen({port:3000});