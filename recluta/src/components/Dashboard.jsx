import { createSignal } from "solid-js";
import "./Dashboard.css";







export default function Counter() {










  const [count, setCount] = createSignal(0);
  return (

            




    
    <button class="increment" onClick={() => setCount(count() + 1)} type="button">
      Clicks: {count()}
    </button>
  );
}
