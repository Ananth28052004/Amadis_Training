import { useState } from "react";

function Over(){
    const[over,setOver]=useState(false);
    const h1Style={
        color:"blue"
    }
    const box={
        width:"100px",
        height:"100px",
        backgroundColor:"yellow"

    }
    function valid(){
        setOver(!over);
    }
    return(
        <>
        <h1 style={h1Style}>Mouse Over</h1>
        <button onMouseOver={valid}>{over?"Hide Box":"Show Box"}</button>
        <div style={over?box:{}}></div>
        
        </>
    )
}
export default Over;