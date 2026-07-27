import { useState } from "react";
import "../App.css";

function Function() {
  const [print, setprint] = useState(false);
  function ShowMethod() {
    return (
      <>
        <h2>Ananth</h2>
        <h4>Developer</h4>
      </>
    );
  }
  return (
    <>
      <button className="btn" onClick={() => setprint(true)}>
        Show
      </button>
      <button onClick={() => setprint(false)}>Hide</button>
      <div>{print ? ShowMethod() : ""}</div>
    </>
  );
}
export default Function;