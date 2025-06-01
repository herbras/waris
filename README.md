# Kalkulator Waris Islam - Sistem Faraidh Digital

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)

Kalkulator pembagian waris Islam yang lengkap dengan fitur konversi angka ke terbilang Indonesia. Dibuat mengikuti aturan fiqh madzhab Syafii dan mendukung semua skenario pembagian warisan yang umum terjadi.

## 📚 Kosakata dan Terminologi Faraidh

### Konsep Dasar

**Faraidh (الفرائض)**
- Ilmu pembagian harta warisan menurut syariat Islam
- Berdasarkan Al-Quran, Hadits, dan Ijma ulama
- Sistem perhitungan yang sangat presisi dan adil

**Tirkah (التركة)**
- Harta peninggalan pewaris setelah meninggal dunia
- Termasuk semua aset, properti, dan kekayaan
- Harus dibersihkan dari utang dan wasiat terlebih dahulu

### Urutan Pembayaran dari Harta Warisan

1. **Tajhiz wa Takfin** - Biaya perawatan jenazah dan pemakaman
2. **Utang (الديون)** - Semua kewajiban finansial pewaris
3. **Wasiat (الوصية)** - Maksimal 1/3 dari sisa harta setelah utang
4. **Mirath (الميراث)** - Pembagian warisan kepada ahli waris

### Kategori Ahli Waris

**Ashab al-Furud (أصحاب الفروض)**
- Ahli waris yang mendapat bagian tetap (fard)
- Bagian mereka sudah ditentukan Al-Quran
- Contoh: istri 1/8, ibu 1/6, anak perempuan 1/2

**Asabah (العصبة)**
- Ahli waris yang mendapat sisa harta setelah ashab al-furud
- Prinsip: laki-laki mendapat 2x bagian perempuan
- Contoh: anak laki-laki, ayah (jika tidak ada anak), saudara laki-laki

**Dhuwu al-Arham (ذوو الأرحام)**
- Kerabat jauh yang baru mendapat warisan jika tidak ada asabah
- Contoh: paman dari pihak ibu, bibi, cucu perempuan dari anak perempuan

### Istilah Teknis Perhitungan

**Asl Masalah (أصل المسألة)**
- Penyebut utama dalam pembagian warisan
- KPK (Kelipatan Persekutuan Terkecil) dari semua penyebut bagian
- Contoh: jika ada 1/2, 1/3, 1/6 → asl masalah = 6

**Siham (السهام)**
- Unit pembagian, pembilang dari pecahan bagian
- Jumlah "saham" yang diterima setiap ahli waris
- Contoh: jika asl masalah 6, maka 1/2 = 3 siham

**Awl (العول)**
- "Penyusutan proporsional" ketika total siham melebihi asl masalah
- Semua bagian dikurangi secara proporsional
- Contoh: suami 1/2 + ibu 1/6 + 2 saudari 2/3 = 8/6 > 1 → awl

**Radd (الرد)**
- "Pengembalian" sisa harta kepada ahli waris yang berhak
- Terjadi ketika total bagian < 1 dan tidak ada asabah
- Biasanya suami/istri tidak dapat radd (tergantung madzhab)

**Hajb (الحجب)**
- Sistem "pemblokiran" atau penghalangan ahli waris
- Ada yang terhalang total (hajb hirman) atau berkurang (hajb nuqsan)
- Contoh: ayah menghalang kakek, anak menghalang cucu

### Jenis-jenis Hajb

**Hajb bi al-Washf (حجب بالوصف)**
- Terhalang karena sifat (budak, beda agama, pembunuh)

**Hajb bi al-Shakhs (حجب بالشخص)**
- Terhalang karena ada orang yang lebih dekat
- Contoh: kakek terhalang ayah, cucu terhalang anak

### Bagian-bagian Fard dalam Al-Quran

