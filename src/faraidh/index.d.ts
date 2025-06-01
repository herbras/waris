/**
 * Faraidh (Islamic Inheritance) Engine TypeScript Declarations
 *
 * Provides comprehensive Islamic inheritance calculations according to fiqh principles
 * Supports Syafii madzhab with extensibility for other madhabs
 */

export interface Fraction {
	num: bigint;
	den: bigint;
}

export type ZeroOne = 0 | 1;

/**
 * Comprehensive heir categories for Islamic inheritance calculation
 * Covers all major heir types as defined in fiqh
 */
export interface HeirCounts {
	// Spouses
	suami: ZeroOne; // Husband (0 or 1)
	istri: number; // Wives (0-4, up to 4 wives allowed in Islam)

	// Parents
	ayah: ZeroOne; // Father (0 or 1)
	ibu: ZeroOne; // Mother (0 or 1)

	// Grandparents
	kakekAyah: ZeroOne; // Paternal grandfather
	nenekAyah: ZeroOne; // Paternal grandmother
	nenekIbu: ZeroOne; // Maternal grandmother

	// Direct descendants
	anakLaki: number; // Sons (≥0)
	anakPerempuan: number; // Daughters (≥0)

	// Grandchildren from sons
	cucuLakiDariAnakLaki: number; // Grandsons from sons
	cucuPerempuanDariAnakLaki: number; // Granddaughters from sons

	// Full siblings (same father and mother)
	saudaraLakiKandung: number; // Full brothers
	saudaraPerempuanKandung: number; // Full sisters

	// Paternal half siblings (same father)
	saudaraLakiSeayah: number; // Paternal half brothers
	saudaraPerempuanSeayah: number; // Paternal half sisters

	// Maternal half siblings (same mother)
	saudaraLakiSeibu: number; // Maternal half brothers
	saudaraPerempuanSeibu: number; // Maternal half sisters

	// Nephews and uncles
	keponakanLakiDariSaudaraLakiKandung: number; // Nephews from full brothers
	pamanKandung: number; // Full uncles
	pamanSeayah: number; // Paternal half uncles
}

/**
 * Individual heir result showing their inheritance details
 */
export interface HeirResult {
	type: string; // Heir type (e.g., "istri", "anakLaki")
	count: number; // Number of individuals in this category
	totalShare: bigint; // Total inheritance for this category (Rupiah)
	individualShare?: bigint; // Per-person share (totalShare / count)
	portion: Fraction; // Fraction representation of share
	category: "fard" | "asabah" | "radd" | "dhuwu"; // Inheritance category
}

/**
 * Input parameters for faraidh calculation
 */
export interface CalculationInput {
	totalAssets: bigint; // Total estate value (Rupiah)
	utang: bigint; // Outstanding debts (Rupiah)
	wasiatFraction: Fraction; // Bequest as fraction (max 1/3)
	heirs: HeirCounts; // All heir counts
	madzhab?: "syafii" | "hanafi" | "maliki" | "hanbali"; // Islamic school of law
}

/**
 * Complete inheritance calculation result
 */
export interface CalculationResult {
	// Estate deductions
	utang: bigint; // Debts paid
	wasiat: bigint; // Bequests given
	netEstate: bigint; // Net estate after deductions

	// Inheritance distributions by category
	fardResults: HeirResult[]; // Fixed share heirs (ashab al-furud)
	asabahResults: HeirResult[]; // Residual heirs (asabah)
	raddResults?: HeirResult[]; // Radd distribution (if applicable)
	dhuwuResults?: HeirResult[]; // Distant relatives (if applicable)

	// Process indicators
	awlApplied: boolean; // Whether proportional reduction applied
	awlRatio?: Fraction; // Reduction ratio if awl applied
	ibtalApplied: string[]; // List of blocked heirs (hajb)
	raddApplied: boolean; // Whether residue return applied

	// Summary information
	totalDistributed: bigint; // Total amount distributed
	calculationSummary: {
		aslMasalah: bigint; // Common denominator used
		totalSiham: bigint; // Total share units
		distributionMethod: "normal" | "awl" | "radd" | "dhuwu";
	};
}

/**
 * Configuration for different madhabs and locales
 */
export interface FaraidhConfig {
	locale: string;
	madzhab: "syafii" | "hanafi" | "maliki" | "hanbali";
	currency: string;
	raddForSpouse: boolean; // Whether spouse eligible for radd
	ibtalRules: Record<string, string[]>; // Blocking rules for this madzhab
}

