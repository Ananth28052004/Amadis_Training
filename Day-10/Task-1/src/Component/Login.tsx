import { useState } from "react";
import "../Css/Login.css"

type LoginProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

function Login({ setIsLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const validUsername = "ananth";
  const validPassword = "1234";
  function handleLogin() {
    if (username === validUsername && password === validPassword) {
      setIsLogin(true);
    } else {
      alert("Invalid Username or Password");
    }
  }

  return (
    <div className="login-container">
        <h1>Welcome</h1>
      <h2>Login</h2>
      <input type="text"placeholder="Username"value={username}onChange={(e)=>setUsername(e.target.value)}/>
      <br/>
      <input type="password"placeholder="Password"value={password}onChange={(e)=>setPassword(e.target.value)}/>
      <br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;