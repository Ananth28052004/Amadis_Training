import { useState } from "react";

function InputValid(){
    const[name,setname]=useState(false);
    function Change(){
        setname(!name);
    }
    const h1style={
        color:"red"
    }
    return(
        <>
        <h1 style={h1style}>Show Password</h1>
    <input type={name?"password":"text"} placeholder="Type here"/>
    <button onClick={Change}>{name?"Show":"Hide"}</button>
</>)

}
export default InputValid;