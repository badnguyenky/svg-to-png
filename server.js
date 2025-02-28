const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/convert", async (req, res) => {
    try {
        const { svgUrl } = req.body;
        if (!svgUrl) return res.status(400).json({ error: "SVG URL is required" });

        // Launch Puppeteer with Vercel-compatible options
        const browser = await puppeteer.launch({
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--disable-gpu"
            ],
            executablePath: await chromium.executablePath,
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(svgUrl);

        // Capture screenshot as PNG
        const pngBuffer = await page.screenshot();
        await browser.close();

        res.setHeader("Content-Type", "image/png");
        res.send(pngBuffer);
    } catch (error) {
        res.status(500).json({ error: "Error processing SVG", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
