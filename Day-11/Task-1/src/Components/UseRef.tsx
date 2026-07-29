import { useEffect, useRef, useState } from "react";
import "../Css/UseRef.css"
function Useref(){
    const inputval=useRef<HTMLInputElement>(null);
    const inputval1=useRef<HTMLInputElement>(null);
    const inputval2=useRef<HTMLInputElement>(null);
    const[count,setCount]=useState(0);
     const[times,setTimes]=useState(0);
     const temp=useRef(0);
    const clearinput=()=>{
        if(inputval2.current){
            inputval2.current.value="";
        }
    }
    useEffect(()=>{
       temp.current=temp.current+1;
    },[count])
     const changeColor = () => {
    if (inputval.current) {
      inputval.current.style.color = "red";
      inputval.current.style.height="30px"
      inputval.current.style.width="130px"
      inputval.current.style.backgroundColor="lightgreen";
    }
  };
  const clickFouce=()=>{
    inputval1.current?.focus();
  }

    return(<>
    <div className="maindiv">
        <h1 className="head">Use Ref</h1><br /><br /><hr />
        <h1>Change color & size</h1>
        <input type="text" ref={inputval}/><br /><br /><br />
        <button onClick={changeColor}>Change</button><hr />
        <h1>Focus the input</h1>
        <input type="text" placeholder="type here" ref={inputval1}/>
        <button onClick={clickFouce}>Focus</button><hr />
        <h1>Clear input</h1>
        <input type="text" placeholder="type here" ref={inputval2}/>
        <button onClick={clearinput}>Clear</button><hr />
        <h1>How Hany time Componend Render</h1>
        <h2>Value {count}</h2>
        <button onClick={()=>setCount((p)=>p+1)}>+1</button>
        <button onClick={()=>setCount((p)=>p-1)}>-1</button>
        <h1>Total {temp.current} times Component</h1>

    </div>
    </>)
}
export default Useref;