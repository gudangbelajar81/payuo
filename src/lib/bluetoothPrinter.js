export async function printReceiptBluetooth(receiptData) {
  try {

    // ── Canvas Text → ESC/POS Rasterizer ──────────────────────────────
    const textToBitmap = async (text, fontFamily = 'Nunito', fontSize = 40) => {
      return new Promise((resolve) => {
        // Tunggu font siap di browser
        document.fonts.load(`bold ${fontSize}px '${fontFamily}'`).then(() => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          ctx.font = `bold ${fontSize}px '${fontFamily}', sans-serif`;
          const textWidth = ctx.measureText(text).width;

          // Max 384px (kertas 58mm). Jika terlalu lebar, scale turun.
          const maxW = 384;
          const scaledFontSize = textWidth > maxW ? Math.floor(fontSize * (maxW / textWidth)) : fontSize;

          ctx.font = `bold ${scaledFontSize}px '${fontFamily}', sans-serif`;
          const finalWidth = Math.ceil(ctx.measureText(text).width) + 8;
          const printWidth = Math.ceil((finalWidth + 7) / 8) * 8; // Multiple of 8
          const printHeight = scaledFontSize + 16;

          canvas.width = printWidth;
          canvas.height = printHeight;

          // Background putih
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, printWidth, printHeight);

          // Gambar teks hitam di tengah secara vertikal
          ctx.fillStyle = '#000000';
          ctx.font = `bold ${scaledFontSize}px '${fontFamily}', sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 4, printHeight / 2);

          const imgData = ctx.getImageData(0, 0, printWidth, printHeight).data;
          const widthBytes = printWidth / 8;
          const rasterData = [];

          // GS v 0 — Raster Bit Image
          rasterData.push(0x1d, 0x76, 0x30, 0x00);
          rasterData.push(widthBytes & 0xff);
          rasterData.push((widthBytes >> 8) & 0xff);
          rasterData.push(printHeight & 0xff);
          rasterData.push((printHeight >> 8) & 0xff);

          for (let y = 0; y < printHeight; y++) {
            for (let xb = 0; xb < widthBytes; xb++) {
              let byte = 0;
              for (let b = 0; b < 8; b++) {
                const x = xb * 8 + b;
                const i = (y * printWidth + x) * 4;
                const gray = imgData[i] * 0.3 + imgData[i+1] * 0.59 + imgData[i+2] * 0.11;
                if (gray < 128) byte |= (1 << (7 - b));
              }
              rasterData.push(byte);
            }
          }
          resolve(rasterData);
        });
      });
    };
    // ──────────────────────────────────────────────────────────────────

    // 1. Minta akses ke Bluetooth Device (akan memunculkan popup di browser Chrome)
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb', // Standard
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Epson/Star
        '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Generic China (RPP02N, VSC, dll)
        '000018f0-0000-1000-8000-00805f9b34fb'.replace('18f0', '18f0') 
      ]
    });

    const server = await device.gatt.connect();
    
    let service, characteristic;
    const serviceUUIDs = [
        { svc: '000018f0-0000-1000-8000-00805f9b34fb', char: '00002af1-0000-1000-8000-00805f9b34fb' },
        { svc: '49535343-fe7d-4ae5-8fa9-9fafd205e455', char: '49535343-8841-43f4-a8d4-ecbe34729bb3' },
        { svc: 'e7810a71-73ae-499d-8c15-faa9aef0c3f2', char: 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f' }
    ];

    for (const s of serviceUUIDs) {
        try {
            service = await server.getPrimaryService(s.svc);
            characteristic = await service.getCharacteristic(s.char);
            if (characteristic) break;
        } catch(e) { }
    }
    
    if (!characteristic) throw new Error("Service Print tidak ditemukan. Pastikan ini Printer Thermal.");

    // 2. Susun Data ESC/POS
    let encoder = new TextEncoder();
    
    const formatRibuan = (num) => new Intl.NumberFormat('id-ID').format(Number(String(num).replace(/[^0-9-]/g, '')) || 0);
    const formatLine = (left, right) => {
      const leftStr = String(left);
      const rightStr = formatRibuan(right);
      let spaceCount = 32 - leftStr.length - rightStr.length;
      if (spaceCount < 1) spaceCount = 1;
      return leftStr + ' '.repeat(spaceCount) + rightStr + '\n';
    };

    const { cart, totalAmount, method, customerName, date, storeSettings } = receiptData;
    const tokoName = storeSettings?.store_name || 'TOKO PAYUO';
    const tokoPhone = storeSettings?.store_phone || '';
    const tokoAddress = storeSettings?.store_address || '';
    const tokoFont = storeSettings?.store_font || 'Nunito';
    const adminName = 'Admin'; // Todo: Get from auth session if available

    let data = [
      0x1b, 0x40, // init
      0x1b, 0x61, 0x01, // Center align
    ];
    
    // 1. NAMA TOKO — cetak sebagai Bitmap dengan font kustom
    const nameBytes = await textToBitmap(tokoName.toUpperCase(), tokoFont, 42);
    data.push(...nameBytes);
    data.push(...encoder.encode('\n'));
    
    // 2. NO HP
    if (tokoPhone) {
      data.push(...encoder.encode(tokoPhone + '\n'));
    }
    
    // 4. ALAMAT TOKO
    if (tokoAddress) {
      data.push(0x1b, 0x4d, 0x01); // Font B (Kecil)
      data.push(...encoder.encode(tokoAddress + '\n'));
      data.push(0x1b, 0x4d, 0x00); // Font A
    }
    
    data.push(...encoder.encode('\n'));
    data.push(0x1b, 0x61, 0x00); // Left align
    
    // 5. TANGGAL
    data.push(...encoder.encode('Tgl: ' + date + '\n'));
    
    // 6. METODE & ADMIN
    const methodStr = method === 'kasbon' ? 'KASBON' : 'TUNAI';
    data.push(...encoder.encode(formatLine(`Tipe: ${methodStr}`, `Kasir: ${adminName}`)));

    if (method === 'kasbon') {
      data.push(...encoder.encode(`Pelanggan: ${customerName}\n`));
    }

    data.push(...encoder.encode('--------------------------------\n'));
    
    // Items
    cart.forEach(item => {
      const qty = item.qty || item.quantity || 1;
      const price = item.price || 0;
      const amount = price * qty;
      
      data.push(...encoder.encode(item.name + '\n'));
      data.push(...encoder.encode(formatLine(`${qty}x @${formatRibuan(price)}`, amount)));
    });
    
    data.push(...encoder.encode('--------------------------------\n'));
    data.push(...encoder.encode(formatLine('TOTAL:', totalAmount) + '\n'));
    
    data.push(0x1b, 0x61, 0x01); // Center align
    data.push(...encoder.encode(`\n${method === 'kasbon' ? 'BELUM LUNAS' : 'LUNAS'}\n`));
    data.push(...encoder.encode('Terima kasih atas kunjungan Anda\n'));
    
    data.push(0x1b, 0x45, 0x01); // Bold ON
    data.push(...encoder.encode('Powered by PayuO\n'));
    data.push(0x1b, 0x45, 0x00); // Bold OFF
    
    data.push(0x1b, 0x4d, 0x01); // Font B (Kecil)
    data.push(...encoder.encode('GARNETA STORE\n\n\n'));
    data.push(0x1b, 0x4d, 0x00); // Font A (Normal)
    
    data.push(0x1b, 0x61, 0x00); // Left align
    
    let buffer = new Uint8Array(data);
    
    // 3. Kirim per 512 bytes (Max payload size BLE)
    for (let i = 0; i < buffer.length; i += 512) {
      await characteristic.writeValue(buffer.slice(i, i + 512));
    }
    
    // 4. Putuskan koneksi agar printer bisa dipakai device lain
    if (device.gatt.connected) {
      device.gatt.disconnect();
    }
    
    return { success: true };
  } catch (error) {
    console.error("Bluetooth Print Error:", error);
    return { success: false, error: error.message };
  }
}
