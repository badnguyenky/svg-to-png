const express = require("express");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const app = express();
app.use(express.json());

app.post("/convert", async (req, res) => {
    try {
        const { svg } = req.body;
        if (!svg) return res.status(400).send("SVG data is required");

        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setContent(`<html><body>${svg}</body></html>`);

        const pngBuffer = await page.screenshot();
        await browser.close();

        res.set("Content-Type", "image/png");
        res.send(pngBuffer);
    } catch (error) {
        res.status(500).send("Conversion error: " + error.message);
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
