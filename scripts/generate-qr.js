import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const targetUrl = 'https://payuo.alvezadigital.com';
const outputDir = './public/marketing';
const outputPath = path.join(outputDir, 'sales_qrcode.png');

// Ensure directory exists
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate QR Code with high resolution and some styling
QRCode.toFile(outputPath, targetUrl, {
  color: {
    dark: '#0f172a',  // Slate 900 (Dark Blue/Black)
    light: '#ffffff' // Transparent or White background
  },
  width: 1024, // High resolution for printing (Brosur/Banner)
  margin: 2
}, function (err) {
  if (err) throw err;
  console.log('✅ Berhasil mencetak QR Code beresolusi tinggi ke: ' + outputPath);
  console.log('🔗 URL Target: ' + targetUrl);
});
