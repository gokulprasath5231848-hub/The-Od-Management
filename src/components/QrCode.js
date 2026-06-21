'use client';

import { useState, useEffect } from 'react';
import compStyles from '@/styles/components.module.css';

export default function QrCode({ data, size = 128 }) {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (data) {
      // Use a public QR code API
      const encoded = encodeURIComponent(data);
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=1a1a2e`);
    }
  }, [data, size]);

  if (!data) return null;

  return (
    <div className={compStyles.qrCodeWrapper}>
      {qrUrl ? (
        <img
          src={qrUrl}
          alt="QR Code"
          width={size}
          height={size}
          className={compStyles.qrCodeImg}
        />
      ) : (
        <div className={compStyles.qrCodeLoading} style={{ width: size, height: size }}>
          Generating QR...
        </div>
      )}
    </div>
  );
}
