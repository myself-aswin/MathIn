// pingServer.jsx

import { useEffect } from "react";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 2, delayMs = 1000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }

    if (attempt < retries) {
      await delay(delayMs);
    }
  }
  throw new Error(`Failed to fetch after ${retries + 1} attempts`);
};

const PingServers = () => {
  useEffect(() => {
    const pingServers = async () => {
      try {
        await fetchWithRetry(
          "https://mathin-certapi-miqw.onrender.com/health",
          { method: "GET" }
        );
        console.log(`API Health - Ping successful !`);
      } catch (err) {
        console.error(`API Health - Ping error after retries: `, err);
      }

      try {
        await fetchWithRetry(
          "https://mathin-certapi-miqw.onrender.com/cleanup",
          { method: "GET" }
        );
        console.log(`API Cleanup - Ping successful !`);
      } catch (err) {
        console.error(`API Cleanup - Ping error after retries: `, err);
      }
    };

    pingServers();
  }, []);

  return null;
};

export default PingServers;