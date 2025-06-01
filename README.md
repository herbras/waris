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

## 📋 Use Cases - Contoh Penggunaan Real

### 🕌 Faraidh Use Cases

#### **Use Case 1: Kasus Basic - Pak Ahmad Meninggal**
```typescript
import { calculateFaraidh } from './src/faraidh';
import { Terbilang } from './src/utils/Terbilang';

// Pak Ahmad meninggal, harta Rp 600 juta
// Ahli waris: istri + 2 anak perempuan
const result = calculateFaraidh({
  totalAssets: 600000000n,  // 600 juta
  utang: 0n,                // tidak ada utang
  wasiatFraction: { num: 0n, den: 1n }, // tidak ada wasiat
  heirs: {
    istri: 1,
    anakPerempuan: 2,
    // semua yang lain: 0
    suami: 0, ayah: 0, ibu: 0, anakLaki: 0,
    kakekAyah: 0, nenekAyah: 0, nenekIbu: 0,
    cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
    saudaraLakiKandung: 0, saudaraPerempuanKandung: 0,
    saudaraLakiSeayah: 0, saudaraPerempuanSeayah: 0,
    saudaraLakiSeibu: 0, saudaraPerempuanSeibu: 0,
    keponakanLakiDariSaudaraLakiKandung: 0,
    pamanKandung: 0, pamanSeayah: 0
  }
});

// Tampilkan hasil
console.log('=== WARIS PAK AHMAD ===');
console.log(`Harta bersih: Rp ${result.netEstate.toLocaleString()}`);

result.fardResults.forEach(heir => {
  console.log(`${heir.type}: Rp ${heir.totalShare.toLocaleString()} (${heir.portion.num}/${heir.portion.den})`);
  console.log(`Terbilang: ${Terbilang.ConvertBigInt(heir.totalShare)} rupiah`);
});

// Output:
// Istri: Rp 75,000,000 (1/8) - karena ada anak
// Anak Perempuan: Rp 400,000,000 total (2/3) - dibagi 2 = Rp 200,000,000 per anak
// Sisa Rp 125,000,000 ke dhuwu al-arham
```

#### **Use Case 2: Kasus dengan Utang & Wasiat - Bu Siti**
```typescript
import { calculateFaraidh } from './src/faraidh';

// Bu Siti meninggal, harta Rp 800 juta, utang Rp 150 juta, wasiat 10%
const result = calculateFaraidh({
  totalAssets: 800000000n,   // 800 juta
  utang: 150000000n,         // 150 juta utang bank
  wasiatFraction: { num: 1n, den: 10n }, // wasiat 10% untuk yayasan
  heirs: {
    suami: 1,
    ayah: 1,
    ibu: 1,
    anakLaki: 1,
    anakPerempuan: 1,
    // yang lain: 0
    istri: 0, kakekAyah: 0, nenekAyah: 0, nenekIbu: 0,
    cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
    saudaraLakiKandung: 0, saudaraPerempuanKandung: 0,
    saudaraLakiSeayah: 0, saudaraPerempuanSeayah: 0,
    saudaraLakiSeibu: 0, saudaraPerempuanSeibu: 0,
    keponakanLakiDariSaudaraLakiKandung: 0,
    pamanKandung: 0, pamanSeayah: 0
  }
});

console.log('=== WARIS BU SITI ===');
console.log(`Harta awal: Rp ${800000000n.toLocaleString()}`);
console.log(`Utang: Rp ${150000000n.toLocaleString()}`);
console.log(`Wasiat (10%): Rp ${result.wasiatAmount?.toLocaleString()}`);
console.log(`Harta bersih: Rp ${result.netEstate.toLocaleString()}`);

// Tampilkan pembagian
result.fardResults.forEach(heir => {
  console.log(`${heir.type}: Rp ${heir.totalShare.toLocaleString()}`);
});

result.asabahResults.forEach(heir => {
  console.log(`${heir.type} (Asabah): Rp ${heir.totalShare.toLocaleString()}`);
});
```

#### **Use Case 3: Kasus Advanced - 'Awl (Penyusutan)**
```typescript
import { calculateFaraidh } from './src/faraidh';

// Pak Budi meninggal tanpa anak, total bagian fard > 100%
// Istri 1/4 + Ibu 1/6 + 2 Saudari 2/3 = 13/12 > 1
const result = calculateFaraidh({
  totalAssets: 240000000n,   // 240 juta
  utang: 0n,
  wasiatFraction: { num: 0n, den: 1n },
  heirs: {
    istri: 1,
    ibu: 1,
    saudaraPerempuanKandung: 2,
    // yang lain: 0
    suami: 0, ayah: 0, anakLaki: 0, anakPerempuan: 0,
    kakekAyah: 0, nenekAyah: 0, nenekIbu: 0,
    cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
    saudaraLakiKandung: 0, saudaraLakiSeayah: 0, 
    saudaraPerempuanSeayah: 0, saudaraLakiSeibu: 0, 
    saudaraPerempuanSeibu: 0,
    keponakanLakiDariSaudaraLakiKandung: 0,
    pamanKandung: 0, pamanSeayah: 0
  }
});

console.log('=== KASUS AWL - PAK BUDI ===');
console.log(`Awl diterapkan: ${result.awlApplied ? 'YA' : 'TIDAK'}`);
console.log(`Asl masalah: ${result.aslMasalah}`);
console.log(`Total siham: ${result.totalSiham}`);

// Normal: Istri 1/4, Ibu 1/6, 2 Saudari 2/3
// Awl: semua dikurangi proporsional karena total > 100%
result.fardResults.forEach(heir => {
  const percentage = Number(heir.totalShare * 100n / result.netEstate);
  console.log(`${heir.type}: Rp ${heir.totalShare.toLocaleString()} (${percentage.toFixed(1)}%)`);
});
```

