import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShieldAlert, ShieldCheck, Clock, Crown } from 'lucide-react';

export default function SubscriptionBadge({ session }) {
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
        <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-600 rounded-full text-xs font-bold shadow-sm">
          <Clock size={14} /> Trial Sisa {trialDaysLeft > 0 ? trialDaysLeft : 0} Hari
        </div>
      )}

      {isExpired && (
        <div className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded-full text-xs font-bold shadow-sm">
          <ShieldAlert size={14} /> Kedaluwarsa
        </div>
      )}

      {/* Tombol Upgrade (WhatsApp Admin) */}
      {!isActive && (
        <a 
          href="https://wa.me/6285124070705?text=Halo%20Admin,%20saya%20ingin%20Upgrade%20akun%20PayuO%20saya%20ke%20versi%20VIP/Pro." 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary to-[#2DD4BF] text-white rounded-full text-xs font-bold shadow-md hover:shadow-glow transition-all transform hover:-translate-y-0.5"
        >
          <Crown size={14} /> Beli Pro
        </a>
      )}
    </div>
  );
}
