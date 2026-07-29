import { useState } from "react"
import "../Css/UseStateFunction.css";
function UseStateFunction(){
const[count,setCount]=useState(0);
const[name,setName]=useState({
    name:"Ananth",
    age:20,
    native:"Tenkasi"
})
const[count1,setCount1]=useState(0);
const change=()=>{
    setName((prev)=>({...prev,name:"Changed"}))
}
function Change(){
    setName((prev)=>({...prev,age:24}))
}
const ingress=()=>{
    setCount1((prv)=>prv+1);
    setCount1((prv)=>prv+1);
    setCount1((prv)=>prv+1);
    setCount1((prv)=>prv+1); 
        
}
    return(<>
    <div className="main">
    <h1 className="h1">Use State</h1>
    <div className="div">
        <h1 >{count}</h1>
    </div>
    <button onClick={()=>setCount(count+1)}>Click</button><br /><br/>
    <div className="car">
    </div>
    <h2>My Deatiles</h2>
    <h2>i am {name.name} from {name.native} my age is {name.age}</h2>
    <button onClick={change}>Change Name:</button><br />
    <button onClick={Change}>Change Age:</button>
    <h1>{count1}</h1>
    <button onClick={ingress}>Ingress 4</button>
    </div>
    </>);
}
export default UseStateFunction;