### 🔢 Terbilang Use Cases

#### **Use Case 4: Konversi Harta Warisan Besar**
```typescript
import { Terbilang } from './src/utils/Terbilang';

// Konversi nilai harta yang besar untuk dokumen resmi
const hartaValues = [
  1500000000n,    // 1.5 miliar
  25750000000n,   // 25.75 miliar  
  500000000000n,  // 500 miliar
];

console.log('=== KONVERSI HARTA BESAR ===');
hartaValues.forEach(value => {
  const numeric = `Rp ${value.toLocaleString('id-ID')}`;
  const terbilang = Terbilang.ConvertBigInt(value);
  
  console.log(`${numeric}`);
  console.log(`"${terbilang} rupiah"`);
  console.log('---');
});

// Output:
// Rp 1,500,000,000
// "satu miliar lima ratus juta rupiah"
// ---
// Rp 25,750,000,000
// "dua puluh lima miliar tujuh ratus lima puluh juta rupiah"
```

#### **Use Case 5: Konversi Desimal untuk Pembagian Warisan**
```typescript
import { Terbilang } from './src/utils/Terbilang';

// Konversi hasil pembagian yang ada desimal
const pembagianWarisan = [
  166666666.67,  // hasil bagi 3
  333333.33,     // bagian kecil
  1250000.50,    // dengan sen
];

console.log('=== KONVERSI DESIMAL WARISAN ===');
pembagianWarisan.forEach((value, index) => {
  const terbilang = Terbilang.Convert(value);
  
  console.log(`Ahli waris ${index + 1}:`);
  console.log(`Rp ${value.toLocaleString('id-ID')}`);
  console.log(`"${terbilang} rupiah"`);
  console.log('');
});

// Output:
// Ahli waris 1:
// Rp 166,666,666.67
// "seratus enam puluh enam juta enam ratus enam puluh enam ribu enam ratus enam puluh enam koma enam tujuh rupiah"

// Untuk dokumen notaris/pengadilan
function formatTerbilangRupiah(amount: number): string {
  const terbilang = Terbilang.Convert(amount);
  return `(${terbilang} rupiah)`.replace(/\b\w/g, l => l.toUpperCase());
}

console.log('Format notaris:');
console.log(`Rp 166,666,666.67 ${formatTerbilangRupiah(166666666.67)}`);
// "Rp 166,666,666.67 (Seratus Enam Puluh Enam Juta Enam Ratus Enam Puluh Enam Ribu Enam Ratus Enam Puluh Enam Koma Enam Tujuh Rupiah)"
```

### 🚀 Quick Reference - Import & Functions

```typescript
// ===== IMPORTS =====
import { calculateFaraidh, HeirCounts } from './src/faraidh';
import { Terbilang, terbilangRupiah } from './src/utils/Terbilang';

// ===== FARAIDH FUNCTIONS =====
// Main calculation function
calculateFaraidh(input: {
  totalAssets: bigint;      // Harta total (BigInt)
  utang: bigint;            // Utang (BigInt) 
  wasiatFraction: Fraction; // Wasiat { num: bigint, den: bigint }
  heirs: HeirCounts;        // Object semua ahli waris
  madzhab?: string;         // Optional, default: 'syafii'
}) → CalculationResult

// Helper function untuk heirs kosong
const emptyHeirs: HeirCounts = {
  suami: 0, istri: 0, ayah: 0, ibu: 0,
  // ... semua property = 0
};

// ===== TERBILANG FUNCTIONS =====
Terbilang.Convert(input: number)              → string  // Angka biasa
Terbilang.ConvertBigInt(input: bigint)        → string  // BigInt (lebih cepat)
terbilangRupiah(amount: bigint)               → string  // Format "... rupiah"

// ===== COMMON PATTERNS =====
// 1. Basic faraidh calculation
const result = calculateFaraidh({
  totalAssets: 1000000000n,
  utang: 0n,
  wasiatFraction: { num: 0n, den: 1n },
  heirs: { istri: 1, anakPerempuan: 2, ...emptyHeirs }
});

// 2. Get specific heir result
const istriBagian = result.fardResults.find(h => h.type === 'istri');
const anakAsabah = result.asabahResults.find(h => h.type === 'anakLaki');

// 3. Format currency with terbilang
const amount = 150000000n;
console.log(`Rp ${amount.toLocaleString()} (${Terbilang.ConvertBigInt(amount)} rupiah)`);

// 4. Check special cases
if (result.awlApplied) console.log('Kasus Awl terjadi');
if (result.raddApplied) console.log('Kasus Radd terjadi');
if (result.ibtalApplied.length > 0) console.log('Ada yang terhijab:', result.ibtalApplied);
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
- `istri` - Istri (0-4)

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