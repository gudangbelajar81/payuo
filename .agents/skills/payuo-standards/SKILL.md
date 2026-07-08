---
name: PayuO Architecture & UI Standards
description: Standar arsitektur mutlak dan panduan UI/UX (Masa Depan) untuk pengembangan aplikasi PayuO SaaS. WAJIB dibaca sebelum mengubah komponen UI apapun!
---

# 🚀 Standar Mutlak Aplikasi PayuO (Anti-Jadul)

Untuk mencegah aplikasi kembali ke tampilan "Jaman Batu" (tanpa CSS), setiap agen AI **DIWAJIBKAN** mematuhi standar berikut saat bekerja di repositori ini:

## 1. TECH STACK (Kerangka Kerja)
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS v3 (Wajib)
- **Backend & Auth**: Supabase
- **Icons**: Lucide-React

## 2. ATURAN KERAS TAILWIND CSS (CRITICAL!)
- **SEBELUM** membuat komponen UI baru dengan *class* Tailwind (seperti `bg-slate-900`, `rounded-3xl`, dll), Anda **WAJIB** memverifikasi bahwa file `tailwind.config.js` dan `postcss.config.js` benar-benar ada di *root* proyek.
- Jika file tersebut hilang, **JANGAN** menulis UI apapun! Segera jalankan `npm install -D tailwindcss postcss autoprefixer` dan inisialisasi file konfigurasinya.
- Pastikan direktif `@tailwind` selalu ada di baris teratas `src/index.css`.

## 3. PANDUAN DESAIN & ESTETIKA (Masa Depan)
- **Dilarang Keras** menggunakan CSS seadanya atau desain tahun 2010-an.
- **Glassmorphism**: Gunakan efek kaca dengan `bg-white/10 backdrop-blur-md` untuk elemen melayang (modal, notifikasi).
- **Warna Wajib (Color Palette)**:
  - Utama (Primary): Teal (`text-teal-500`, `bg-teal-600`) & Emerald (`emerald-400`).
  - Latar Belakang (Background): `bg-slate-50` untuk terang, `bg-slate-900` untuk gelap.
  - Aksen Mewah: `amber-500` atau `indigo-500` untuk penawaran premium (VIP).
- **Animasi (Micro-interactions)**: Wajib tambahkan `transition-all transform hover:-translate-y-0.5 hover:shadow-lg` pada semua tombol CTA utama.

## 4. STANDAR DATABASE & SUPABASE
- Jika terjadi masalah layar putih (*Blank Screen*) karena `supabase` *null*, selalu ingat bahwa kita menggunakan kunci *hardcode* di `src/lib/supabaseClient.js` untuk menghindari pemblokiran *Environment Variables* oleh Vercel. Jangan ubah ini kembali ke `.env` kecuali Vercel sudah dikonfigurasi secara manual.

## 5. FITUR BISNIS & COPYWRITING
- Selalu gunakan teknik *copywriting* persuasif (seperti efek *Decoy Pricing*, ketakutan FOMO, atau narasi "pantau dari jauh").
- Bahasa default aplikasi adalah Bahasa Indonesia yang profesional namun santai (kasual).
