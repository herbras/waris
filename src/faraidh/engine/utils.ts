import type { Fraction, HeirCounts, ValidationError } from "../types";

/**
 * Calculate greatest common divisor using Euclidean algorithm
 */
export function gcd(a: bigint, b: bigint): bigint {
	const absA = a < 0n ? -a : a;
	const absB = b < 0n ? -b : b;
	return absB === 0n ? absA : gcd(absB, absA % absB);
}

/**
 * Calculate least common multiple
 */
export function lcm(a: bigint, b: bigint): bigint {
	return (a * b) / gcd(a, b);
}

/**
 * Reduce fraction to its simplest form
 */
export function reduceFraction({ num, den }: Fraction): Fraction {
	if (den === 0n) {
		throw new Error("Denominator cannot be zero");
	}
	if (num === 0n) {
		return { num: 0n, den: 1n };
	}

	const g = gcd(num, den);
	let newNum = num / g;
	let newDen = den / g;

	// Ensure denominator is positive
	if (newDen < 0n) {
		newNum = -newNum;
		newDen = -newDen;
	}

	return { num: newNum, den: newDen };
}

/**
 * Add two fractions
 */
export function addFractions(f1: Fraction, f2: Fraction): Fraction {
	const commonDen = lcm(f1.den, f2.den);
	const num1 = f1.num * (commonDen / f1.den);
	const num2 = f2.num * (commonDen / f2.den);

	return reduceFraction({ num: num1 + num2, den: commonDen });
}

/**
 * Multiply fraction by a base amount (for calculating inheritance shares)
 */
export function multiplyFractionBase(base: bigint, fraction: Fraction): bigint {
	if (base < 0n) {
		throw new Error("Base amount cannot be negative");
	}
	return (base * fraction.num) / fraction.den;
}

/**
 * Convert fraction to decimal string representation
 */
export function fractionToDecimal(fraction: Fraction, precision = 6): string {
	const whole = fraction.num / fraction.den;
	const remainder = fraction.num % fraction.den;

	if (remainder === 0n) {
		return whole.toString();
	}

	let decimal = "";
	let currentRemainder = remainder;

	for (let i = 0; i < precision && currentRemainder !== 0n; i++) {
		currentRemainder *= 10n;
		const digit = currentRemainder / fraction.den;
		decimal += digit.toString();
		currentRemainder = currentRemainder % fraction.den;
	}

	return `${whole}.${decimal}`;
}

/**
 * Calculate the common denominator (asl masalah) for multiple fractions
 */
export function calculateAslMasalah(fractions: Fraction[]): bigint {
	if (fractions.length === 0) return 1n;

	return fractions.reduce((asl, frac) => lcm(asl, frac.den), 1n);
}

/**
 * Convert fractions to siham (numerator shares) based on common denominator
 */
export function fractionsToSiham(
	fractions: Fraction[],
	aslMasalah: bigint,
): bigint[] {
	return fractions.map((frac) => frac.num * (aslMasalah / frac.den));
}

/**
 * Sum all shares in HeirResult array
 */
export function sumShares(results: Array<{ totalShare: bigint }>): bigint {
	return results.reduce((sum, result) => sum + result.totalShare, 0n);
}

/**
 * Validate heir counts for logical consistency
 */
export function validateHeirCounts(heirs: HeirCounts): ValidationError[] {
	const errors: ValidationError[] = [];

	// Cannot have both husband and wife
	if (heirs.suami === 1 && heirs.istri === 1) {
		errors.push({
			field: "heirs",
			message: "Tidak boleh ada suami dan istri bersamaan",
			code: "INVALID_SPOUSE_COMBINATION",
		});
	}

	// Validate non-negative counts
	const heirFields = Object.entries(heirs) as [keyof HeirCounts, number][];
	for (const [field, count] of heirFields) {
		if (count < 0) {
			errors.push({
				field: `heirs.${field}`,
				message: `Jumlah ${field} tidak boleh negatif`,
				code: "NEGATIVE_HEIR_COUNT",
			});
		}
	}

	// Validate ZeroOne fields
	const zeroOneFields: (keyof HeirCounts)[] = [
		"suami",
		"istri",
		"ayah",
		"ibu",
		"kakekAyah",
		"nenekAyah",
		"nenekIbu",
	];

	for (const field of zeroOneFields) {
		const value = heirs[field];
		if (value !== 0 && value !== 1) {
			errors.push({
				field: `heirs.${field}`,
				message: `${field} harus bernilai 0 atau 1`,
				code: "INVALID_ZERO_ONE_VALUE",
			});
		}
	}

	return errors;
}

/**
 * Check if heir type is eligible for radd (return of residue)
 */
export function isEligibleForRadd(
	heirType: string,
	_madzhab = "syafii",
): boolean {
	// Generally, spouse (suami/istri) is not eligible for radd in most madhabs
	// Other ashab al-furud are eligible
	if (heirType === "suami" || heirType === "istri") {
		return false; // Can be modified based on madzhab-specific rules
	}

	const fardEligible = [
		"ibu",
		"nenekAyah",
		"nenekIbu",
		"anakPerempuan",
		"cucuPerempuanDariAnakLaki",
		"saudaraPerempuanKandung",
		"saudaraPerempuanSeayah",
		"saudaraLakiSeibu",
		"saudaraPerempuanSeibu",
	];

	return fardEligible.includes(heirType);
}

/**
 * Format bigint as currency string
 */
export function formatCurrency(amount: bigint, currency = "IDR"): string {
	const numberStr = amount.toString();
	// Add thousand separators
	const formatted = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

	switch (currency) {
		case "IDR":
			return `Rp ${formatted}`;
		case "USD":
			return `$ ${formatted}`;
		default:
			return `${formatted} ${currency}`;
	}
}

/**
 * Validate calculation input
 */
export function validateCalculationInput(input: {
	totalAssets: bigint;
	utang: bigint;
	wasiatFraction: Fraction;
	heirs: HeirCounts;
}): ValidationError[] {
	const errors: ValidationError[] = [];

	// Validate assets and debts
	if (input.totalAssets < 0n) {
		errors.push({
			field: "totalAssets",
			message: "Total aset tidak boleh negatif",
			code: "NEGATIVE_ASSETS",
		});
	}

	if (input.utang < 0n) {
		errors.push({
			field: "utang",
			message: "Utang tidak boleh negatif",
			code: "NEGATIVE_DEBT",
		});
	}

	if (input.utang > input.totalAssets) {
		errors.push({
			field: "utang",
			message: "Utang tidak boleh melebihi total aset",
			code: "DEBT_EXCEEDS_ASSETS",
		});
	}

	// Validate wasiat fraction
	const { wasiatFraction } = input;
	if (wasiatFraction.den <= 0n) {
		errors.push({
			field: "wasiatFraction.den",
			message: "Penyebut wasiat harus positif",
			code: "INVALID_WASIAT_DENOMINATOR",
		});
	}

	if (wasiatFraction.num < 0n) {
		errors.push({
			field: "wasiatFraction.num",
			message: "Pembilang wasiat tidak boleh negatif",
			code: "NEGATIVE_WASIAT",
		});
	}

	// Check wasiat doesn't exceed 1/3
	if (wasiatFraction.num * 3n > wasiatFraction.den) {
		errors.push({
			field: "wasiatFraction",
			message: "Wasiat tidak boleh melebihi 1/3 harta bersih",
			code: "WASIAT_EXCEEDS_ONE_THIRD",
		});
	}

	// Validate heir counts
	errors.push(...validateHeirCounts(input.heirs));

	return errors;
}
