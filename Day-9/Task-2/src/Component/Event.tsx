import { useState } from "react";

function Event(){
    const [change,setChange]=useState("");
    return(<>
    <h1>On Change</h1>
    <label>Enter Any Text:</label>
    <input type="text" placeholder="Type here"  onChange={(e)=>setChange(e.target.value.trim())}/>
    <h1>{change}</h1>

    </>)
}
export default Event;