/**
 * Waris - Islamic Inheritance Calculator & Indonesian Number Converter
 * 
 * @version 1.0.0
 * @author Waris Team
 * @license MIT
 */

import { calculateFaraidh } from "./faraidh/engine/calculate";
import { Terbilang } from "./utils/Terbilang";
import { 
	terbilangBigInt, 
	terbilangFraction, 
	terbilangHeirDescription, 
	terbilangRupiah 
} from "./faraidh/engine/terbilang";
import { formatCurrency } from "./faraidh/engine/utils";
import { defaultConfig } from "./faraidh/config/default";

// === MAIN ENGINES ===

/**
 * Waris - Complete Islamic Inheritance Calculator Engine
 * All faraidh calculation functions and utilities
 */
export const Waris = {
	// Main calculation function
	calculateFaraidh,
	
	// Terbilang utilities for inheritance
	terbilangBigInt,
	terbilangFraction,
	terbilangHeirDescription,
	terbilangRupiah,
	
	// Formatting utilities
	formatCurrency,
	
	// Configuration
	defaultConfig,
	
	// Metadata
	VERSION: "1.0.0",
	LIBRARY_NAME: "Waris"
};

/**
 * Terbilang - Indonesian Number-to-Text Converter Engine
 * Complete number conversion utilities
 */
export { Terbilang };

// === INDIVIDUAL EXPORTS (for granular imports) ===
export { calculateFaraidh } from "./faraidh/engine/calculate";
export type {
	CalculationInput,
	CalculationResult,
	CalculationResultWithText,
	FaraidhConfig,
	Fraction,
	HeirCounts,
	HeirResult,
	ValidationError,
} from "./faraidh/types";

export {
	addFractions,
	formatCurrency,
	fractionToDecimal,
	gcd,
	isEligibleForRadd,
	lcm,
	multiplyFractionBase,
	reduceFraction,
	validateCalculationInput,
	validateHeirCounts,
} from "./faraidh/engine/utils";

export {
	terbilangBigInt,
	terbilangFraction,
	terbilangHeirDescription,
	terbilangRupiah,
} from "./faraidh/engine/terbilang";

export { defaultConfig } from "./faraidh/config/default";

// === VERSION ===
export const VERSION = "1.0.0";
export const LIBRARY_NAME = "Waris";

// === DEFAULT EXPORT (for convenience) ===
export default Waris; 