- **1/2 (النصف)** - Suami tanpa anak, 1 anak perempuan, 1 saudari
- **1/4 (الربع)** - Suami dengan anak, istri tanpa anak  
- **1/8 (الثمن)** - Istri dengan anak
- **2/3 (الثلثان)** - 2+ anak perempuan, 2+ saudari
- **1/3 (الثلث)** - Ibu tanpa anak & saudara, 2+ saudara seibu
- **1/6 (السدس)** - Ibu dengan anak, ayah dengan anak, nenek, 1 saudara seibu

### Kasus-kasus Khusus

**Gharrawain/Umariyatain (الغراوين)**
- Kasus: suami + ayah + ibu
- Ibu mendapat 1/3 dari sisa (bukan 1/3 dari total)
- Dinamakan demikian karena terjadi pada masa Umar bin Khattab

**Musytarakah/Himariyah (المشتركة)**
- Saudara seibu dan saudara kandung berbagi bagian 1/3
- Bertentangan dengan prinsip bahwa saudara kandung menghalang saudara seibu
- Kasus kontroversial dalam fiqh

**Muqasamah (المقاسمة)**
- Kakek memilih antara 1/6 atau berbagi dengan saudara sebagai "saudara"
- Memilih opsi yang memberikan bagian terbesar

### Fitur Calculator Ini

**Presisi Tinggi**
- Menggunakan BigInt untuk perhitungan exact
- Tidak ada kesalahan pembulatan
- Cocok untuk harta bernilai besar

**Madzhab Syafii**
- Implementasi default mengikuti madzhab Syafii
- Dapat diperluas untuk madzhab lain
- Aturan hajb sesuai pendapat Syafii

**Validasi Komprehensif**
- Cek konsistensi input (tidak boleh suami+istri bersamaan)
- Validasi wasiat maksimal 1/3
- Deteksi error dalam data ahli waris

**Output Lengkap**
- Pembagian per kategori (fard, asabah, radd)
- Info awl/radd jika terjadi
- Daftar ahli waris yang terhalang (hajb)
- Summary perhitungan dengan asl masalah

### Batasan dan Catatan

⚠️ **Penting untuk Diketahui:**
- Calculator ini untuk **referensi dan edukasi**
- Untuk keputusan resmi, konsultasi dengan ulama yang berkompeten
- Setiap kasus mungkin memiliki kekhususan yang perlu pertimbangan ahli
- Implementasi mengikuti pendapat mayoritas dalam madzhab Syafii

📚 **Sumber Rujukan:**
- Al-Quran Surah An-Nisa ayat 11, 12, 176
- Hadits-hadits tentang faraidh
- Kitab-kitab fiqh madzhab Syafii
- Ijma ulama tentang pembagian warisan

## Fitur Utama

### 🕌 Engine Faraidh
- **Perhitungan fiqh yang benar** - Sesuai kaidah pembagian warisan Islam
- **Dukungan madzhab Syafii** - Konfigurasi default, bisa diperluas ke madzhab lain
- **Semua skenario warisan** - Awl, Radd, Hajb (pemblokiran), Asabah, Dhuwu al-Arham
- **Perhitungan presisi** - Pakai BigInt biar gak ada error pembulatan
- **Validasi menyeluruh** - Input dicek dulu biar gak ada yang aneh

### 🔢 Terbilang (Angka ke Kata)
- **Bahasa Indonesia** - Konversi angka jadi kata-kata Indonesia
- **Angka besar** - Sampai 10^36 (desiliun) pun bisa
- **Desimal juga bisa** - Angka pecahan dengan presisi tinggi
- **Format mata uang** - Khusus buat Rupiah udah ada

### 🧪 Testing
- **118 test lengkap** - Semua passed dengan coverage 100%
- **Beberapa jenis test** - Basic, advanced, sama performance
- **Skenario nyata** - Kasus-kasus warisan yang rumit udah divalidasi

## Instalasi

```bash
# Clone repositorynya
git clone <repository-url>
cd waris

# Install dependensi
bun install

# Jalanin test
bun test
```

