import { useState } from "react";
import Welcome from "./Welcome";
import Wrong from "./Wrong";


function Login(){
    const[check,checkUnPw]=useState<boolean | null>(null);
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const validUserName="Ananth2004";
    const validpassword="1234";
    function valid(){
        if(username===validUserName && password===validpassword)checkUnPw(true);
        else checkUnPw(false);
    }
    return(
    <>
    <label >UserName: </label>
    <input type="text" onChange={(e)=>setUsername(e.target.value)} value={username}/><br />
    <label >Password: </label>
    <input type="text" onChange={(e)=>setPassword(e.target.value)} value={password}/><br/>
    <button onClick={valid}>Login</button>
    {check === true && <Welcome />}
{check === false && <Wrong />}
    </>)

}

export default Login;