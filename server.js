const express = require("express");
const cors = require("cors");
const svg2img = require("svg2img");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/convert", (req, res) => {
  const { svg } = req.body;
  if (!svg) return res.status(400).json({ error: "SVG data is required" });

  // Convert SVG to PNG
  svg2img(svg, { format: "png" }, (error, buffer) => {
    if (error) return res.status(500).json({ error: "Conversion failed" });

    // Convert PNG buffer to Base64
    const base64Image = buffer.toString("base64");

    // Return Base64 string
    return res.json({ base64: base64Image });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
