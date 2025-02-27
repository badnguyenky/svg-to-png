const express = require("express");
const cors = require("cors");
const svg2img = require("svg2img");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/convert", (req, res) => {
  const { svg } = req.body;
  if (!svg) return res.status(400).json({ error: "SVG required" });

  svg2img(svg, { format: "png" }, (error, buffer) => {
    if (error) return res.status(500).json({ error: "Conversion failed" });
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
