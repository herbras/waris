import { calculateFaraidh } from "@/faraidh/engine/calculate";
import type { CalculationInput, HeirCounts } from "@/faraidh/types";
import { describe, expect, it } from "vitest";

describe("Faraidh Basic Calculations", () => {
	describe("Input Validation", () => {
		it("should throw error for negative assets", () => {
			const input: CalculationInput = {
				totalAssets: -1000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs: createEmptyHeirs(),
			};

			expect(() => calculateFaraidh(input)).toThrow(
				"Total aset tidak boleh negatif",
			);
		});

		it("should throw error for negative debt", () => {
			const input: CalculationInput = {
				totalAssets: 1000000n,
				utang: -100000n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs: createEmptyHeirs(),
			};

			expect(() => calculateFaraidh(input)).toThrow(
				"Utang tidak boleh negatif",
			);
		});

		it("should throw error for wasiat exceeding 1/3", () => {
			const input: CalculationInput = {
				totalAssets: 1000000n,
				utang: 0n,
				wasiatFraction: { num: 1n, den: 2n }, // 1/2 > 1/3
				heirs: createEmptyHeirs(),
			};

			expect(() => calculateFaraidh(input)).toThrow(
				"Wasiat tidak boleh melebihi 1/3",
			);
		});

		it("should throw error for both husband and wife", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;
			heirs.istri = 1;

			const input: CalculationInput = {
				totalAssets: 1000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			expect(() => calculateFaraidh(input)).toThrow(
				"suami dan istri bersamaan",
			);
		});

		it("should throw error for more than 4 wives", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 5; // More than allowed

			const input: CalculationInput = {
				totalAssets: 1000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			expect(() => calculateFaraidh(input)).toThrow(
				"Jumlah istri harus antara 0 sampai 4",
			);
		});

		it("should accept valid number of wives (1-4)", () => {
			for (let wiveCount = 1; wiveCount <= 4; wiveCount++) {
				const heirs = createEmptyHeirs();
				heirs.istri = wiveCount;

				const input: CalculationInput = {
					totalAssets: 1000000n,
					utang: 0n,
					wasiatFraction: { num: 0n, den: 1n },
					heirs,
				};

				expect(() => calculateFaraidh(input)).not.toThrow();
			}
		});
	});

	describe("Simple Inheritance Cases", () => {
		it("should calculate inheritance for wife only", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 1;

			const input: CalculationInput = {
				totalAssets: 100000000n, // 100 million
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			expect(result.fardResults).toHaveLength(1);
			expect(result.fardResults[0].type).toBe("istri");
			// Wife gets 1/4 as fard + remaining 3/4 via radd = 100M total
			expect(result.fardResults[0].totalShare).toBe(100000000n);
			expect(result.raddApplied).toBe(true);
			expect(result.totalDistributed).toBe(100000000n);
		});

		it("should calculate inheritance for multiple wives (up to 4)", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 3; // 3 wives

			const input: CalculationInput = {
				totalAssets: 120000000n, // 120 million
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			expect(result.fardResults).toHaveLength(1);
			expect(result.fardResults[0].type).toBe("istri");
			expect(result.fardResults[0].count).toBe(3); // 3 wives
			// 3 wives share 1/4 collectively + remaining 3/4 via radd = 120M total
			expect(result.fardResults[0].totalShare).toBe(120000000n);
			expect(result.fardResults[0].individualShare).toBe(40000000n); // 120M / 3 = 40M each
			expect(result.raddApplied).toBe(true);
			expect(result.totalDistributed).toBe(120000000n);
		});

		it("should calculate inheritance for 4 wives with children", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 4; // Maximum 4 wives
			heirs.anakLaki = 2; // 2 sons

			const input: CalculationInput = {
				totalAssets: 160000000n, // 160 million
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// 4 wives get 1/8 when there are children (20M total, 5M each)
			const wivesResult = result.fardResults.find((r) => r.type === "istri");
			expect(wivesResult?.count).toBe(4);
			expect(wivesResult?.totalShare).toBe(20000000n); // 1/8 of 160M
			expect(wivesResult?.individualShare).toBe(5000000n); // 20M / 4 = 5M each
			expect(wivesResult?.portion).toEqual({ num: 1n, den: 8n });

			// Sons get the rest as asabah
			const sonsResult = result.asabahResults.find((r) => r.type === "anakLaki");
			expect(sonsResult?.totalShare).toBe(140000000n); // 7/8 of 160M
		});

		it("should calculate inheritance for husband only", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;

			const input: CalculationInput = {
				totalAssets: 80000000n, // 80 million
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			expect(result.fardResults).toHaveLength(1);
			expect(result.fardResults[0].type).toBe("suami");
			// Husband gets 1/2 as fard + remaining 1/2 via radd = 80M total
			expect(result.fardResults[0].totalShare).toBe(80000000n);
			expect(result.raddApplied).toBe(true);
		});

		it("should calculate inheritance for wife with children", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 1;
			heirs.anakLaki = 1;

			const input: CalculationInput = {
				totalAssets: 80000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Wife gets 1/8 when there are children
			const wifeResult = result.fardResults.find((r) => r.type === "istri");
			expect(wifeResult?.totalShare).toBe(10000000n); // 1/8 of 80M
			expect(wifeResult?.portion).toEqual({ num: 1n, den: 8n });

			// Son gets the rest as asabah
			const sonResult = result.asabahResults.find((r) => r.type === "anakLaki");
			expect(sonResult?.totalShare).toBe(70000000n); // 7/8 of 80M
		});

		it("should calculate inheritance for parents only", () => {
			const heirs = createEmptyHeirs();
			heirs.ayah = 1;
			heirs.ibu = 1;

			const input: CalculationInput = {
				totalAssets: 60000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Mother gets 1/3
			const motherResult = result.fardResults.find((r) => r.type === "ibu");
			expect(motherResult?.totalShare).toBe(20000000n); // 1/3 of 60M
			expect(motherResult?.portion).toEqual({ num: 1n, den: 3n });

			// Father gets the rest as asabah
			const fatherResult = result.asabahResults.find((r) => r.type === "ayah");
			expect(fatherResult?.totalShare).toBe(40000000n); // 2/3 of 60M
		});

		it("should calculate inheritance for two daughters only", () => {
			const heirs = createEmptyHeirs();
			heirs.anakPerempuan = 2;

			const input: CalculationInput = {
				totalAssets: 90000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Two daughters get 2/3 as fard + remaining 1/3 via radd = 90M total
			const daughtersResult = result.fardResults.find(
				(r) => r.type === "anakPerempuan",
			);
			expect(daughtersResult?.totalShare).toBe(90000000n); // All 90M via fard + radd
			expect(daughtersResult?.count).toBe(2);
			expect(daughtersResult?.individualShare).toBe(45000000n); // 45M each
			expect(result.raddApplied).toBe(true);

			expect(result.totalDistributed).toBe(90000000n);
		});
	});

	describe("Complex Cases with Multiple Heirs", () => {
		it("should calculate inheritance for wife, father, and mother", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 1;
			heirs.ayah = 1;
			heirs.ibu = 1;

			const input: CalculationInput = {
				totalAssets: 120000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Gharrawain/Umariyatain case: Wife + Mother + Father, no children
			// Wife: 1/4 = 30M
			// Remainder after wife: 120M - 30M = 90M  
			// Mother: 1/3 of remainder = 1/3 * 90M = 30M
			// Father: remainder = 90M - 30M = 60M
			const wifeResult = result.fardResults.find((r) => r.type === "istri");
			const motherResult = result.fardResults.find((r) => r.type === "ibu");
			const fatherResult = result.asabahResults.find((r) => r.type === "ayah");

			expect(wifeResult?.totalShare).toBe(30000000n); // 1/4 of 120M
			expect(motherResult?.totalShare).toBe(30000000n); // 1/3 of remainder (90M)
			expect(fatherResult?.totalShare).toBe(60000000n); // Final remainder
			expect(result.isGharrawain).toBe(true); // Should detect Gharrawain case

			expect(result.totalDistributed).toBe(120000000n);
		});

		it("should handle debt and wasiat correctly", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 1;

			const input: CalculationInput = {
				totalAssets: 120000000n,
				utang: 20000000n, // 20M debt
				wasiatFraction: { num: 1n, den: 6n }, // 1/6 of remaining = 100M/6 ≈ 16.67M
				heirs,
			};

			const result = calculateFaraidh(input);

			expect(result.utang).toBe(20000000n);
			expect(result.wasiat).toBe(16666666n); // 1/6 of (120M - 20M)
			expect(result.netEstate).toBe(83333334n); // 120M - 20M - 16.67M

			// Wife gets all net estate (1/4 fard + 3/4 radd)
			const wifeResult = result.fardResults.find((r) => r.type === "istri");
			expect(wifeResult?.totalShare).toBe(83333334n); // All net estate
			expect(result.raddApplied).toBe(true);

			expect(result.totalDistributed).toBe(120000000n);
		});
	});

	describe("Hajb (Blocking) Rules", () => {
		it("should block grandfather when father is present", () => {
			const heirs = createEmptyHeirs();
			heirs.ayah = 1;
			heirs.kakekAyah = 1; // Should be blocked by father
			heirs.istri = 1;

			const input: CalculationInput = {
				totalAssets: 120000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			expect(result.ibtalApplied).toContain("kakekAyah");

			// Only father and wife should inherit
			const allHeirs = [...result.fardResults, ...result.asabahResults];
			const heirTypes = allHeirs.map((h) => h.type);
			expect(heirTypes).toContain("ayah");
			expect(heirTypes).toContain("istri");
			expect(heirTypes).not.toContain("kakekAyah");
		});

		it("should block grandchildren when children are present", () => {
			const heirs = createEmptyHeirs();
			heirs.anakLaki = 1;
			heirs.cucuLakiDariAnakLaki = 1; // Should be blocked

			const input: CalculationInput = {
				totalAssets: 100000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			expect(result.ibtalApplied).toContain("cucuLakiDariAnakLaki");

			// Only son should inherit as asabah
			expect(result.asabahResults).toHaveLength(1);
			expect(result.asabahResults[0].type).toBe("anakLaki");
			expect(result.asabahResults[0].totalShare).toBe(100000000n);
		});
	});
});

function createEmptyHeirs(): HeirCounts {
	return {
		suami: 0,
		istri: 0,
		ayah: 0,
		ibu: 0,
		kakekAyah: 0,
		nenekAyah: 0,
		nenekIbu: 0,
		anakLaki: 0,
		anakPerempuan: 0,
		cucuLakiDariAnakLaki: 0,
		cucuPerempuanDariAnakLaki: 0,
		saudaraLakiKandung: 0,
		saudaraPerempuanKandung: 0,
		saudaraLakiSeayah: 0,
		saudaraPerempuanSeayah: 0,
		saudaraLakiSeibu: 0,
		saudaraPerempuanSeibu: 0,
		keponakanLakiDariSaudaraLakiKandung: 0,
		pamanKandung: 0,
		pamanSeayah: 0,
	};
}
