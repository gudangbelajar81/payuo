import React from 'react';

export default function Receipt({ data }) {
  if (!data) return null;
  const { cart, totalAmount, method, customerName, date, storeSettings } = data;

  const styles = {
    container: {
      width: '58mm',
      padding: '2mm', // Sedikit ruang agar tidak kena pinggir kertas
      fontSize: '12px',
      lineHeight: '1.2',
      color: '#000',
      background: '#fff',
      margin: '0 auto',
      textAlign: 'left',
      position: 'relative',
      zIndex: 1
    },
    watermarkContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: -1,
      opacity: 0.15, /* Transparansi untuk printer thermal */
      filter: 'grayscale(100%)' /* Wajib abu-abu/hitam putih untuk thermal */
    },
    header: {
      textAlign: 'center',
      marginBottom: '8px',
      borderBottom: '1px dashed #000',
      paddingBottom: '8px'
    },
    title: {
      fontSize: '16px',
      fontWeight: 'bold',
      margin: '0 0 4px 0'
    },
    subtitle: {
      fontSize: '10px',
      margin: 0
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '4px'
    },
    itemsContainer: {
      borderBottom: '1px dashed #000',
      paddingBottom: '8px',
      marginBottom: '8px',
      marginTop: '8px'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: '14px',
      marginTop: '4px'
    },
    footer: {
      textAlign: 'center',
      marginTop: '16px',
      fontSize: '10px'
    }
  };

  return (
    <div id="printable-receipt" style={styles.container}>
      {/* Watermark Struk */}
      <div style={styles.watermarkContainer}>
        <img src="/payuo_logo.png" alt="Watermark" style={{ width: '40mm', height: 'auto', objectFit: 'contain' }} />
      </div>

      <div style={styles.header}>
        {storeSettings?.store_logo_url && (
          <img src={storeSettings.store_logo_url} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', margin: '0 auto 4px auto', display: 'block', borderRadius: '50%' }} />
        )}
        <h2 style={styles.title}>{storeSettings?.store_name || 'TOKO PAYUO'}</h2>
        {storeSettings?.store_address && <p style={{ fontSize: '10px', margin: '0 0 2px 0' }}>{storeSettings.store_address}</p>}
        {storeSettings?.store_phone && <p style={{ fontSize: '10px', margin: '0 0 4px 0' }}>{storeSettings.store_phone}</p>}
        <p style={styles.subtitle}>{date}</p>
      </div>

      <div>
        <p style={{ margin: 0, fontSize: '10px' }}>Metode: {method === 'kasbon' ? 'KASBON' : 'TUNAI'}</p>
        {method === 'kasbon' && (
          <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold' }}>Pelanggan: {customerName}</p>
        )}
      </div>

      <div style={styles.itemsContainer}>
        {cart.map((item, index) => (
          <div key={index} style={{ marginBottom: '6px' }}>
            <div style={styles.row}>
              <span style={{ fontWeight: 'bold' }}>{item.name}</span>
            </div>
            <div style={styles.row}>
              <span>{item.quantity}x @{item.price.toLocaleString('id-ID')}</span>
              <span>{(item.quantity * item.price).toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.totalRow}>
        <span>TOTAL</span>
        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
      </div>

      <div style={styles.footer}>
        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '12px' }}>
          {method === 'kasbon' ? 'BELUM LUNAS' : 'LUNAS'}
        </p>
        <p style={{ margin: 0 }}>Terima Kasih Atas Kunjungan Anda</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: '#333' }}>Powered by PayuO (Garneta Store)</p>
      </div>
    </div>
  );
}
