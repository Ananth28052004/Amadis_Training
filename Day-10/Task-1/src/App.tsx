import { useState } from "react";
import Login from "./Component/Login";

import Input from "./Component/Input";
function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      {isLogin ? (
        <Input></Input>
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}
    </>
  );
}

export default App;