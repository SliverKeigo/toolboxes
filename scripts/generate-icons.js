const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'favicon.ico': [16, 32],
  'apple-touch-icon.png': 180,
  'icon-192.png': 192,
  'icon-512.png': 512,
};

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'));
  
  for (const [filename, size] of Object.entries(sizes)) {
    if (Array.isArray(size)) {
      // 生成 ICO 文件
      const pngBuffers = await Promise.all(
        size.map(s => 
          sharp(svgBuffer)
            .resize(s, s)
            .png()
            .toBuffer()
        )
      );
      
      // 这里需要额外的库来生成 ICO 文件
      // 暂时只生成 PNG
      await sharp(pngBuffers[0])
        .toFile(path.join(__dirname, '../public', filename.replace('.ico', '.png')));
    } else {
      // 生成 PNG 文件
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, '../public', filename));
    }
  }
}

generateIcons().catch(console.error); 