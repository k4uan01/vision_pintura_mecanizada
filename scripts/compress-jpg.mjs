import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const dir = "imagens/otimizadas";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg"));

for (const file of files) {
  const src = path.join(dir, file);
  const img = await Jimp.read(src);
  await img.write(src, { quality: 72 });
  const size = fs.statSync(src).size;
  console.log(file, Math.round(size / 1024) + "kb", img.width + "x" + img.height);
}
