import { Jimp, intToRGBA, rgbaToInt } from "jimp";
import fs from "fs";

const outDir = "imagens/otimizadas";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function bbox(img, alphaMin = 8) {
  let minX = img.width;
  let minY = img.height;
  let maxX = 0;
  let maxY = 0;
  img.scan((x, y) => {
    const p = intToRGBA(img.getPixelColor(x, y));
    if (p.a >= alphaMin) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  });
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

const logo = await Jimp.read("imagens/logo_png.png");
const box = bbox(logo);
console.log("logo bbox", box);
const pad = 8;
const crop = {
  x: Math.max(0, box.x - pad),
  y: Math.max(0, box.y - pad),
  w: Math.min(logo.width - Math.max(0, box.x - pad), box.w + pad * 2),
  h: Math.min(logo.height - Math.max(0, box.y - pad), box.h + pad * 2),
};
const logoCrop = logo.clone().crop(crop);
await logoCrop.write(`${outDir}/logo.png`);

const white = logoCrop.clone();
white.scan((x, y) => {
  const p = intToRGBA(white.getPixelColor(x, y));
  if (p.a > 0) {
    white.setPixelColor(rgbaToInt(255, 255, 255, p.a), x, y);
  }
});
await white.write(`${outDir}/logo-white.png`);
console.log("logo done");

async function toJpg(src, dest, w) {
  const im = await Jimp.read(src);
  const resized = im.resize({ w });
  await resized.write(dest);
  console.log("wrote", dest, resized.width, "x", resized.height);
}

const hero = "imagens/Pintura que transforma histórias.png";
const sobre = "imagens/Pintor transformando ambientes no corredor.png";
const detalhe = "imagens/Pintura em Cada Detalhe.png";
const pistola = "imagens/Pistola de pintura em ação.png";

await toJpg(hero, `${outDir}/hero.jpg`, 1920);
await toJpg(sobre, `${outDir}/sobre.jpg`, 1400);
await toJpg(detalhe, `${outDir}/porque.jpg`, 1920);
await toJpg(pistola, `${outDir}/pistola.jpg`, 1400);

async function cropJpg(src, dest, x, y, w, h, outW = 900) {
  const im = await Jimp.read(src);
  const c = im.crop({
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  });
  await c.resize({ w: outW }).write(dest);
  console.log("crop", dest, c.width, "x", c.height);
}

await cropJpg(hero, `${outDir}/servico-fachada.jpg`, 0, 0, 820, 819, 800);
await cropJpg(hero, `${outDir}/servico-interno.jpg`, 1080, 30, 540, 760, 800);
await cropJpg(hero, `${outDir}/projeto-industrial.jpg`, 80, 40, 980, 760, 800);
await cropJpg(hero, `${outDir}/projeto-residencial.jpg`, 1180, 60, 480, 720, 800);
await cropJpg(sobre, `${outDir}/servico-residencial.jpg`, 0, 0, 980, 941, 800);
await cropJpg(sobre, `${outDir}/equipe.jpg`, 280, 40, 780, 820, 800);
await cropJpg(pistola, `${outDir}/servico-mecanizada.jpg`, 0, 0, 1100, 941, 800);
await cropJpg(detalhe, `${outDir}/servico-acabamento.jpg`, 180, 0, 860, 941, 800);
await cropJpg("imagens/Sala Luxuosa Minimalista em Montagem.png", `${outDir}/sala-luxuosa.jpg`, 0, 480, 941, 620, 1200);
await cropJpg(`${outDir}/hero.jpg`, `${outDir}/hero-mobile.jpg`, 1080, 0, 470, 819, 900);

console.log("all done");
