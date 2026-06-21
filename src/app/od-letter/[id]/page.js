'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import dataStore from '@/lib/data';
import OdLetterTemplate from '@/components/OdLetterTemplate';

export default function OdLetterPage() {
  const params = useParams();
  const router = useRouter();
  const [odRequest, setOdRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const request = dataStore.getOdRequest(params.id);
      if (request) {
        setOdRequest(dataStore.enrichOdRequest(request));
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f5' }}>
        <p>Loading OD Letter...</p>
      </div>
    );
  }

  if (!odRequest) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f5', gap: '16px' }}>
        <h2>OD Letter Not Found</h2>
        <p style={{ color: '#8888a0' }}>The requested OD letter does not exist.</p>
        <button onClick={() => router.back()} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} className="no-print">
          <button
            onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Printer size={16} />
            Print Letter
          </button>
        </div>
        <OdLetterTemplate odRequest={odRequest} />
      </div>
    </div>
  );
}
