import { useState } from "react";

export default function Download() {
  const [id, setId] = useState("");

  return (
    <div className="text-center py-10">
      <input
        className="p-2 text-black"
        placeholder="Enter File ID"
        onChange={(e) => setId(e.target.value)}
      />

      <button
        className="ml-2 bg-green-500 px-4 py-2 rounded"
        onClick={() => window.open(`http://localhost:3000/download/${id}`)}
      >
        Download
      </button>
    </div>
  );
}