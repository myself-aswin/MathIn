// App.jsx
// This project is developed and maintained by 'Aswin V S' (https://github.com/aswin-vs)

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./components/homepage";
import Prepare from "./components/prepare";
import Practice0 from "./components/practice0";
import Participate0 from "./components/participate0";
import CertificateVerify from "./components/certificateVerify";

const App = () => {
  useEffect(() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchWithRetry = async (
      url,
      options,
      retries = 2,
      delayMs = 1000,
    ) => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await fetch(url, options);
          if (response.ok) {
            return response;
          }
        } catch (err) {
          console.error(`Ping error: `, err);
        }
        if (attempt < retries) {
          await delay(delayMs);
        }
      }
      throw new Error(`Failed to fetch after ${retries + 1} attempts`);
    };

    const pingServers = async () => {
      try {
        await fetchWithRetry(
          "https://mathin-certapi-miqw.onrender.com/health",
          { method: "GET" },
        );
        console.log(`API Health - Ping successful !`);
      } catch (err) {
        console.error(`API Health - Ping error after retries: `, err);
      }

      try {
        await fetchWithRetry(
          "https://mathin-certapi-miqw.onrender.com/cleanup",
          { method: "GET" },
        );
        console.log(`API Cleanup - Ping successful !`);
      } catch (err) {
        console.error(`API Cleanup - Ping error after retries: `, err);
      }
    };

    pingServers();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="prepare" element={<Prepare />} />
      <Route path="practice" element={<Practice0 />} />
      <Route path="participate" element={<Participate0 />} />
      <Route path="verify/:certificateId" element={<CertificateVerify />} />
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  );
};

export default App;