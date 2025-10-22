"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch backend message
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching message"));

    // Fetch users
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
        marginTop: "50px",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "20px",
      }}
    >
      <h1>Fullstack App Demo</h1>
      <p>{message}</p>

      <h2>Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div style={{ textAlign: "left", display: "inline-block" }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
              }}
            >
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
