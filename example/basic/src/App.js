import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [count, setCount] = useState(1);
  return (
    <div className="box">
      test {count}
      <button
        type="button"
        onClick={() => {
          console.log('count:', count);
          let num = count + 1;
          console.log('num:', num);
          setCount(num);
        }}
      >
        Count +1
      </button>
    </div>
  );
};

export default App;
