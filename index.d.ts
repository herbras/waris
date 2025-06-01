/**
 * Waris - Islamic Inheritance Calculator TypeScript Declarations
 *
 * Complete TypeScript definitions for the Waris (Islamic inheritance) library
 * Includes faraidh calculations and Indonesian number-to-words conversion
 *
 * @version 1.0.0
 * @author Ibrahim Nurul Huda <ibrahim@sarbeh.com>
 * @license MIT
 */

// === RE-EXPORT ALL FARAIDH TYPES AND FUNCTIONS ===

export {
	// Types
	Fraction,
	ZeroOne,
	HeirCounts,
	HeirResult,
	CalculationInput,
	CalculationResult,
	FaraidhConfig,
	ValidationError,
	CalculationResultWithText,
	// Main calculation function
	calculateFaraidh,
	// Utility functions
	gcd,
	lcm,
	reduceFraction,
	addFractions,
	multiplyFractionBase,
	fractionToDecimal,
	validateHeirCounts,
	isEligibleForRadd,
	formatCurrency,
	validateCalculationInput,
	// Terbilang functions
	terbilangBigInt,
	terbilangRupiah,
	terbilangFraction,
	terbilangHeirDescription,
	// Configuration
	defaultConfig,
} from "./src/faraidh/index";

// === RE-EXPORT TERBILANG ===

export {
	// Main Terbilang class
	Terbilang,
} from "./src/utils/Terbilang";

/**
 * Package information
 */
export interface PackageInfo {
	name: "waris";
	version: string;
	description: "Islamic inheritance calculator with Indonesian number-to-words conversion";
	keywords: string[];
	author: string;
	license: "MIT";
	repository: {
		type: "git";
		url: string;
	};
	bugs: {
		url: string;
	};
	homepage: string;
}

/**
 * Get package information
 */
export declare const packageInfo: PackageInfo;
