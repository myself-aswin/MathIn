// countdown.jsx

import { useEffect, useState } from 'react';

const Countdown = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <>
      <style>{`
      .countdown-container {
        height: 100vh;
        width: 100vw;
        background-color: var(--bg-color2);
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: none;
        overflow: hidden;
        z-index: 999;
      }

      .countdown {
        font-size: 7.5rem;
        font-weight: bold;
        color: var(--accent-color1);
      }
    `}</style>

      <div className="countdown-container">
        <h1 className="countdown">{count > 0 ? count : 'Go!'}</h1>
      </div>
    </>
  );
};

export default Countdown;