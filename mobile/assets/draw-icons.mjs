// Draws the app icon and splash PNGs in this folder. Run from web/ (it uses Playwright from there):
//   cd web && node ../mobile/assets/draw-icons.mjs ../mobile/assets
// then: cd ../mobile && npm run assets
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
const out = process.argv[2];
// [name, size, bg, circle?, glyph colour, glyph height as share of size, name text colour]
const jobs = [
  ["icon-only.png", 1024, "#1f3d33", null, "#fff", 0.42],
  ["icon-foreground.png", 1024, null, null, "#fff", 0.3],
  ["icon-background.png", 1024, "#1f3d33", null, null, 0],
  ["splash.png", 2732, "#f5f3ee", "#1f3d33", "#fff", 0.07, "#1a1c1a"],
  ["splash-dark.png", 2732, "#111312", "#cbdcc6", "#1a1c1a", 0.07, "#eef0ec"],
];
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<canvas id=c></canvas>");
for (const job of jobs) {
  const data = await page.evaluate(([name, S, bg, circle, fg, share, label]) => {
    const c = document.getElementById("c"); c.width = c.height = S;
    const x = c.getContext("2d");
    x.clearRect(0, 0, S, S);
    if (bg) { x.fillStyle = bg; x.fillRect(0, 0, S, S); }
    let cy = S / 2, R = 0;
    if (circle) { R = S * 0.077; cy = S / 2 - S * 0.03; x.fillStyle = circle; x.beginPath(); x.arc(S / 2, cy, R, 0, 7); x.fill(); }
    if (fg) {
      // Size the letter by its ink height, then centre the ink box (not the line box).
      x.font = `600 100px "Segoe UI", Arial, sans-serif`;
      let m = x.measureText("م");
      const k = (S * share) / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
      x.font = `600 ${100 * k}px "Segoe UI", Arial, sans-serif`;
      m = x.measureText("م");
      const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      x.fillStyle = fg; x.textBaseline = "alphabetic";
      x.fillText("م", S / 2 - w / 2 + m.actualBoundingBoxLeft, cy - h / 2 + m.actualBoundingBoxAscent);
    }
    if (label) {
      x.font = `600 ${S * 0.044}px "Segoe UI", Arial, sans-serif`; x.fillStyle = label; x.textAlign = "center"; x.textBaseline = "top";
      x.fillText("QMuraajah", S / 2, cy + R + S * 0.03);
    }
    return c.toDataURL("image/png").split(",")[1];
  }, job);
  writeFileSync(`${out}/${job[0]}`, Buffer.from(data, "base64"));
}
await browser.close();
console.log("done");
