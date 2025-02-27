const express = require("express");
const cors = require("cors");
const svg2img = require("svg2img");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
app.use(cors());
app.use(express.json());

const FREEIMAGE_API_KEY = "6d207e02198a847aa98d0a2a901485a5";

app.post("/convert", (req, res) => {
  const { svg } = req.body;
  if (!svg) return res.status(400).json({ error: "SVG data is required" });

  // Convert SVG to PNG
  svg2img(svg, { format: "png" }, async (error, buffer) => {
    if (error) return res.status(500).json({ error: "Conversion failed" });

    try {
      // Prepare image upload
      const form = new FormData();
      form.append("key", FREEIMAGE_API_KEY);
      form.append("source", buffer, { filename: "converted.png", contentType: "image/png" });
      
      // Upload PNG to FreeImage.host
      const uploadResponse = await axios.post("https://freeimage.host/api/1/upload", form, {
        headers: form.getHeaders(),
      });

      if (uploadResponse.data.status_code === 200) {
        return res.json({ url: uploadResponse.data.image.url });
      } else {
        return res.status(500).json({ error: "Image upload failed", details: uploadResponse.data });
      }
    } catch (uploadError) {
      return res.status(500).json({ error: "Image upload error", details: uploadError.message });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