## Cara Pakai

### Perhitungan Faraidh Dasar

```typescript
import { calculateFaraidh, HeirCounts } from './src/faraidh';

// Tentuin ahli warisnya
const heirs: HeirCounts = {
  istri: 1,           // 1 istri
  anakLaki: 2,        // 2 anak laki-laki
  anakPerempuan: 1,   // 1 anak perempuan
  ayah: 1,            // 1 ayah
  ibu: 1,             // 1 ibu
  // ... yang lain di-set 0
};

// Hitung warisannya
const result = calculateFaraidh({
  totalAssets: 1000000000n,  // 1 miliar Rupiah
  utang: 100000000n,         // 100 juta utang
  wasiatFraction: { num: 1n, den: 10n }, // wasiat 10%
  heirs
});

console.log('Total yang dibagi:', result.totalDistributed);
console.log('Bagian istri:', result.fardResults.find(r => r.type === 'istri')?.totalShare);
```

### Pake Terbilang

```typescript
import { Terbilang, terbilangRupiah } from './src/utils/Terbilang';

// Konversi angka jadi kata Indonesia
console.log(Terbilang.Convert(123456789)); 
// "seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan"

// Konversi BigInt langsung (lebih cepat)
console.log(Terbilang.ConvertBigInt(1500000n));
// "satu juta lima ratus ribu"

// Konversi mata uang
console.log(terbilangRupiah(1500000n));
// "satu juta lima ratus ribu rupiah"
```

## Dokumentasi API

### Engine Faraidh

#### `calculateFaraidh(input: CalculationInput): CalculationResult`

Fungsi utama buat hitung pembagian warisan Islam sesuai aturan fiqh.

**Parameter Input:**
- `totalAssets: bigint` - Total harta dalam Rupiah
- `utang: bigint` - Utang yang harus dibayar dalam Rupiah
- `wasiatFraction: Fraction` - Wasiat dalam bentuk pecahan (maksimal 1/3)
- `heirs: HeirCounts` - Object berisi jumlah semua ahli waris
- `madzhab?: string` - Madzhab fiqh (default: 'syafii')

**Return:** Hasil perhitungan lengkap dengan pembagian warisan

#### Jenis-jenis Ahli Waris yang Didukung

**Pasangan:**
- `suami` - Suami (0|1)
- `istri` - Istri (0|1)

**Orang Tua & Kakek Nenek:**
- `ayah` - Ayah (0|1)
- `ibu` - Ibu (0|1)
- `kakekAyah` - Kakek dari pihak ayah (0|1)
- `nenekAyah` - Nenek dari pihak ayah (0|1)
- `nenekIbu` - Nenek dari pihak ibu (0|1)

**Keturunan:**
- `anakLaki` - Anak laki-laki (≥0)
- `anakPerempuan` - Anak perempuan (≥0)
- `cucuLakiDariAnakLaki` - Cucu laki-laki dari anak laki-laki (≥0)
- `cucuPerempuanDariAnakLaki` - Cucu perempuan dari anak laki-laki (≥0)

**Saudara:**
- `saudaraLakiKandung` - Saudara laki-laki kandung (≥0)
- `saudaraPerempuanKandung` - Saudara perempuan kandung (≥0)
- `saudaraLakiSeayah` - Saudara laki-laki seayah (≥0)
- `saudaraPerempuanSeayah` - Saudara perempuan seayah (≥0)
- `saudaraLakiSeibu` - Saudara laki-laki seibu (≥0)
- `saudaraPerempuanSeibu` - Saudara perempuan seibu (≥0)

**Keluarga Jauh:**
- `keponakanLakiDariSaudaraLakiKandung` - Keponakan laki-laki dari saudara laki-laki kandung (≥0)
- `pamanKandung` - Paman kandung (≥0)
- `pamanSeayah` - Paman seayah (≥0)

### Kelas Terbilang

