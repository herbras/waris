# Waris - Islamic Inheritance Calculator

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)

Complete Islamic inheritance (faraidh) calculator with Indonesian number-to-words conversion. Implements proper fiqh calculations according to Syafii madzhab with support for all major inheritance scenarios.

## Features

### 🕌 Faraidh Engine
- **Complete fiqh implementation** - Proper Islamic inheritance calculations
- **Syafii madzhab support** - Default configuration with extensibility for other madhabs
- **All inheritance scenarios** - Awl, Radd, Hajb (blocking), Asabah, Dhuwu al-Arham
- **Precise calculations** - BigInt arithmetic for exact monetary calculations
- **Comprehensive validation** - Input validation with detailed error messages

### 🔢 Terbilang (Number to Words)
- **Indonesian language** - Convert numbers to Indonesian words
- **Large number support** - Up to 10^36 (desiliun)
- **Decimal support** - Handle fractional numbers with precision
- **Currency formatting** - Built-in Rupiah formatting

### 🧪 Testing
- **17 comprehensive tests** - All passing with 100% coverage
- **Multiple test suites** - Basic, advanced, and performance tests
- **Real-world scenarios** - Complex inheritance cases validated

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd waris

# Install dependencies
bun install

# Run tests
bun test
```

## Quick Start

### Basic Faraidh Calculation

```typescript
import { calculateFaraidh, HeirCounts } from './src/faraidh';

// Define heirs
const heirs: HeirCounts = {
  istri: 1,           // 1 wife
  anakLaki: 2,        // 2 sons
  anakPerempuan: 1,   // 1 daughter
  ayah: 1,            // 1 father
  ibu: 1,             // 1 mother
  // ... other heirs set to 0
};

// Calculate inheritance
const result = calculateFaraidh({
  totalAssets: 1000000000n,  // 1 billion Rupiah
  utang: 100000000n,         // 100 million debt
  wasiatFraction: { num: 1n, den: 10n }, // 10% bequest
  heirs
});

console.log('Total distributed:', result.totalDistributed);
console.log('Wife share:', result.fardResults.find(r => r.type === 'istri')?.totalShare);
```

### Using Terbilang

```typescript
import { Terbilang, terbilangRupiah } from './src/utils/Terbilang';

// Convert numbers to Indonesian words
console.log(Terbilang.Convert(123456789)); 
// "seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan"

// Convert BigInt directly (optimized)
console.log(Terbilang.ConvertBigInt(1500000n));
// "satu juta lima ratus ribu"

// Convert currency amounts
console.log(terbilangRupiah(1500000n));
// "satu juta lima ratus ribu rupiah"
```

## API Documentation

### Faraidh Engine

#### `calculateFaraidh(input: CalculationInput): CalculationResult`

Main calculation function that processes Islamic inheritance according to fiqh rules.

**Input Parameters:**
- `totalAssets: bigint` - Total estate value in Rupiah
- `utang: bigint` - Outstanding debts in Rupiah
- `wasiatFraction: Fraction` - Bequest as fraction (max 1/3)
- `heirs: HeirCounts` - Object containing all heir counts
- `madzhab?: string` - Islamic school of law (default: 'syafii')

**Returns:** Complete calculation result with inheritance distributions

#### Heir Types Supported

**Spouses:**
- `suami` - Husband (0|1)
- `istri` - Wife (0|1)

**Parents & Grandparents:**
- `ayah` - Father (0|1)
- `ibu` - Mother (0|1)
- `kakekAyah` - Paternal grandfather (0|1)
- `nenekAyah` - Paternal grandmother (0|1)
- `nenekIbu` - Maternal grandmother (0|1)

**Descendants:**
- `anakLaki` - Sons (≥0)
- `anakPerempuan` - Daughters (≥0)
- `cucuLakiDariAnakLaki` - Grandsons from sons (≥0)
- `cucuPerempuanDariAnakLaki` - Granddaughters from sons (≥0)

**Siblings:**
- `saudaraLakiKandung` - Full brothers (≥0)
- `saudaraPerempuanKandung` - Full sisters (≥0)
- `saudaraLakiSeayah` - Paternal half brothers (≥0)
- `saudaraPerempuanSeayah` - Paternal half sisters (≥0)
- `saudaraLakiSeibu` - Maternal half brothers (≥0)
- `saudaraPerempuanSeibu` - Maternal half sisters (≥0)

**Extended Family:**
- `keponakanLakiDariSaudaraLakiKandung` - Nephews from full brothers (≥0)
- `pamanKandung` - Full uncles (≥0)
- `pamanSeayah` - Paternal half uncles (≥0)

### Terbilang Class

#### `Terbilang.Convert(input: number | Decimal, originalStr?: string): string`

Converts numbers to Indonesian words.

**Features:**
- Supports integers and decimals
- Handles very large numbers (up to 10^36)
- Preserves trailing zeros when originalStr provided
- Negative number support

## Inheritance Calculation Process

The engine follows proper fiqh order:

1. **Debt Payment** - `utang` deducted first
2. **Bequest Payment** - `wasiat` (max 1/3 of remaining)
3. **Heir Determination** - Apply hajb (blocking) rules
4. **Fard Calculation** - Fixed shares for ashab al-furud
5. **Awl/Radd Check** - Handle share overflow/shortage
6. **Asabah Distribution** - Residual inheritance (2:1 male:female)
7. **Dhuwu al-Arham** - Distant relatives (if applicable)

### Special Cases Handled

- **Awl (العول)** - Proportional reduction when total fard shares exceed 1
- **Radd (الرد)** - Return of residue to eligible fard heirs
- **Hajb (الحجب)** - Blocking rules (e.g., father blocks grandfather)
- **2:1 Ratio** - Male:female inheritance ratio for asabah

## Testing

```bash
# Run all tests
bun test

# Run specific test suites
bun test:faraidh          # All faraidh tests
bun test:faraidh:basic    # Basic inheritance tests
bun test:faraidh:advanced # Advanced cases (awl, radd)
bun test:terbilang        # Number conversion tests
```

## Project Structure

```
src/
├── faraidh/              # Islamic inheritance engine
│   ├── types.ts          # TypeScript definitions
│   ├── index.ts          # Main exports
│   ├── config/
│   │   └── default.ts    # Syafii madzhab configuration
│   └── engine/
│       ├── calculate.ts  # Main calculation logic
│       ├── utils.ts      # Mathematical utilities
│       └── terbilang.ts  # Integration with Terbilang
├── utils/
│   └── Terbilang.ts      # Number to words converter
test/
├── faraidh/              # Faraidh tests
│   ├── faraidh.basic.test.ts     # Basic scenarios (13 tests)
│   └── faraidh.advanced.test.ts  # Advanced scenarios (4 tests)
└── terbilang/            # Terbilang tests
index.d.ts                # TypeScript declarations
```

## Configuration

### Madzhab Support

Currently supports Syafii madzhab with extensible configuration:

```typescript
export const defaultConfig: FaraidhConfig = {
  locale: 'id-ID',
  madzhab: 'syafii',
  currency: 'IDR',
  raddForSpouse: false,     // Spouse not eligible for radd in Syafii
  ibtalRules: {
    // Hajb (blocking) rules
    'ayah': ['kakekAyah', 'saudaraLakiKandung', /* ... */],
    // ... other blocking rules
  }
};
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and add tests
4. Ensure all tests pass: `bun test`
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Based on classical Islamic fiqh principles
- Syafii madzhab implementation
- Indonesian language support for accessibility

---

**Note:** This calculator is for educational and reference purposes. For official religious rulings, please consult qualified Islamic scholars. 