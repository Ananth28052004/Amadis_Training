import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import UseStateFunction from './Components/UsestateFunction'
import UseEffect from './Components/UseEffectFunction'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <UseStateFunction/>
    <UseEffect/>
    </>
  )
}

export default App
