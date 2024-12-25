// loader.jsx

const Loader = () => {
  return (
    <>
      <style>{`
        .loader-container {
          height: 100vh;
          width: 100vw;
          background-color: var(--bg-color2);
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          z-index: 999;
        }

        .loader {
          width: 45px;
          height: 45px;
          border: 6px solid var(--bg-color1);
          border-radius: 50%;
          border-top: 6px solid var(--accent-color1);
          border-bottom: 6px solid var(--accent-color1);
          -webkit-animation: spin 0.5s linear infinite;
          animation: spin 0.5s linear infinite;
        }

        @-webkit-keyframes spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="loader-container">
        <div className="loader"></div>
      </div>
    </>
  );
};

export default Loader;