#### `Terbilang.Convert(input: number | Decimal, originalStr?: string): string`

Konversi angka jadi kata-kata Indonesia.

**Fitur:**
- Bisa integer dan desimal
- Angka besar banget juga bisa (sampai 10^36)
- Kalau ada originalStr, trailing zero tetap dipertahankan
- Angka negatif juga didukung

## Proses Perhitungan Warisan

Engine ini ngikutin urutan fiqh yang benar:

1. **Bayar Utang** - `utang` dipotong duluan
2. **Bayar Wasiat** - `wasiat` (maksimal 1/3 dari sisa)
3. **Tentuin Ahli Waris** - Terapin aturan hajb (pemblokiran)
4. **Hitung Fard** - Bagian tetap untuk ashab al-furud
5. **Cek Awl/Radd** - Handle kalau bagian lebih/kurang dari 1
6. **Bagi Asabah** - Sisa warisan (rasio 2:1 laki-laki:perempuan)
7. **Dhuwu al-Arham** - Kerabat jauh (kalau perlu)

### Kasus Khusus yang Ditangani

- **Awl (العول)** - Penyusutan proporsional kalau total bagian fard melebihi 1
- **Radd (الرد)** - Kembaliin sisa ke ahli waris fard yang berhak
- **Hajb (الحجب)** - Aturan pemblokiran (misalnya ayah blokir kakek)
- **Rasio 2:1** - Rasio warisan laki-laki:perempuan untuk asabah

## Testing

```bash
# Jalanin semua test
bun test

# Test spesifik
bun test:faraidh          # Semua test faraidh
bun test:faraidh:basic    # Test warisan dasar
bun test:faraidh:advanced # Kasus advanced (awl, radd)
bun test:terbilang        # Test konversi angka
```

## Struktur Project

```
src/
├── faraidh/              # Engine warisan Islam
│   ├── types.ts          # Definisi TypeScript
│   ├── index.ts          # Export utama
│   ├── config/
│   │   └── default.ts    # Konfigurasi madzhab Syafii
│   └── engine/
│       ├── calculate.ts  # Logika perhitungan utama
│       ├── utils.ts      # Utilitas matematika
│       └── terbilang.ts  # Integrasi dengan Terbilang
├── utils/
│   └── Terbilang.ts      # Konverter angka ke kata
test/
├── faraidh/              # Test faraidh
│   ├── faraidh.basic.test.ts     # Skenario dasar (13 test)
│   └── faraidh.advanced.test.ts  # Skenario advanced (16 test)
└── terbilang/            # Test terbilang
index.d.ts                # Deklarasi TypeScript
```

## Konfigurasi

### Dukungan Madzhab

Saat ini mendukung madzhab Syafii dengan konfigurasi yang bisa diperluas:

```typescript
export const defaultConfig: FaraidhConfig = {
  locale: 'id-ID',
  madzhab: 'syafii',
  currency: 'IDR',
  raddForSpouse: false,     // Pasangan gak dapat radd di Syafii
  ibtalRules: {
    // Aturan hajb (pemblokiran)
    'ayah': ['kakekAyah', 'saudaraLakiKandung', /* ... */],
    // ... aturan pemblokiran lainnya
  }
};
```

## Kontribusi

1. Fork repository ini
2. Buat branch fitur: `git checkout -b fitur/fitur-baru`
3. Lakukan perubahan dan tambah test
4. Pastikan semua test passed: `bun test`
5. Submit pull request

## Lisensi

MIT License - lihat file LICENSE untuk detail.

## Terima Kasih

- Berdasarkan prinsip fiqh Islam klasik
- Implementasi madzhab Syafii
- Dukungan bahasa Indonesia untuk aksesibilitas

---

**Catatan Penting:** Kalkulator ini dibuat untuk keperluan edukasi dan referensi. Untuk keputusan resmi terkait pembagian warisan, silakan konsultasi dengan ulama yang berkompeten. 