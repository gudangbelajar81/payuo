export async function printReceiptBluetooth(receiptData) {
  try {
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

    let data = [
      0x1b, 0x40, // init
      0x1b, 0x61, 0x01, // Center align
      0x1b, 0x45, 0x01, // Bold ON
      0x1d, 0x21, 0x11, // Double size
      ...encoder.encode(tokoName + '\n'),
      0x1d, 0x21, 0x00, // Normal size
      0x1b, 0x45, 0x00, // Bold OFF
    ];
    
    if (tokoPhone) {
      data.push(...encoder.encode(tokoPhone + '\n'));
    }
    
    data.push(
      ...encoder.encode('\n'),
      0x1b, 0x61, 0x00, // Left align
      ...encoder.encode('Tgl: ' + date + '\n'),
      ...encoder.encode(`Metode: ${method === 'kasbon' ? 'KASBON' : 'TUNAI'}\n`)
    );

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
    data.push(...encoder.encode('Powered by PayuO (GARNETA STORE)\n\n\n'));
    
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
