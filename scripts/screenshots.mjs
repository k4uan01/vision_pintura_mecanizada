import puppeteer from "puppeteer-core";

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars"],
});

async function shots(width, height, prefix) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle2", timeout: 30000 });
  await page.waitForSelector(".hero h1");
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `preview/${prefix}-top.png` });
  await page.evaluate(() => document.getElementById("sobre")?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `preview/${prefix}-sobre.png` });
  await page.evaluate(() => document.getElementById("diferenciais")?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `preview/${prefix}-why.png` });
  await page.evaluate(() => document.getElementById("contato")?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `preview/${prefix}-contato.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `preview/${prefix}-footer.png` });
  await page.close();
}

await shots(1440, 900, "d");
await shots(390, 844, "m");
await browser.close();
console.log("screenshots ok");
