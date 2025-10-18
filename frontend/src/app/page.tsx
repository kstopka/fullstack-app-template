"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching message"));
  }, []);

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>Fullstack App Demo</h1>
      <p>{message}</p>
    </main>
  );
}
