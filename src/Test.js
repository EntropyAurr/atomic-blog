import { useState } from "react";

function SlowComponent() {
  // If this is too slow on your maching, reduce the `length`
  const words = Array.from({ length: 700 }, () => "WORD");
  return (
    <ul>
      {words.map((word, i) => (
        <li key={i}>
          {i}: {word}
        </li>
      ))}
    </ul>
  );
}

function Counter({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Slow counter?!?</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>

      {children}
    </div>
  );
}

export default function Test() {
  // const [count, setCount] = useState(0);
  // return (
  //   <div>
  //     <h1>Slow counter?!?</h1>
  //     <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>

  //     <SlowComponent />
  //   </div>
  // );

  return (
    <div>
      <Counter>
        <SlowComponent /> {/* this component is created before the Counter component re-rendered => SlowComponent won't be re-rendered at when clicking the button, this mean it won't be affected by the state change in the Counter */}
      </Counter>
    </div>
  );
}
