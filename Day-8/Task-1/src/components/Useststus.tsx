import { useState } from "react";

function Use(){
    const [count,set]=useState(0);
    const [col,setCol]=useState("");
    const [bcol,setbcol]=useState("");
    return(
        <>
        <h1>{count}</h1>
        <button onClick={()=>{set(count+1)}}>+</button>
        <button onClick={()=>{count==0?set(0):set(count-1)}}>-</button>


        <h1 style={{color:col ,backgroundColor:bcol}}>Hello World</h1>
        <button onClick={()=>{setCol("green")}}>Green</button>
        <button onClick={()=>{setCol("yellow")}}>Yellow</button>
        <button onClick={()=>{setbcol("red")}}>backgroundColor Red</button>
        <button onClick={()=>{setbcol("")}}>Remove</button>

        </>
    );
}
export {Use}