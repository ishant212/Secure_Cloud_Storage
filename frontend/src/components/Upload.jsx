import axios from "axios";
import { useState } from "react";

export default function Upload() {
  const [fileId, setFileId] = useState("");

  const upload = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    const res = await axios.post("http://localhost:3000/upload", form);
    setFileId(res.data.file_id);
  };

  return (
    <div className="text-center py-10">
      <input type="file" onChange={upload} />
      {fileId && (
        <p className="mt-4 text-green-400">File ID: {fileId}</p>
      )}
    </div>
  );
}