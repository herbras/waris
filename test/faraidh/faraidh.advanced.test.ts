import { calculateFaraidh } from "@/faraidh/engine/calculate";
import type { CalculationInput, HeirCounts } from "@/faraidh/types";
import { describe, expect, it } from "vitest";

describe("Faraidh Advanced Calculations", () => {
	describe("Awl (Proportional Reduction) Cases", () => {
		it("should apply awl when total fard shares exceed 1", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;
			heirs.ibu = 1;
			heirs.anakPerempuan = 2;

			const input: CalculationInput = {
				totalAssets: 240000000n, // 240M for easier calculation
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Without awl: Husband 1/4 (60M) + Mother 1/6 (40M) + Daughters 2/3 (160M) = 260M > 240M
			// With awl: proportional reduction
			expect(result.awlApplied).toBe(true);
			expect(result.awlRatio).toBeDefined();

			const husbandResult = result.fardResults.find((r) => r.type === "suami");
			const motherResult = result.fardResults.find((r) => r.type === "ibu");
			const daughtersResult = result.fardResults.find(
				(r) => r.type === "anakPerempuan",
			);

			// Check that all shares are proportionally reduced
			expect(husbandResult?.totalShare).toBeLessThan(60000000n);
			expect(motherResult?.totalShare).toBeLessThan(40000000n);
			expect(daughtersResult?.totalShare).toBeLessThan(160000000n);

			// Total should equal original assets
			expect(result.totalDistributed).toBe(240000000n);
		});
	});

	describe("Radd (Return of Residue) Cases", () => {
		it("should apply radd to eligible fard heirs", () => {
			const heirs = createEmptyHeirs();
			heirs.ibu = 1;
			heirs.anakPerempuan = 1;

			const input: CalculationInput = {
				totalAssets: 60000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Mother 1/6 (10M) + Daughter 1/2 (30M) = 40M, remaining 20M via radd
			expect(result.raddApplied).toBe(true);
			expect(result.totalDistributed).toBe(60000000n);

			const motherResult = result.fardResults.find((r) => r.type === "ibu");
			const daughterResult = result.fardResults.find(
				(r) => r.type === "anakPerempuan",
			);

			// Both should get more than their basic fard share
			expect(motherResult?.totalShare).toBeGreaterThan(10000000n);
			expect(daughterResult?.totalShare).toBeGreaterThan(30000000n);
		});
	});

	describe("Complex Sibling Cases", () => {
		it("should handle maternal siblings with equal shares", () => {
			const heirs = createEmptyHeirs();
			heirs.saudaraLakiSeibu = 2;
			heirs.saudaraPerempuanSeibu = 1;

			const input: CalculationInput = {
				totalAssets: 90000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// 3 maternal siblings share 1/3 equally = 30M total, 10M each
			const maleResult = result.fardResults.find(
				(r) => r.type === "saudaraLakiSeibu",
			);
			const femaleResult = result.fardResults.find(
				(r) => r.type === "saudaraPerempuanSeibu",
			);

			expect(maleResult?.individualShare).toBe(femaleResult?.individualShare); // Equal shares
			expect(maleResult?.totalShare).toBe(20000000n); // 2 males * 10M each
			expect(femaleResult?.totalShare).toBe(10000000n); // 1 female * 10M
		});
	});

	describe("Mixed Complex Cases", () => {
		it("should handle large family with multiple heir types", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 1;
			heirs.ayah = 1;
			heirs.ibu = 1;
			heirs.anakLaki = 2;
			heirs.anakPerempuan = 3;

			const input: CalculationInput = {
				totalAssets: 500000000n, // 500M
				utang: 50000000n, // 50M debt
				wasiatFraction: { num: 1n, den: 10n }, // 10% wasiat
				heirs,
			};

			const result = calculateFaraidh(input);

			// Net estate: 500M - 50M - 45M = 405M
			expect(result.netEstate).toBe(405000000n);

			// Wife: 1/8 (children present), Parents: 1/6 each, Children: asabah with 2:1 ratio
			const wifeResult = result.fardResults.find((r) => r.type === "istri");
			const fatherResult = result.fardResults.find((r) => r.type === "ayah");
			const motherResult = result.fardResults.find((r) => r.type === "ibu");
			const sonsResult = result.asabahResults.find(
				(r) => r.type === "anakLaki",
			);
			const daughtersResult = result.asabahResults.find(
				(r) => r.type === "anakPerempuan",
			);

			expect(wifeResult?.totalShare).toBe(50625000n); // 1/8 of 405M
			expect(fatherResult?.totalShare).toBe(67500000n); // 1/6 of 405M
			expect(motherResult?.totalShare).toBe(67500000n); // 1/6 of 405M

			// Remaining for children: 405M - 50.625M - 67.5M - 67.5M = 219.375M
			// Sons (2*2=4 shares) + Daughters (3*1=3 shares) = 7 shares total
			expect(sonsResult?.totalShare).toBeGreaterThan(120000000n); // ~4/7 of remainder
			expect(daughtersResult?.totalShare).toBeGreaterThan(90000000n); // ~3/7 of remainder

			expect(result.totalDistributed).toBe(500000000n);
		});
	});

	describe("Specific Complex Test Cases", () => {
		it("Case 1: Awl with Husband, 2 Full Sisters, Mother", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;
			heirs.saudaraPerempuanKandung = 2;
			heirs.ibu = 1;

			const input: CalculationInput = {
				totalAssets: 120000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Without awl: Husband 1/2 (60M) + Sisters 2/3 (80M) + Mother 1/6 (20M) = 160M > 120M
			// Awl ratio: 160/120 = 4/3, so divide each share by 4/3
			expect(result.awlApplied).toBe(true);
			expect(result.totalDistributed).toBe(120000000n);

			const husbandResult = result.fardResults.find((r) => r.type === "suami");
			const sistersResult = result.fardResults.find((r) => r.type === "saudaraPerempuanKandung");
			const motherResult = result.fardResults.find((r) => r.type === "ibu");

			// Proportional reduction: each gets 3/4 of their original share
			expect(husbandResult?.totalShare).toBe(45000000n); // 60M * 3/4
			expect(sistersResult?.totalShare).toBe(60000000n); // 80M * 3/4
			expect(motherResult?.totalShare).toBe(15000000n); // 20M * 3/4
		});

		it("Case 2: Radd with Mother and One Daughter", () => {
			const heirs = createEmptyHeirs();
			heirs.ibu = 1;
			heirs.anakPerempuan = 1;

			const input: CalculationInput = {
				totalAssets: 60000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Mother 1/6 (10M) + Daughter 1/2 (30M) = 40M, remaining 20M distributed via radd
			expect(result.raddApplied).toBe(true);
			expect(result.totalDistributed).toBe(60000000n);

			const motherResult = result.fardResults.find((r) => r.type === "ibu");
			const daughterResult = result.fardResults.find((r) => r.type === "anakPerempuan");

			// Radd proportional to original shares: Mother gets 1 part, Daughter gets 3 parts
			// 20M divided as 1:3 = 5M + 15M
			expect(motherResult?.totalShare).toBe(15000000n); // 10M + 5M
			expect(daughterResult?.totalShare).toBe(45000000n); // 30M + 15M
		});

		it("Case 3: Hajb blocking - Father blocks Grandfather and Full Brother", () => {
			const heirs = createEmptyHeirs();
			heirs.ayah = 1;
			heirs.kakekAyah = 1;
			heirs.nenekAyah = 1;
			heirs.saudaraLakiKandung = 1;

			const input: CalculationInput = {
				totalAssets: 90000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Father present blocks grandfather and full brother
			// Only father and grandmother should receive shares
			const fatherResult = result.fardResults.find((r) => r.type === "ayah") || 
							   result.asabahResults.find((r) => r.type === "ayah");
			const grandfatherResult = result.fardResults.find((r) => r.type === "kakekAyah") || 
									 result.asabahResults.find((r) => r.type === "kakekAyah");
			const grandmotherResult = result.fardResults.find((r) => r.type === "nenekAyah");
			const brotherResult = result.fardResults.find((r) => r.type === "saudaraLakiKandung") ||
								 result.asabahResults.find((r) => r.type === "saudaraLakiKandung");

			expect(fatherResult?.totalShare).toBeGreaterThan(0n);
			expect(grandmotherResult?.totalShare).toBeGreaterThan(0n); // Grandmother 1/6
			expect(grandfatherResult?.totalShare || 0n).toBe(0n); // Blocked
			expect(brotherResult?.totalShare || 0n).toBe(0n); // Blocked
			expect(result.totalDistributed).toBe(90000000n);
		});

		it("Case 4: Complex Siblings Distribution", () => {
			const heirs = createEmptyHeirs();
			heirs.saudaraLakiKandung = 1;
			heirs.saudaraPerempuanKandung = 2;
			heirs.saudaraLakiSeibu = 2;
			heirs.saudaraPerempuanSeibu = 1;

			const input: CalculationInput = {
				totalAssets: 240000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Maternal siblings get 1/3 total (80M) shared equally among 3 people = ~26.67M each
			// Remaining 160M goes to full siblings as asabah (2:1 ratio)
			const maternalBroResult = result.fardResults.find((r) => r.type === "saudaraLakiSeibu");
			const maternalSisResult = result.fardResults.find((r) => r.type === "saudaraPerempuanSeibu");
			const fullBroResult = result.asabahResults.find((r) => r.type === "saudaraLakiKandung");
			const fullSisResult = result.asabahResults.find((r) => r.type === "saudaraPerempuanKandung");

			// Maternal siblings equal shares
			expect(maternalBroResult?.individualShare).toBe(maternalSisResult?.individualShare);
			expect(maternalBroResult?.totalShare).toBe(53333333n); // 2 * 26.67M (rounded)
			expect(maternalSisResult?.totalShare).toBe(26666667n); // 1 * 26.67M (rounded)

			// Full siblings asabah with 2:1 ratio
			expect(fullBroResult?.totalShare).toBeGreaterThan(fullSisResult?.totalShare || 0n);
			expect(result.totalDistributed).toBe(240000000n);
		});

		it("Case 5: Large Complex Case with Debt and Wasiat", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 1;
			heirs.ayah = 1;
			heirs.ibu = 1;
			heirs.anakLaki = 2;
			heirs.anakPerempuan = 3;
			heirs.kakekAyah = 1; // Should be blocked by father
			heirs.nenekIbu = 1;
			heirs.saudaraLakiKandung = 1; // Should be blocked by children

			const input: CalculationInput = {
				totalAssets: 600000000n,
				utang: 50000000n,
				wasiatFraction: { num: 1n, den: 10n }, // 10%
				heirs,
			};

			const result = calculateFaraidh(input);

			// Net estate: 600M - 50M (debt) - 55M (wasiat from remaining 550M) = 495M
			expect(result.netEstate).toBe(495000000n);

			const wifeResult = result.fardResults.find((r) => r.type === "istri");
			const fatherResult = result.fardResults.find((r) => r.type === "ayah");
			const motherResult = result.fardResults.find((r) => r.type === "ibu");
			const grandmotherResult = result.fardResults.find((r) => r.type === "nenekIbu");
			const sonsResult = result.asabahResults.find((r) => r.type === "anakLaki");
			const daughtersResult = result.asabahResults.find((r) => r.type === "anakPerempuan");

			// Blocked heirs should not receive anything
			const grandfatherResult = result.fardResults.find((r) => r.type === "kakekAyah") ||
									 result.asabahResults.find((r) => r.type === "kakekAyah");
			const brotherResult = result.fardResults.find((r) => r.type === "saudaraLakiKandung") ||
								 result.asabahResults.find((r) => r.type === "saudaraLakiKandung");

			expect(grandfatherResult?.totalShare || 0n).toBe(0n); // Blocked by father
			expect(brotherResult?.totalShare || 0n).toBe(0n); // Blocked by children

			// Wife: 1/8 (children present)
			expect(wifeResult?.totalShare).toBe(61875000n); // 1/8 of 495M

			// Father: 1/6, Mother: 1/6, Grandmother: 1/6 (shared with mother or separate)
			expect(fatherResult?.totalShare).toBe(82500000n); // 1/6 of 495M
			expect(motherResult?.totalShare).toBe(82500000n); // 1/6 of 495M

			// Children get remainder as asabah (2:1 ratio)
			expect(sonsResult?.totalShare).toBeGreaterThan(daughtersResult?.totalShare || 0n);
			expect(result.totalDistributed).toBe(600000000n);
		});

		it("Soal 1: Kasus Awl Klasik - Suami, Ibu, 2 Saudari Kandung", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;
			heirs.ibu = 1;
			heirs.saudaraPerempuanKandung = 2;

			const input: CalculationInput = {
				totalAssets: 270000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Perhitungan Asli (Sebelum Awl):
			// Suami: 1/2 (karena tidak ada anak) -> 3/6
			// Ibu: 1/6 (karena ada >1 saudara) -> 1/6
			// 2 Saudari Kandung: 2/3 (karena >1 dan tidak ada anak/ayah) -> 4/6
			// Total: 3/6 + 1/6 + 4/6 = 8/6. Terjadi Awl, asal masalah dari 6 menjadi 8.

			expect(result.awlApplied).toBe(true);
			expect(result.awlRatio?.originalAshl).toBe(6n); // KPK dari 2, 6, 3 adalah 6
			expect(result.awlRatio?.newAshl).toBe(8n);     // Jumlah pembilang 3+1+4 = 8

			const suamiResult = result.fardResults.find((r) => r.type === "suami");
			const ibuResult = result.fardResults.find((r) => r.type === "ibu");
			const saudariKandungResult = result.fardResults.find(
				(r) => r.type === "saudaraPerempuanKandung",
			);

			// Setelah Awl (total harta 270M):
			// Suami: 3/8 * 270M = 101.250.000
			// Ibu: 1/8 * 270M = 33.750.000
			// 2 Saudari Kandung: 4/8 * 270M = 135.000.000 (masing-masing 67.500.000)

			expect(suamiResult?.totalShare).toBe(101250000n);
			expect(ibuResult?.totalShare).toBe(33750000n);
			expect(saudariKandungResult?.totalShare).toBe(135000000n);
			expect(saudariKandungResult?.individualShare).toBe(67500000n);

			expect(result.totalDistributed).toBe(270000000n);
			expect(result.netEstate).toBe(270000000n);
		});

		it("Soal 2: Kasus Radd - Ibu dan 1 Anak Perempuan", () => {
			const heirs = createEmptyHeirs();
			heirs.ibu = 1;
			heirs.anakPerempuan = 1;

			const input: CalculationInput = {
				totalAssets: 60000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Perhitungan Fardhu Awal:
			// Ibu: 1/6 (karena ada anak)
			// Anak Perempuan: 1/2 (karena sendirian)
			// Asal masalah: 6
			// Ibu: 1/6
			// Anak Perempuan: 3/6
			// Total Fardhu: 1/6 + 3/6 = 4/6. Sisa 2/6 dikembalikan (Radd).
			// Proporsi Radd: Ibu (1) : Anak Perempuan (3)

			expect(result.raddApplied).toBe(true);

			const ibuResult = result.fardResults.find((r) => r.type === "ibu");
			const anakPerempuanResult = result.fardResults.find(
				(r) => r.type === "anakPerempuan",
			);

			// Setelah Radd (total harta 60M):
			// Ibu: (1/4 dari total setelah fardhu) * 60M = 15.000.000
			//    Bagian fardhunya 1/6 * 60M = 10M. Tambahan radd 5M.
			// Anak Perempuan: (3/4 dari total setelah fardhu) * 60M = 45.000.000
			//    Bagian fardhunya 1/2 * 60M = 30M. Tambahan radd 15M.

			expect(ibuResult?.totalShare).toBe(15000000n); // 10M (fard) + 5M (radd)
			expect(anakPerempuanResult?.totalShare).toBe(45000000n); // 30M (fard) + 15M (radd)

			// Verifikasi porsi akhir setelah radd
			// Ibu mendapat 1 bagian dari 4 (1+3) bagian yang di-radd-kan.
			// Anak perempuan mendapat 3 bagian dari 4 (1+3) bagian yang di-radd-kan.
			expect(ibuResult?.portionAfterRadd).toEqual({ num: 1n, den: 4n });
			expect(anakPerempuanResult?.portionAfterRadd).toEqual({ num: 3n, den: 4n });

			expect(result.totalDistributed).toBe(60000000n);
		});

		it("Soal 3: Masalah Gharrawain - Suami, Ibu, Ayah", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;
			heirs.ibu = 1;
			heirs.ayah = 1;

			const input: CalculationInput = {
				totalAssets: 120000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Perhitungan:
			// Suami: 1/2 (tidak ada anak) -> 60M
			// Sisa: 120M - 60M = 60M
			// Ibu: 1/3 dari sisa -> 1/3 * 60M = 20M
			// Ayah: Sisa (asabah) -> 60M - 20M = 40M

			const suamiResult = result.fardResults.find((r) => r.type === "suami");
			const ibuResult = result.fardResults.find((r) => r.type === "ibu");
			const ayahResult = result.asabahResults.find((r) => r.type === "ayah"); // Ayah disini sebagai asabah

			expect(suamiResult?.totalShare).toBe(60000000n);
			// Ibu mendapat 1/3 dari sisa SETELAH suami (bukan 1/3 dari total harta)
			// Ini adalah kasus khusus Gharrawain/Umariyatain.
			// Jadi bagian ibu bukan 1/3*120M=40M, tapi (120M-60M)/3 = 20M.
			// Atau, jika asal masalah 6: Suami 3/6, Ibu (1/3 sisa) => (6-3)/3 = 1 => 1/6 dari total. Ayah sisa 2/6.
			expect(ibuResult?.totalShare).toBe(20000000n);
			expect(ayahResult?.totalShare).toBe(40000000n);

			expect(result.totalDistributed).toBe(120000000n);
			expect(result.isGharrawain).toBe(true); // Atau flag serupa jika ada
		});

		it("Soal 4: Hajb Kompleks dan Asabah bil Ghair", () => {
			const heirs = createEmptyHeirs();
			heirs.istri = 1;
			heirs.ibu = 1;
			heirs.nenekIbu = 1; // Terhalang ibu
			heirs.anakLaki = 1;
			heirs.anakPerempuan = 2;
			heirs.saudaraLakiKandung = 1; // Terhalang anak laki-laki

			const input: CalculationInput = {
				totalAssets: 480000000n,
				utang: 20000000n,
				wasiatFraction: { num: 1n, den: 10n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Perhitungan Awal:
			const hartaSetelahUtang = 480000000n - 20000000n; // 460M
			expect(result.hartaSetelahUtang).toBe(460000000n);
			const nominalWasiat = hartaSetelahUtang / 10n; // 46M
			expect(result.wasiat).toBe(nominalWasiat);
			const netEstate = hartaSetelahUtang - nominalWasiat; // 460M - 46M = 414M
			expect(result.netEstate).toBe(414000000n);

			// Hajb:
			expect(result.ibtalApplied).toEqual(
				expect.arrayContaining(["nenekIbu", "saudaraLakiKandung"]),
			);

			// Pembagian Fardhu (dari 414M):
			// Istri: 1/8 (karena ada anak) -> 1/8 * 414M = 51.750.000
			// Ibu: 1/6 (karena ada anak) -> 1/6 * 414M = 69.000.000
			const istriResult = result.fardResults.find((r) => r.type === "istri");
			const ibuResult = result.fardResults.find((r) => r.type === "ibu");
			expect(istriResult?.totalShare).toBe(51750000n);
			expect(ibuResult?.totalShare).toBe(69000000n);

			// Sisa untuk Asabah: 414M - 51.75M - 69M = 293.250.000
			const sisaAshabah = netEstate - istriResult!.totalShare - ibuResult!.totalShare;
			expect(sisaAshabah).toBe(293250000n);

			// Pembagian Asabah (Anak Laki-laki : Anak Perempuan = 2:1)
			// 1 Anak Laki (2 bagian) + 2 Anak Perempuan (2*1 bagian) = 4 bagian total untuk anak-anak
			// Anak Laki-laki: (2/4) * 293.250.000 = 146.625.000
			// Anak Perempuan (total): (2/4) * 293.250.000 = 146.625.000
			// Anak Perempuan (per individu): 146.625.000 / 2 = 73.312.500

			const anakLakiResult = result.asabahResults.find(
				(r) => r.type === "anakLaki",
			);
			const anakPerempuanResult = result.asabahResults.find(
				(r) => r.type === "anakPerempuan",
			);

			expect(anakLakiResult?.totalShare).toBe(146625000n);
			expect(anakPerempuanResult?.totalShare).toBe(146625000n);
			expect(anakPerempuanResult?.individualShare).toBe(73312500n);

			// Cek total distribusi kembali ke total aset awal
			expect(result.totalDistributed).toBe(480000000n);
		});

		it("Soal 5: Masalah Musytarakah/Himariyah", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;
			heirs.ibu = 1; // Bisa juga nenek
			heirs.saudaraLakiSeibu = 1; // Atau kombinasi saudara/i seibu >= 2
			heirs.saudaraPerempuanSeibu = 1;
			heirs.saudaraLakiKandung = 1; // Atau lebih, bisa juga bersama saudari kandung

			const input: CalculationInput = {
				totalAssets: 360000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Perhitungan Standar (NON-Musytarakah):
			// Suami: 1/2 -> 180M
			// Ibu: 1/6 -> 60M
			// 2 Saudara Seibu (total): 1/3 -> 120M (masing-masing 60M)
			// Total fardhu: 180M + 60M + 120M = 360M.
			// Saudara Kandung Laki-laki (asabah) tidak dapat apa-apa. Ini yang dipermasalahkan.

			// Dalam kasus Musytarakah, 1/3 bagian yang untuk saudara seibu itu dibagi bersama
			// dengan saudara kandung (laki-laki atau laki-laki+perempuan).
			// Pembagian di antara mereka sama rata (laki-laki tidak 2x perempuan dalam konteks ini).

			expect(result.isMusytarakah).toBe(true); // Atau flag serupa

			const suamiResult = result.fardResults.find((r) => r.type === "suami");
			const ibuResult = result.fardResults.find((r) => r.type === "ibu");
			// Dalam Musytarakah, saudara seibu dan saudara kandung berbagi 1/3
			const saudaraSeibuResults = result.fardResults.filter(
				(r) => r.type === "saudaraLakiSeibu" || r.type === "saudaraPerempuanSeibu",
			);
			const saudaraKandungResult = result.fardResults.find( // Atau asabahResults jika engine menempatkannya disitu tapi tetap berbagi 1/3
				(r) => r.type === "saudaraLakiKandung",
			);

			expect(suamiResult?.totalShare).toBe(180000000n); // 1/2 * 360M
			expect(ibuResult?.totalShare).toBe(60000000n);   // 1/6 * 360M

			// Sisa 1/3 (120M) dibagi untuk 2 saudara seibu + 1 saudara kandung = 3 orang.
			// Masing-masing dapat 120M / 3 = 40M.
			const sharedPortion = (input.totalAssets * 1n) / 3n; // 120M
			const numberOfSharersInMusytarakah = BigInt(heirs.saudaraLakiSeibu + heirs.saudaraPerempuanSeibu + heirs.saudaraLakiKandung);

			saudaraSeibuResults.forEach(saudara => {
				expect(saudara.totalShare).toBe(sharedPortion / numberOfSharersInMusytarakah * BigInt(saudara.count) ); // 40M per saudara seibu
			});

			// Saudara kandung laki-laki juga ikut mendapat bagian dari 1/3 tersebut.
			expect(saudaraKandungResult?.totalShare).toBe(sharedPortion / numberOfSharersInMusytarakah * BigInt(heirs.saudaraLakiKandung)); // 40M

			// Total dari kelompok yang berbagi 1/3:
			const totalSharedAmongSiblings = saudaraSeibuResults.reduce((sum, r) => sum + r.totalShare, 0n) + (saudaraKandungResult?.totalShare ?? 0n);
			expect(totalSharedAmongSiblings).toBe(sharedPortion); // 120M

			expect(result.totalDistributed).toBe(360000000n);
		});

		it("Soal 6: Kakek Bersama 2 Saudara Kandung Laki-laki (Muqasamah)", () => {
			const heirs = createEmptyHeirs();
			heirs.kakekAyah = 1;
			heirs.saudaraLakiKandung = 2;

			const input: CalculationInput = {
				totalAssets: 180000000n,
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Kakek akan memilih muqasamah (dianggap sebagai saudara laki-laki).
			// Jadi, ada 1 Kakek + 2 Saudara Laki Kandung = 3 "bagian" setara.
			// Masing-masing dapat 1/3.
			// 1/3 dari 180M = 60M.
			// Opsi lain kakek: 1/6 harta = 30M. Muqasamah (60M) lebih baik.

			const kakekResult = result.asabahResults.find((r) => r.type === "kakekAyah"); // Atau fardResults jika engine menganggapnya demikian dalam kasus ini
			const saudaraResult = result.asabahResults.find(
				(r) => r.type === "saudaraLakiKandung",
			);

			expect(kakekResult?.totalShare).toBe(60000000n); // 1/3
			expect(saudaraResult?.totalShare).toBe(120000000n); // 2/3
			expect(saudaraResult?.individualShare).toBe(60000000n);

			expect(result.totalDistributed).toBe(180000000n);
		});

		it("Soal 7: Awl dengan Suami, Ibu, Ayah, 2 Anak Perempuan, 1 Cucu Perempuan dari Anak Laki", () => {
			const heirs = createEmptyHeirs();
			heirs.suami = 1;
			heirs.ibu = 1;
			heirs.ayah = 1;
			heirs.anakPerempuan = 2;
			heirs.cucuPerempuanDariAnakLaki = 1;

			const input: CalculationInput = {
				totalAssets: 540000000n, // Dipilih agar mudah dibagi dengan asal masalah awl
				utang: 0n,
				wasiatFraction: { num: 0n, den: 1n },
				heirs,
			};

			const result = calculateFaraidh(input);

			// Perhitungan Asli (Sebelum Awl):
			// Suami: 1/4 (ada anak/cucu) -> 3/12
			// Ibu: 1/6 (ada anak/cucu) -> 2/12
			// Ayah: 1/6 (ada anak/cucu perempuan, tidak ada anak/cucu laki-laki) -> 2/12 (+ asabah jika ada sisa, tapi ini awl)
			// 2 Anak Perempuan: 2/3 (karena >1) -> 8/12
			// 1 Cucu Perempuan dr Anak Laki: Terhalang karena anak perempuan sudah mengambil 2/3

			// Cucu perempuan dalam kasus ini akan terhalang oleh 2 anak perempuan yang sudah mengambil 2/3.
			expect(result.ibtalApplied).toContain("cucuPerempuanDariAnakLaki");
			expect(result.awlApplied).toBe(true);
			expect(result.awlRatio?.originalAshl).toBe(12n);
			expect(result.awlRatio?.newAshl).toBe(15n);

			const suamiResult = result.fardResults.find((r) => r.type === "suami");
			const ibuResult = result.fardResults.find((r) => r.type === "ibu");
			const ayahResult = result.fardResults.find((r) => r.type === "ayah");
			const anakPerempuanResult = result.fardResults.find(
				(r) => r.type === "anakPerempuan",
			);

			// Setelah Awl (total harta 540M, asal masalah baru 15):
			// Suami: 3/15 * 540M = 108M
			// Ibu: 2/15 * 540M = 72M
			// Ayah: 2/15 * 540M = 72M
			// 2 Anak Perempuan: 8/15 * 540M = 288M (masing-masing 144M)

			expect(suamiResult?.totalShare).toBe(108000000n);
			expect(ibuResult?.totalShare).toBe(72000000n);
			expect(ayahResult?.totalShare).toBe(72000000n); // Ayah hanya dapat fardh karena Awl
			expect(anakPerempuanResult?.totalShare).toBe(288000000n);
			expect(anakPerempuanResult?.individualShare).toBe(144000000n);

			const cucuResult = result.fardResults.find(r => r.type === "cucuPerempuanDariAnakLaki");
			expect(cucuResult === undefined || cucuResult?.totalShare === 0n).toBe(true);

			expect(result.totalDistributed).toBe(540000000n);
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