/**
 * Validation error details
 */
export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

/**
 * Enhanced result with Indonesian textual representation
 */
export interface CalculationResultWithText extends CalculationResult {
	textResults: {
		totalAssetsText: string;
		utangText: string;
		wasiatText: string;
		netEstateText: string;
		heirResults: Array<
			HeirResult & {
				totalShareText: string;
				individualShareText?: string;
			}
		>;
	};
}

// === MAIN CALCULATION FUNCTION ===

/**
 * Main faraidh calculation function
 *
 * Calculates Islamic inheritance distribution according to fiqh principles
 * Handles all major scenarios including awl, radd, and hajb rules
 *
 * @param input - Calculation parameters including assets, debts, bequests, and heirs
 * @returns Complete calculation result with all inheritance distributions
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * import { calculateFaraidh } from './faraidh';
 *
 * const result = calculateFaraidh({
 *   totalAssets: 1000000n,
 *   utang: 100000n,
 *   wasiatFraction: { num: 1n, den: 10n },
 *   heirs: {
 *     istri: 1,
 *     anakLaki: 2,
 *     anakPerempuan: 1,
 *     // ... other heirs set to 0
 *   }
 * });
 * ```
 */
export declare function calculateFaraidh(
	input: CalculationInput,
): CalculationResult;

// === UTILITY FUNCTIONS ===

/**
 * Calculate greatest common divisor using Euclidean algorithm
 */
export declare function gcd(a: bigint, b: bigint): bigint;

/**
 * Calculate least common multiple
 */
export declare function lcm(a: bigint, b: bigint): bigint;

/**
 * Reduce fraction to its simplest form
 */
export declare function reduceFraction(fraction: Fraction): Fraction;

/**
 * Add two fractions
 */
export declare function addFractions(f1: Fraction, f2: Fraction): Fraction;

/**
 * Multiply fraction by base amount for calculating shares
 */
export declare function multiplyFractionBase(
	base: bigint,
	fraction: Fraction,
): bigint;

/**
 * Convert fraction to decimal string representation
 */
export declare function fractionToDecimal(
	fraction: Fraction,
	precision?: number,
): string;

/**
 * Validate heir counts for logical consistency
 */
export declare function validateHeirCounts(
	heirs: HeirCounts,
): ValidationError[];

/**
 * Check if heir type is eligible for radd (return of residue)
 */
export declare function isEligibleForRadd(
	heirType: string,
	madzhab?: string,
): boolean;

/**
 * Format bigint amount as currency string
 */
export declare function formatCurrency(
	amount: bigint,
	currency?: string,
): string;

/**
 * Validate complete calculation input
 */
export declare function validateCalculationInput(input: {
	totalAssets: bigint;
	utang: bigint;
	wasiatFraction: Fraction;
	heirs: HeirCounts;
}): ValidationError[];

// === TERBILANG FUNCTIONS ===

/**
 * Convert BigInt to Indonesian words
 * @param amount - Amount in Rupiah
 * @returns Indonesian text representation
 */
export declare function terbilangBigInt(amount: bigint): string;

/**
 * Convert currency amount to Indonesian words with "rupiah" suffix
 * @param amount - Amount in Rupiah
 * @returns Formatted text like "lima juta rupiah"
 */
export declare function terbilangRupiah(amount: bigint): string;

/**
 * Convert inheritance fraction to readable Indonesian text
 * @param num - Numerator
 * @param den - Denominator
 * @returns Text like "satu per dua" for 1/2
 */
export declare function terbilangFraction(num: bigint, den: bigint): string;

/**
 * Convert heir description to Indonesian
 * @param heirType - Type of heir (e.g., 'istri', 'anakLaki')
 * @param count - Number of heirs in this category
 * @returns Descriptive text like "satu orang istri"
 */
export declare function terbilangHeirDescription(
	heirType: string,
	count: number,
): string;

// === DEFAULT CONFIGURATION ===

/**
 * Default configuration for Syafii madzhab
 */
export declare const defaultConfig: FaraidhConfig;

// === TYPE GUARDS ===

/**
 * Type guard to check if a value is a valid ZeroOne
 */
export declare function isZeroOne(value: number): value is ZeroOne;

/**
 * Type guard to check if heir counts are valid
 */
export declare function isValidHeirCounts(heirs: unknown): heirs is HeirCounts;

/**
 * Type guard to check if calculation input is valid
 */
export declare function isValidCalculationInput(
	input: unknown,
): input is CalculationInput;
