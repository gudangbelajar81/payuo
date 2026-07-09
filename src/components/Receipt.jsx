import React from 'react';

export default function Receipt({ data }) {
  if (!data) return null;
  const { cart, totalAmount, method, customerName, date } = data;

  const styles = {
    container: {
      width: '58mm',
      padding: '2mm', // Sedikit ruang agar tidak kena pinggir kertas
      fontSize: '12px',
      lineHeight: '1.2',
      color: '#000',
      background: '#fff',
      margin: '0 auto',
      textAlign: 'left'
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
      <div style={styles.header}>
        <h2 style={styles.title}>TOKO PAYUO</h2>
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
        <p style={{ margin: '4px 0 0 0', fontSize: '8px', color: '#333' }}>Powered by PayuO POS</p>
      </div>
    </div>
  );
}
