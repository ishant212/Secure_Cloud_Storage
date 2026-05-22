const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
const upload = multer();

// ✅ Expose Content-Disposition so browser can read it
app.use(cors({
  exposedHeaders: ['Content-Disposition', 'Content-Type']
}));

/* =========================
   UPLOAD
========================= */
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      "http://127.0.0.1:8000/upload",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* =========================
   DOWNLOAD
========================= */
app.get("/download/:id", async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: `http://127.0.0.1:8000/download/${req.params.id}`,
      responseType: "arraybuffer",
    });

    let filename = "downloaded_file";
    const disposition = response.headers["content-disposition"];

    console.log("disposition header:", disposition);

    if (disposition) {
      const match =
        disposition.match(/filename\*=UTF-8''(.+)/i) ||
        disposition.match(/filename="?([^"]+)"?/i);

      if (match && match[1]) {
        filename = decodeURIComponent(match[1].trim());
      }
    }

    console.log("Serving file as:", filename);

    res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(response.data));

  } catch (error) {
    console.error("DOWNLOAD ERROR:", error.message);
    res.status(500).json({ error: "Download failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});