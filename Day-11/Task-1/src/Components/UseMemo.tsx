    import { useMemo, useState } from "react";

    function UseMemo(){
        type valueProps={
            num:number
        }
        const[number,setNumber]=useState(0);
        const[ans,setAns]=useState(0);
        function Squre(props:valueProps){
            console.log("Running Calutation");
            return props.num*props.num;
        }
        const result=useMemo(()=>{
            return Squre({num:number})
        },[number])
        return(<>
        <div className="maindiv">
            <h1 className="head">UseMemo</h1><hr />
            <label >Calculate Squre</label>
            <input type="number" placeholder="Enter number"  onChange={(e)=>setNumber(Number(e.target.value))}/>
            <h1>{result}</h1>
            <button onClick={()=>setAns((p)=>p+1)}>load Component</button>
        </div>
        </>)
    }
    export default UseMemo;