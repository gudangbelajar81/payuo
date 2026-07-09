-- ==========================================
-- GARBAGE COLLECTOR PAYUO (Pembersih Sampah)
-- ==========================================
-- Robot ini akan berjalan setiap malam jam 00:00
-- Tugasnya: Menghapus akun dan data barang pengguna 
-- yang tidak pernah login selama lebih dari 10 hari.

-- 1. Pastikan ekstensi cron aktif
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Jadwalkan robot pembersih
SELECT cron.schedule(
  'pembersih_sampah_payuo',     -- Nama tugas
  '0 0 * * *',                  -- Berjalan setiap jam 00:00 (tengah malam)
  $$
    -- Hapus pengguna dari auth.users yang login terakhirnya lebih dari 10 hari lalu
    -- (Otomatis akan menghapus barang dan foto mereka jika Foreign Key CASCADE aktif)
    DELETE FROM auth.users 
    WHERE last_sign_in_at < NOW() - INTERVAL '10 days'
    AND id IN (
        -- Pastikan hanya menghapus akun Gratis (yang bukan premium)
        -- Jika nanti ada tabel langganan, bisa disesuaikan di sini.
        SELECT user_id FROM public.store_settings
    );
  $$
);

-- ==========================================
-- CARA PENGGUNAAN:
-- Copy seluruh teks ini dan Paste ke dalam 
-- menu "SQL Editor" di dasbor Supabase Anda,
-- lalu klik tombol "Run".
-- ==========================================
