import { useEffect, useState } from "react";
import "../Css/UseEffect.css"

function UseEffect(){
    const[count,setCount]=useState(0);
    const[count1,setCount1]=useState(0);
    const[name,setName]=useState("Ananth");
    const[change,setChange]=useState(-1);
    const[change1,setChange1]=useState(0);
    useEffect(()=>{
        setTimeout(()=>setCount(count+1),2000)
    })
    useEffect(()=>{
        setTimeout(()=>setName("Name Changing once"),5000)
    });
    useEffect(()=>{
        setCount1(count1+1)
    })
    useEffect(()=>{
        setChange1(change1+1)
    },[change1])
    return(<>
    <div className="maindiv">
    <h1 className="head">Use Effect</h1><hr/>
    <h2 className="headdata">Run 2sec once</h2>
    <h2>Component Run {count} times</h2>
    <hr />
    <h2 className="headdata">Useing Depentence</h2>
    <h4>Run Only once</h4>
    <h1>{name}</h1><hr />
    <h2 className="headdata">Run Frequently</h2>
    <h1>{count1}</h1><hr />
    <h2 className="headdata">Run only if Any changes</h2>
    <h2>Value Change {change} Times</h2>
    <button onClick={()=>setChange(change+1)}>Click</button><hr /> 
    </div>
    </>)
}
export default UseEffect;