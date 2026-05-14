import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '@/api/client';
import { Outlet } from 'react-router-dom';
import { ensureAuthBootstrap } from '@/api/bootstrapAuth';

export default function AdminGuard() {
  const [status, setStatus] = useState('loading'); // loading | allowed | denied

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureAuthBootstrap();
        const user = await api.auth.me();
        if (cancelled) return;
        if (user && user.role === 'admin') {
          setStatus('allowed');
        } else {
          setStatus('denied');
        }
      } catch {
        if (!cancelled) setStatus('denied');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-navy">
        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}