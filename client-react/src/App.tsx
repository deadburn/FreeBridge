import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState<any[]>([]);

  //Peticion HTTP
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err: any) {
        if (err.name !== "AbortError") console.error(err);
      }
    })();
    return () => controller.abort();
  }, []);

  //App
  return (
    <>
      <div className="card">
        <h2>Users</h2>
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
