import React from 'react';
import { api } from '@/api/client';

export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy stars-bg">
      <div className="max-w-md w-full mx-4 p-8 bg-navy-mid rounded-2xl border border-gold/15 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="h-px w-5 bg-gold/40" />
          <span className="text-gold/50 text-xs font-display tracking-widest uppercase">Elara Store</span>
          <div className="h-px w-5 bg-gold/40" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground/90 mb-3">Access Restricted</h1>
        <p className="text-sm text-foreground/40 mb-6 leading-relaxed font-english">
          You are not registered to use this application. Please contact the administrator to request access.
        </p>
        <button
          onClick={() => api.auth.logout('/')}
          className="bg-gold hover:bg-gold-light text-navy px-6 py-2.5 rounded-lg text-sm font-bold transition-colors font-english"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}