import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShieldAlert, ShieldCheck, Clock, Crown } from 'lucide-react';

export default function SubscriptionBadge({ session, onOpenPricing }) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStoreInfo();
    }
  }, [session]);

  const fetchStoreInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      setStore(data);
    } catch (err) {
      console.error("Error fetching store info:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse w-24 h-8 bg-surface-hover rounded-full"></div>;
  }

  if (!store) return null;

  const isTrial = store.subscription_status === 'trial';
  const isActive = store.subscription_status === 'active';
  const isExpired = store.subscription_status === 'expired';

  // Calculate remaining trial days
  let trialDaysLeft = 0;
  if (isTrial && store.trial_ends_at) {
    const end = new Date(store.trial_ends_at);
    const now = new Date();
    trialDaysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="flex items-center gap-sm">
      {isActive && (
        <div className="flex items-center gap-1 px-3 py-1 bg-[#F0FDFA] border border-[#2DD4BF] text-[#0D9488] rounded-full text-xs font-bold shadow-sm">
          <ShieldCheck size={14} /> VIP Aktif
        </div>
      )}

      {isTrial && (
        <div style={{
          display:'flex',alignItems:'center',gap:'5px',
          padding:'4px 12px',
          background:'linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.1))',
          border:'1px solid rgba(251,191,36,0.4)',
          borderRadius:'999px',
          fontSize:'11px',fontWeight:700,
          color:'#f59e0b',
          cursor:'pointer',
        }} onClick={onOpenPricing}>
          <Clock size={13} />
          {trialDaysLeft > 3
            ? `✨ AKSES PENUH — Sisa ${trialDaysLeft} Hari`
            : trialDaysLeft > 0
            ? `⚠️ Trial Habis ${trialDaysLeft} Hari Lagi!`
            : '🔴 Trial Habis!'}
        </div>
      )}

      {isExpired && (
        <div className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded-full text-xs font-bold shadow-sm">
          <ShieldAlert size={14} /> Kedaluwarsa
        </div>
      )}

      {/* Tombol Upgrade (Membuka Pricing Modal) */}
      {!isActive && (
        <button 
          onClick={onOpenPricing}
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary to-[#2DD4BF] text-white rounded-full text-xs font-bold shadow-md hover:shadow-glow transition-all transform hover:-translate-y-0.5"
        >
          <Crown size={14} /> Beli Pro
        </button>
      )}
    </div>
  );
}
