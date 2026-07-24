import { useState } from "react"
import Show from "./components/Demo"
import Printing from "./components/Popes";
import {Add,Sub} from "./components/Hello"
import {Use} from "./components/Useststus"
function App() {
  const [count,setCount]=useState(0);
  return (
    <>
    <Show></Show>
    <Printing name={"Ananth"} age={22} village="Tenkasi"></Printing>
    <Use></Use>
    <Add></Add>
    <Sub></Sub>
    </>
  )
}

export default App
