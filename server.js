const express = require("express");
const cors = require("cors");
const svg2img = require("svg2img");
const axios = require("axios");
const qs = require("qs"); // Import querystring utility

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

    // Convert PNG buffer to Base64
    const base64Image = buffer.toString("base64");

    // Prepare form-urlencoded body
    const formBody = qs.stringify({ source: base64Image });

    try {
      // Upload PNG (Base64) using form-urlencoded
      const uploadResponse = await axios.post(
        `https://freeimage.host/api/1/upload?key=${FREEIMAGE_API_KEY}`,
        formBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (uploadResponse.data.status_code === 200) {
        return res.json({ url: uploadResponse.data.image.url });
      } else {
        return res.status(500).json({ error: "Image upload failed", details: uploadResponse.data });
      }
    } catch (uploadError) {
      return res.status(500).json({ error: "Image upload error", details: uploadError.response?.data || uploadError.message });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
