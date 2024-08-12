import { Terbilang } from "@/utils/Terbilang";
import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

describe("Terbilang", () => {
	describe("Basic number conversion", () => {
		it("should convert zero", () => {
			expect(Terbilang.Convert(0)).toBe("nol");
			expect(Terbilang.Convert(new Decimal(0))).toBe("nol");
		});

		it("should convert numbers 1-11", () => {
			expect(Terbilang.Convert(1)).toBe("satu");
			expect(Terbilang.Convert(2)).toBe("dua");
			expect(Terbilang.Convert(3)).toBe("tiga");
			expect(Terbilang.Convert(4)).toBe("empat");
			expect(Terbilang.Convert(5)).toBe("lima");
			expect(Terbilang.Convert(6)).toBe("enam");
			expect(Terbilang.Convert(7)).toBe("tujuh");
			expect(Terbilang.Convert(8)).toBe("delapan");
			expect(Terbilang.Convert(9)).toBe("sembilan");
			expect(Terbilang.Convert(10)).toBe("sepuluh");
			expect(Terbilang.Convert(11)).toBe("sebelas");
		});

		it("should convert teens (12-19)", () => {
			expect(Terbilang.Convert(12)).toBe("dua belas");
			expect(Terbilang.Convert(13)).toBe("tiga belas");
			expect(Terbilang.Convert(14)).toBe("empat belas");
			expect(Terbilang.Convert(15)).toBe("lima belas");
			expect(Terbilang.Convert(16)).toBe("enam belas");
			expect(Terbilang.Convert(17)).toBe("tujuh belas");
			expect(Terbilang.Convert(18)).toBe("delapan belas");
			expect(Terbilang.Convert(19)).toBe("sembilan belas");
		});

		it("should convert tens (20-90)", () => {
			expect(Terbilang.Convert(20)).toBe("dua puluh");
			expect(Terbilang.Convert(30)).toBe("tiga puluh");
			expect(Terbilang.Convert(40)).toBe("empat puluh");
			expect(Terbilang.Convert(50)).toBe("lima puluh");
			expect(Terbilang.Convert(60)).toBe("enam puluh");
			expect(Terbilang.Convert(70)).toBe("tujuh puluh");
			expect(Terbilang.Convert(80)).toBe("delapan puluh");
			expect(Terbilang.Convert(90)).toBe("sembilan puluh");
		});

		it("should convert tens with units", () => {
			expect(Terbilang.Convert(21)).toBe("dua puluh satu");
			expect(Terbilang.Convert(35)).toBe("tiga puluh lima");
			expect(Terbilang.Convert(47)).toBe("empat puluh tujuh");
			expect(Terbilang.Convert(99)).toBe("sembilan puluh sembilan");
		});
	});

	describe("Hundreds conversion", () => {
		it("should convert 100", () => {
			expect(Terbilang.Convert(100)).toBe("seratus");
		});

		it("should convert 101-199", () => {
			expect(Terbilang.Convert(101)).toBe("seratus satu");
			expect(Terbilang.Convert(150)).toBe("seratus lima puluh");
			expect(Terbilang.Convert(199)).toBe("seratus sembilan puluh sembilan");
		});

		it("should convert 200-999", () => {
			expect(Terbilang.Convert(200)).toBe("dua ratus");
			expect(Terbilang.Convert(300)).toBe("tiga ratus");
			expect(Terbilang.Convert(500)).toBe("lima ratus");
			expect(Terbilang.Convert(999)).toBe(
				"sembilan ratus sembilan puluh sembilan",
			);
		});

		it("should convert hundreds with tens and units", () => {
			expect(Terbilang.Convert(234)).toBe("dua ratus tiga puluh empat");
			expect(Terbilang.Convert(567)).toBe("lima ratus enam puluh tujuh");
			expect(Terbilang.Convert(812)).toBe("delapan ratus dua belas");
		});
	});

	describe("Thousands conversion", () => {
		it("should convert 1000", () => {
			expect(Terbilang.Convert(1000)).toBe("seribu");
		});

		it("should convert 1001-1999", () => {
			expect(Terbilang.Convert(1001)).toBe("seribu satu");
			expect(Terbilang.Convert(1500)).toBe("seribu lima ratus");
			expect(Terbilang.Convert(1999)).toBe(
				"seribu sembilan ratus sembilan puluh sembilan",
			);
		});

		it("should convert thousands", () => {
			expect(Terbilang.Convert(2000)).toBe("dua ribu");
			expect(Terbilang.Convert(5000)).toBe("lima ribu");
			expect(Terbilang.Convert(10000)).toBe("sepuluh ribu");
			expect(Terbilang.Convert(25000)).toBe("dua puluh lima ribu");
			expect(Terbilang.Convert(100000)).toBe("seratus ribu");
			expect(Terbilang.Convert(999999)).toBe(
				"sembilan ratus sembilan puluh sembilan ribu sembilan ratus sembilan puluh sembilan",
			);
		});

		it("should convert complex thousands", () => {
			expect(Terbilang.Convert(12345)).toBe(
				"dua belas ribu tiga ratus empat puluh lima",
			);
			expect(Terbilang.Convert(54321)).toBe(
				"lima puluh empat ribu tiga ratus dua puluh satu",
			);
		});
	});

	describe("Millions conversion", () => {
		it("should convert millions", () => {
			expect(Terbilang.Convert(1000000)).toBe("satu juta");
			expect(Terbilang.Convert(2000000)).toBe("dua juta");
			expect(Terbilang.Convert(5000000)).toBe("lima juta");
			expect(Terbilang.Convert(10000000)).toBe("sepuluh juta");
			expect(Terbilang.Convert(100000000)).toBe("seratus juta");
		});

		it("should convert complex millions", () => {
			expect(Terbilang.Convert(1234567)).toBe(
				"satu juta dua ratus tiga puluh empat ribu lima ratus enam puluh tujuh",
			);
			expect(Terbilang.Convert(999999999)).toBe(
				"sembilan ratus sembilan puluh sembilan juta sembilan ratus sembilan puluh sembilan ribu sembilan ratus sembilan puluh sembilan",
			);
		});
	});

	describe("Billions conversion", () => {
		it("should convert billions (miliar)", () => {
			expect(Terbilang.Convert(1000000000)).toBe("satu miliar");
			expect(Terbilang.Convert(2000000000)).toBe("dua miliar");
			expect(Terbilang.Convert(5000000000)).toBe("lima miliar");
		});

		it("should convert complex billions", () => {
			expect(Terbilang.Convert(1234567890)).toBe(
				"satu miliar dua ratus tiga puluh empat juta lima ratus enam puluh tujuh ribu delapan ratus sembilan puluh",
			);
		});
	});

	describe("Large numbers conversion", () => {
		it("should convert trillions", () => {
			expect(Terbilang.Convert(new Decimal("1000000000000"))).toBe(
				"satu triliun",
			);
			expect(Terbilang.Convert(new Decimal("5000000000000"))).toBe(
				"lima triliun",
			);
		});

		it("should convert quadrillions", () => {
			expect(Terbilang.Convert(new Decimal("1000000000000000"))).toBe(
				"satu kuadriliun",
			);
			expect(Terbilang.Convert(new Decimal("3000000000000000"))).toBe(
				"tiga kuadriliun",
			);
		});

		it("should convert quintillions", () => {
			expect(Terbilang.Convert(new Decimal("1000000000000000000"))).toBe(
				"satu kuantiliun",
			);
		});

		it("should convert sextillions", () => {
			expect(Terbilang.Convert(new Decimal("1000000000000000000000"))).toBe(
				"satu sekstiliun",
			);
		});

		it("should convert septillions", () => {
			expect(Terbilang.Convert(new Decimal("1000000000000000000000000"))).toBe(
				"satu septiliun",
			);
		});

		it("should convert octillions", () => {
			expect(
				Terbilang.Convert(new Decimal("1000000000000000000000000000")),
			).toBe("satu oktiliun");
		});

		it("should convert nonillions", () => {
			expect(
				Terbilang.Convert(new Decimal("1000000000000000000000000000000")),
			).toBe("satu noniliun");
		});

		it("should convert decillions", () => {
			expect(
				Terbilang.Convert(new Decimal("1000000000000000000000000000000000")),
			).toBe("satu desiliun");
		});
	});

	describe("Decimal number conversion", () => {
		it("should convert simple decimals", () => {
			expect(Terbilang.Convert(1.5)).toBe("satu koma lima");
			expect(Terbilang.Convert(2.3)).toBe("dua koma tiga");
			expect(Terbilang.Convert(10.7)).toBe("sepuluh koma tujuh");
		});

		it("should convert decimals with multiple digits", () => {
			expect(Terbilang.Convert(1.23)).toBe("satu koma dua tiga");
			expect(Terbilang.Convert(45.678)).toBe(
				"empat puluh lima koma enam tujuh delapan",
			);
			expect(Terbilang.Convert(123.456)).toBe(
				"seratus dua puluh tiga koma empat lima enam",
			);
		});

		it("should convert decimals with zeros", () => {
			expect(Terbilang.Convert(1.05)).toBe("satu koma nol lima");
			expect(Terbilang.Convert(10.203)).toBe("sepuluh koma dua nol tiga");
			expect(Terbilang.Convert(0.5)).toBe("nol koma lima");
		});

		it("should convert Decimal instances with fractions", () => {
			expect(Terbilang.Convert(new Decimal("1.5"))).toBe("satu koma lima");
			expect(Terbilang.Convert(new Decimal("123.456"))).toBe(
				"seratus dua puluh tiga koma empat lima enam",
			);
		});
	});

	describe("Negative number conversion", () => {
		it("should convert negative integers", () => {
			expect(Terbilang.Convert(-1)).toBe("minus satu");
			expect(Terbilang.Convert(-10)).toBe("minus sepuluh");
			expect(Terbilang.Convert(-100)).toBe("minus seratus");
			expect(Terbilang.Convert(-1000)).toBe("minus seribu");
		});

		it("should convert negative decimals", () => {
			expect(Terbilang.Convert(-1.5)).toBe("minus satu koma lima");
			expect(Terbilang.Convert(-123.45)).toBe(
				"minus seratus dua puluh tiga koma empat lima",
			);
		});

		it("should convert negative Decimal instances", () => {
			expect(Terbilang.Convert(new Decimal("-1"))).toBe("minus satu");
			expect(Terbilang.Convert(new Decimal("-123.45"))).toBe(
				"minus seratus dua puluh tiga koma empat lima",
			);
		});
	});

	describe("Edge cases", () => {
		it("should handle very small decimals", () => {
			expect(Terbilang.Convert(0.1)).toBe("nol koma satu");
			expect(Terbilang.Convert(0.01)).toBe("nol koma nol satu");
			expect(Terbilang.Convert(0.001)).toBe("nol koma nol nol satu");
		});

		it("should handle numbers with trailing zeros in decimals", () => {
			expect(Terbilang.Convert(new Decimal("1.10"), "1.10")).toBe(
				"satu koma satu nol",
			);
			expect(Terbilang.Convert(new Decimal("5.500"), "5.500")).toBe(
				"lima koma lima nol nol",
			);
		});

		it("should normalize whitespace", () => {
			const result = Terbilang.Convert(123456);
			expect(result).not.toMatch(/\s{2,}/); // No double spaces
			expect(result.trim()).toBe(result); // No leading/trailing spaces
		});
	});

	describe("Error handling", () => {
		it("should throw TypeError for invalid input types", () => {
			expect(() => Terbilang.Convert("123" as any)).toThrow(TypeError);
			expect(() => Terbilang.Convert("123" as any)).toThrow(
				"Input must be a number or Decimal instance",
			);

			expect(() => Terbilang.Convert(null as any)).toThrow(TypeError);
			expect(() => Terbilang.Convert(undefined as any)).toThrow(TypeError);
			expect(() => Terbilang.Convert({} as any)).toThrow(TypeError);
			expect(() => Terbilang.Convert([] as any)).toThrow(TypeError);
		});

		it("should throw RangeError for numbers too large", () => {
			const tooLarge = new Decimal("1000000000000000000000000000000000000000");
			expect(() => Terbilang.Convert(tooLarge)).toThrow(RangeError);
			expect(() => Terbilang.Convert(tooLarge)).toThrow(
				"Number is too large to convert",
			);
		});
	});

	describe("Type compatibility", () => {
		it("should handle regular numbers", () => {
			expect(Terbilang.Convert(123)).toBe("seratus dua puluh tiga");
			expect(Terbilang.Convert(456.78)).toBe(
				"empat ratus lima puluh enam koma tujuh delapan",
			);
		});

		it("should handle Decimal instances", () => {
			expect(Terbilang.Convert(new Decimal(123))).toBe(
				"seratus dua puluh tiga",
			);
			expect(Terbilang.Convert(new Decimal("456.78"))).toBe(
				"empat ratus lima puluh enam koma tujuh delapan",
			);
		});

		it("should handle very precise Decimal numbers", () => {
			const preciseDecimal = new Decimal("123.123456789");
			expect(Terbilang.Convert(preciseDecimal)).toBe(
				"seratus dua puluh tiga koma satu dua tiga empat lima enam tujuh delapan sembilan",
			);
		});
	});

	describe("Regression tests", () => {
		it("should handle specific problematic numbers", () => {
			expect(Terbilang.Convert(1001)).toBe("seribu satu");
			expect(Terbilang.Convert(2001)).toBe("dua ribu satu");
			expect(Terbilang.Convert(10001)).toBe("sepuluh ribu satu");
			expect(Terbilang.Convert(100001)).toBe("seratus ribu satu");
			expect(Terbilang.Convert(1000001)).toBe("satu juta satu");
		});

		it("should handle boundary numbers correctly", () => {
			expect(Terbilang.Convert(11)).toBe("sebelas");
			expect(Terbilang.Convert(12)).toBe("dua belas");
			expect(Terbilang.Convert(19)).toBe("sembilan belas");
			expect(Terbilang.Convert(20)).toBe("dua puluh");
			expect(Terbilang.Convert(99)).toBe("sembilan puluh sembilan");
			expect(Terbilang.Convert(100)).toBe("seratus");
			expect(Terbilang.Convert(199)).toBe("seratus sembilan puluh sembilan");
			expect(Terbilang.Convert(200)).toBe("dua ratus");
			expect(Terbilang.Convert(999)).toBe(
				"sembilan ratus sembilan puluh sembilan",
			);
			expect(Terbilang.Convert(1000)).toBe("seribu");
			expect(Terbilang.Convert(1999)).toBe(
				"seribu sembilan ratus sembilan puluh sembilan",
			);
			expect(Terbilang.Convert(2000)).toBe("dua ribu");
		});
	});
});
