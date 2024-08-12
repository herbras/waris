/**
 * Terbilang - Indonesian Number to Words Converter TypeScript Declarations
 *
 * Converts numbers (including Decimal.js instances) to Indonesian words
 * Supports very large numbers up to 10^36 and decimal fractions
 */

import type Decimal from "decimal.js";

/**
 * Terbilang class for converting numbers to Indonesian words
 *
 * Features:
 * - Supports integers and decimals
 * - Handles very large numbers (up to 10^36)
 * - Preserves trailing zeros in decimal representation when originalStr provided
 * - Thread-safe static methods
 *
 * @example
 * ```typescript
 * import { Terbilang } from './Terbilang';
 * import Decimal from 'decimal.js';
 *
 * // Basic usage
 * console.log(Terbilang.Convert(123)); // "seratus dua puluh tiga"
 * console.log(Terbilang.Convert(1500000)); // "satu juta lima ratus ribu"
 *
 * // With Decimal.js
 * const decimal = new Decimal("123.45");
 * console.log(Terbilang.Convert(decimal)); // "seratus dua puluh tiga koma empat lima"
 *
 * // Preserving trailing zeros
 * console.log(Terbilang.Convert(123.40, "123.40")); // "seratus dua puluh tiga koma empat nol"
 * ```
 */
export declare class Terbilang {
	/**
	 * Internal word mappings for numbers 0-11
	 * @private
	 */
	private static readonly words: string[];

	/**
	 * Convert BigInt to Indonesian words
	 * @param input - BigInt to convert
	 * @returns Indonesian word representation of the BigInt
	 * @throws RangeError if number is too large (> 10^36)
	 *
	 * @example
	 * ```typescript
	 * Terbilang.ConvertBigInt(123n);        // "seratus dua puluh tiga"
	 * Terbilang.ConvertBigInt(-456n);       // "minus empat ratus lima puluh enam"
	 * Terbilang.ConvertBigInt(1500000n);    // "satu juta lima ratus ribu"
	 * ```
	 */
	static ConvertBigInt(input: bigint): string;

	/**
	 * Convert a number or Decimal instance to Indonesian words
	 *
	 * @param input - Number or Decimal instance to convert
	 * @param originalStr - Optional original string to preserve trailing zeros in decimals
	 * @returns Indonesian word representation of the number
	 * @throws TypeError if input is not a number or Decimal instance
	 * @throws RangeError if number is too large (> 10^36)
	 *
	 * @example
	 * ```typescript
	 * // Basic integers
	 * Terbilang.Convert(0);           // "nol"
	 * Terbilang.Convert(15);          // "lima belas"
	 * Terbilang.Convert(1000);        // "seribu"
	 * Terbilang.Convert(1500000);     // "satu juta lima ratus ribu"
	 *
	 * // Negative numbers
	 * Terbilang.Convert(-123);        // "minus seratus dua puluh tiga"
	 *
	 * // Decimals
	 * Terbilang.Convert(123.45);      // "seratus dua puluh tiga koma empat lima"
	 * Terbilang.Convert(0.5);         // "nol koma lima"
	 *
	 * // With trailing zeros preserved
	 * Terbilang.Convert(123.40, "123.40"); // "seratus dua puluh tiga koma empat nol"
	 *
	 * // Very large numbers
	 * Terbilang.Convert(new Decimal("123456789012345"));
	 * // "seratus dua puluh tiga triliun empat ratus lima puluh enam miliar..."
	 * ```
	 */
	static Convert(input: Decimal | number, originalStr?: string): string;

	/**
	 * Convert integer part to Indonesian words (internal method)
	 * @private
	 * @param value - Decimal value representing integer part
	 * @returns Indonesian word representation
	 */
	private static _convertInteger(value: Decimal): string;
}

// === TYPE DEFINITIONS ===

/**
 * Valid input types for Terbilang.Convert()
 */
export type TerbilangInput = number | Decimal;

/**
 * Configuration options for number conversion
 */
export interface TerbilangOptions {
	/** Whether to preserve trailing zeros in decimal representation */
	preserveTrailingZeros?: boolean;
	/** Original string representation (for preserving formatting) */
	originalString?: string;
}

// === UTILITY FUNCTIONS ===

/**
 * Type guard to check if input is valid for Terbilang conversion
 */
export declare function isValidTerbilangInput(
	input: unknown,
): input is TerbilangInput;

/**
 * Helper function to format currency amounts in Indonesian words
 * @param amount - Amount in base currency units
 * @param currencyName - Name of currency (default: "rupiah")
 * @returns Formatted string like "lima juta rupiah"
 */
export declare function formatCurrencyInWords(
	amount: number | Decimal,
	currencyName?: string,
): string;

/**
 * Helper function to convert fractions to Indonesian words
 * @param numerator - Fraction numerator
 * @param denominator - Fraction denominator
 * @returns Formatted string like "tiga per empat"
 */
export declare function formatFractionInWords(
	numerator: number,
	denominator: number,
): string;

// === CONSTANTS ===

/**
 * Maximum safe number that can be converted (10^36 - 1)
 */
export declare const MAX_CONVERTIBLE_NUMBER: Decimal;

/**
 * Supported scale names in Indonesian
 */
export declare const SCALE_NAMES: readonly [
	"ribu", // 10^3
	"juta", // 10^6
	"miliar", // 10^9
	"triliun", // 10^12
	"kuadriliun", // 10^15
	"kuantiliun", // 10^18
	"sekstiliun", // 10^21
	"septiliun", // 10^24
	"oktiliun", // 10^27
	"noniliun", // 10^30
	"desiliun", // 10^33
];

// === ERROR TYPES ===

/**
 * Error thrown when input type is invalid
 */
export declare class TerbilangTypeError extends TypeError {
	constructor(message: string);
}

/**
 * Error thrown when number is too large to convert
 */
export declare class TerbilangRangeError extends RangeError {
	constructor(message: string);
}
