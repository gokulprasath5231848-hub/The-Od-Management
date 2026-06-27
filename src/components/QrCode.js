'use client';

import { useState, useEffect } from 'react';

export default function QrCode({ data, size = 128 }) {
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!data) return;
    
    let cancelled = false;

    async function generateQR() {
      try {
        // Try using the qrcode library
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(data, {
          width: size,
          margin: 2,
          color: { dark: '#1a1a2e', light: '#ffffff' },
        });
        if (!cancelled) setQrUrl(url);
      } catch {
        // Fallback to public API
        if (!cancelled) {
          const encoded = encodeURIComponent(data);
          setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`);
        }
      }
    }
    
    generateQR();
    return () => { cancelled = true; };
  }, [data, size]);

  if (!data) return null;

  if (!qrUrl) {
    return (
      <div style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '8px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        Generating...
      </div>
    );
  }

  return (
    <img
      src={qrUrl}
      alt="QR Code"
      width={size}
      height={size}
      style={{ borderRadius: '4px' }}
    />
  );
}
