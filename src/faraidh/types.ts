export type Fraction = { num: bigint; den: bigint };

export type ZeroOne = 0 | 1;

/**
 * Expanded heir categories based on fiqh requirements
 * Covers main categories needed for accurate faraidh calculations
 */
export interface HeirCounts {
	// Pasangan (Spouse)
	suami: ZeroOne; // 0|1
	istri: number; // 0-4 (up to 4 wives allowed in Islam)

	// Orang Tua (Parents)
	ayah: ZeroOne; // 0|1
	ibu: ZeroOne; // 0|1

	// Kakek Nenek (Grandparents)
	kakekAyah: ZeroOne; // Kakek shahih (dari ayah)
	nenekAyah: ZeroOne; // Nenek shahihah (dari ayah)
	nenekIbu: ZeroOne; // Nenek shahihah (dari ibu)

	// Keturunan Langsung (Direct Descendants)
	anakLaki: number; // >=0
	anakPerempuan: number; // >=0

	// Cucu dari Anak Laki (Grandchildren from sons)
	cucuLakiDariAnakLaki: number; // >=0
	cucuPerempuanDariAnakLaki: number; // >=0

	// Saudara Kandung (Full siblings - seayah seibu)
	saudaraLakiKandung: number; // >=0
	saudaraPerempuanKandung: number; // >=0

	// Saudara Seayah (Half siblings from father's side)
	saudaraLakiSeayah: number; // >=0
	saudaraPerempuanSeayah: number; // >=0

	// Saudara Seibu (Half siblings from mother's side)
	saudaraLakiSeibu: number; // >=0
	saudaraPerempuanSeibu: number; // >=0

	// Keponakan dari Saudara Laki Kandung
	keponakanLakiDariSaudaraLakiKandung: number; // >=0

	// Paman (Father's brothers)
	pamanKandung: number; // >=0 (saudara laki ayah kandung)
	pamanSeayah: number; // >=0 (saudara laki ayah seayah)
}

/**
 * Result for each heir category showing their inheritance
 */
export interface HeirResult {
	type: string; // e.g., "istri", "anakPerempuan", "saudaraLakiKandung"
	count: number; // number of individuals in this category
	totalShare: bigint; // total inheritance amount for this category (in Rupiah)
	individualShare?: bigint; // per-person amount (totalShare / count)
	portion: Fraction; // fraction representation (num/den)
	category: "fard" | "asabah" | "radd" | "dhuwu"; // inheritance category
}

/**
 * Input for faraidh calculation
 */
export interface CalculationInput {
	totalAssets: bigint; // total estate in Rupiah
	utang: bigint; // debts in Rupiah
	wasiatFraction: Fraction; // bequest fraction (max 1/3)
	heirs: HeirCounts;
	madzhab?: "syafii" | "hanafi" | "maliki" | "hanbali";
}

/**
 * Complete calculation result
 */
export interface CalculationResult {
	// Deductions
	utang: bigint;
	wasiat: bigint;
	netEstate: bigint; // after utang and wasiat

	// Inheritance results by category
	fardResults: HeirResult[]; // ashab al-furud (fixed shares)
	asabahResults: HeirResult[]; // asabah (residual heirs)
	raddResults?: HeirResult[]; // radd distribution (if applicable)
	dhuwuResults?: HeirResult[]; // dhawu al-arham (if applicable)

	// Process indicators
	awlApplied: boolean; // whether awl (proportional reduction) was applied
	awlRatio?: Fraction; // if awl applied, the reduction ratio
	ibtalApplied: string[]; // list of heirs blocked (hajb)
	raddApplied: boolean; // whether radd (return of residue) was applied

	// Summary
	totalDistributed: bigint; // should equal totalAssets
	calculationSummary: {
		aslMasalah: bigint; // denominator used in calculation
		totalSiham: bigint; // total numerator shares
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
	raddForSpouse: boolean; // whether spouse gets radd in this madzhab
	ibtalRules: Record<string, string[]>; // hajb rules for this madzhab
}

/**
 * Validation error types
 */
export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

/**
 * Extended result with textual representation
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
