import { Terbilang } from "@/utils/Terbilang";
import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

describe("Terbilang - Accounting Use Cases", () => {
	describe("Indonesian Rupiah Amounts", () => {
		it("should handle common salary amounts", () => {
			expect(Terbilang.Convert(5000000)).toBe("lima juta");
			expect(Terbilang.Convert(12500000)).toBe(
				"dua belas juta lima ratus ribu",
			);
			expect(Terbilang.Convert(25000000)).toBe("dua puluh lima juta");
			expect(Terbilang.Convert(50000000)).toBe("lima puluh juta");
			expect(Terbilang.Convert(100000000)).toBe("seratus juta");
		});

		it("should handle corporate revenue amounts", () => {
			expect(Terbilang.Convert(new Decimal("1500000000"))).toBe(
				"satu miliar lima ratus juta",
			);
			expect(Terbilang.Convert(new Decimal("25000000000"))).toBe(
				"dua puluh lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("100000000000"))).toBe(
				"seratus miliar",
			);
			expect(Terbilang.Convert(new Decimal("750000000000"))).toBe(
				"tujuh ratus lima puluh miliar",
			);
			expect(Terbilang.Convert(new Decimal("1000000000000"))).toBe(
				"satu triliun",
			);
		});

		it("should handle bank transaction amounts", () => {
			expect(Terbilang.Convert(2500000)).toBe("dua juta lima ratus ribu");
			expect(Terbilang.Convert(7850000)).toBe(
				"tujuh juta delapan ratus lima puluh ribu",
			);
			expect(Terbilang.Convert(15750000)).toBe(
				"lima belas juta tujuh ratus lima puluh ribu",
			);
			expect(Terbilang.Convert(99999999)).toBe(
				"sembilan puluh sembilan juta sembilan ratus sembilan puluh sembilan ribu sembilan ratus sembilan puluh sembilan",
			);
		});

		it("should handle precise currency amounts with cents", () => {
			expect(Terbilang.Convert(1250.5, "1250.50")).toBe(
				"seribu dua ratus lima puluh koma lima nol",
			);
			expect(Terbilang.Convert(5000.25, "5000.25")).toBe(
				"lima ribu koma dua lima",
			);
			expect(Terbilang.Convert(10000.99, "10000.99")).toBe(
				"sepuluh ribu koma sembilan sembilan",
			);
			expect(Terbilang.Convert(999999.01, "999999.01")).toBe(
				"sembilan ratus sembilan puluh sembilan ribu sembilan ratus sembilan puluh sembilan koma nol satu",
			);
		});
	});

	describe("Financial Statement Scenarios", () => {
		it("should handle balance sheet amounts", () => {
			// Assets
			expect(Terbilang.Convert(new Decimal("45000000000"))).toBe(
				"empat puluh lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("123456789000"))).toBe(
				"seratus dua puluh tiga miliar empat ratus lima puluh enam juta tujuh ratus delapan puluh sembilan ribu",
			);

			// Liabilities
			expect(Terbilang.Convert(new Decimal("25000000000"))).toBe(
				"dua puluh lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("87654321000"))).toBe(
				"delapan puluh tujuh miliar enam ratus lima puluh empat juta tiga ratus dua puluh satu ribu",
			);

			// Equity
			expect(Terbilang.Convert(new Decimal("20000000000"))).toBe(
				"dua puluh miliar",
			);
		});

		it("should handle income statement amounts", () => {
			// Revenue
			expect(Terbilang.Convert(new Decimal("500000000000"))).toBe(
				"lima ratus miliar",
			);
			expect(Terbilang.Convert(new Decimal("1250000000000"))).toBe(
				"satu triliun dua ratus lima puluh miliar",
			);

			// Expenses
			expect(Terbilang.Convert(new Decimal("450000000000"))).toBe(
				"empat ratus lima puluh miliar",
			);
			expect(Terbilang.Convert(new Decimal("75000000000"))).toBe(
				"tujuh puluh lima miliar",
			);

			// Net Income
			expect(Terbilang.Convert(new Decimal("50000000000"))).toBe(
				"lima puluh miliar",
			);
		});

		it("should handle cash flow amounts", () => {
			expect(Terbilang.Convert(new Decimal("125000000000"))).toBe(
				"seratus dua puluh lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("89500000000"))).toBe(
				"delapan puluh sembilan miliar lima ratus juta",
			);
			expect(Terbilang.Convert(new Decimal("156789012345"))).toBe(
				"seratus lima puluh enam miliar tujuh ratus delapan puluh sembilan juta dua belas ribu tiga ratus empat puluh lima",
			);
		});

		it("should handle negative amounts (losses/deficits)", () => {
			expect(Terbilang.Convert(new Decimal("-5000000000"))).toBe(
				"minus lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("-25000000"))).toBe(
				"minus dua puluh lima juta",
			);
			expect(Terbilang.Convert(new Decimal("-1500000"))).toBe(
				"minus satu juta lima ratus ribu",
			);
			expect(Terbilang.Convert(-750000.5, "-750000.50")).toBe(
				"minus tujuh ratus lima puluh ribu koma lima nol",
			);
		});
	});

	describe("Tax and Audit Calculations", () => {
		it("should handle tax amounts with high precision", () => {
			expect(Terbilang.Convert(1250000.25, "1250000.25")).toBe(
				"satu juta dua ratus lima puluh ribu koma dua lima",
			);
			expect(Terbilang.Convert(5687500.75, "5687500.75")).toBe(
				"lima juta enam ratus delapan puluh tujuh ribu lima ratus koma tujuh lima",
			);
			expect(Terbilang.Convert(12345678.99, "12345678.99")).toBe(
				"dua belas juta tiga ratus empat puluh lima ribu enam ratus tujuh puluh delapan koma sembilan sembilan",
			);
		});

		it("should handle VAT calculations (11%)", () => {
			const baseAmount = new Decimal("10000000"); // 10 million
			const vatRate = new Decimal("0.11");
			const vatAmount = baseAmount.times(vatRate);

			expect(Terbilang.Convert(baseAmount)).toBe("sepuluh juta");
			expect(Terbilang.Convert(vatAmount)).toBe("satu juta seratus ribu");
			expect(Terbilang.Convert(baseAmount.plus(vatAmount))).toBe(
				"sebelas juta seratus ribu",
			);
		});

		it("should handle income tax brackets", () => {
			// PTKP amounts
			expect(Terbilang.Convert(54000000)).toBe("lima puluh empat juta");
			expect(Terbilang.Convert(58500000)).toBe(
				"lima puluh delapan juta lima ratus ribu",
			);
			expect(Terbilang.Convert(63000000)).toBe("enam puluh tiga juta");

			// Tax calculations
			expect(Terbilang.Convert(2500000)).toBe("dua juta lima ratus ribu"); // 5% bracket
			expect(Terbilang.Convert(12500000)).toBe(
				"dua belas juta lima ratus ribu",
			); // 15% bracket
			expect(Terbilang.Convert(70000000)).toBe("tujuh puluh juta"); // 25% bracket
		});

		it("should handle withholding tax amounts", () => {
			expect(Terbilang.Convert(250000)).toBe("dua ratus lima puluh ribu"); // PPh 21
			expect(Terbilang.Convert(500000)).toBe("lima ratus ribu"); // PPh 23
			expect(Terbilang.Convert(1000000)).toBe("satu juta"); // PPh 4(2)
			expect(Terbilang.Convert(150000.5, "150000.50")).toBe(
				"seratus lima puluh ribu koma lima nol",
			);
		});
	});

	describe("Banking and Investment Scenarios", () => {
		it("should handle loan amounts", () => {
			// Mortgage loans
			expect(Terbilang.Convert(new Decimal("500000000"))).toBe(
				"lima ratus juta",
			);
			expect(Terbilang.Convert(new Decimal("1000000000"))).toBe("satu miliar");
			expect(Terbilang.Convert(new Decimal("2500000000"))).toBe(
				"dua miliar lima ratus juta",
			);

			// Business loans
			expect(Terbilang.Convert(new Decimal("10000000000"))).toBe(
				"sepuluh miliar",
			);
			expect(Terbilang.Convert(new Decimal("50000000000"))).toBe(
				"lima puluh miliar",
			);
		});

		it("should handle interest calculations", () => {
			const principal = new Decimal("100000000"); // 100 million
			const rate = new Decimal("0.12"); // 12% annual
			const monthlyInterest = principal.times(rate).dividedBy(12);

			expect(Terbilang.Convert(principal)).toBe("seratus juta");
			expect(Terbilang.Convert(monthlyInterest)).toBe("satu juta");
		});

		it("should handle investment portfolio values", () => {
			expect(Terbilang.Convert(new Decimal("25000000000"))).toBe(
				"dua puluh lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("156789012345"))).toBe(
				"seratus lima puluh enam miliar tujuh ratus delapan puluh sembilan juta dua belas ribu tiga ratus empat puluh lima",
			);
			expect(Terbilang.Convert(new Decimal("999999999999"))).toBe(
				"sembilan ratus sembilan puluh sembilan miliar sembilan ratus sembilan puluh sembilan juta sembilan ratus sembilan puluh sembilan ribu sembilan ratus sembilan puluh sembilan",
			);
		});

		it("should handle foreign exchange amounts", () => {
			// USD to IDR conversions (assuming rate ~15,000)
			expect(Terbilang.Convert(new Decimal("15000000"))).toBe(
				"lima belas juta",
			); // $1,000
			expect(Terbilang.Convert(new Decimal("150000000"))).toBe(
				"seratus lima puluh juta",
			); // $10,000
			expect(Terbilang.Convert(new Decimal("1500000000"))).toBe(
				"satu miliar lima ratus juta",
			); // $100,000
		});
	});

	describe("Payroll and HR Calculations", () => {
		it("should handle employee compensation", () => {
			// Basic salaries
			expect(Terbilang.Convert(5000000)).toBe("lima juta");
			expect(Terbilang.Convert(15000000)).toBe("lima belas juta");
			expect(Terbilang.Convert(25000000)).toBe("dua puluh lima juta");
			expect(Terbilang.Convert(50000000)).toBe("lima puluh juta");

			// Bonuses
			expect(Terbilang.Convert(12500000)).toBe(
				"dua belas juta lima ratus ribu",
			);
			expect(Terbilang.Convert(37500000)).toBe(
				"tiga puluh tujuh juta lima ratus ribu",
			);
		});

		it("should handle social security contributions", () => {
			// BPJS Kesehatan (4%)
			const salary = new Decimal("10000000");
			const healthInsurance = salary.times(new Decimal("0.04"));
			expect(Terbilang.Convert(healthInsurance)).toBe("empat ratus ribu");

			// BPJS Ketenagakerjaan (2%)
			const workInsurance = salary.times(new Decimal("0.02"));
			expect(Terbilang.Convert(workInsurance)).toBe("dua ratus ribu");
		});

		it("should handle overtime calculations", () => {
			const hourlyRate = new Decimal("50000");
			const overtimeHours = new Decimal("10");
			const overtimeMultiplier = new Decimal("1.5");
			const overtimePay = hourlyRate
				.times(overtimeHours)
				.times(overtimeMultiplier);

			expect(Terbilang.Convert(overtimePay)).toBe(
				"tujuh ratus lima puluh ribu",
			);
		});
	});

	describe("Complex Real-World Scenarios", () => {
		it("should handle corporate acquisition amounts", () => {
			// Large M&A transactions
			expect(Terbilang.Convert(new Decimal("5000000000000"))).toBe(
				"lima triliun",
			);
			expect(Terbilang.Convert(new Decimal("12500000000000"))).toBe(
				"dua belas triliun lima ratus miliar",
			);
			expect(Terbilang.Convert(new Decimal("25000000000000"))).toBe(
				"dua puluh lima triliun",
			);
		});

		it("should handle government budget amounts", () => {
			// Municipal budgets
			expect(Terbilang.Convert(new Decimal("500000000000"))).toBe(
				"lima ratus miliar",
			);
			expect(Terbilang.Convert(new Decimal("1250000000000"))).toBe(
				"satu triliun dua ratus lima puluh miliar",
			);

			// National budget components
			expect(Terbilang.Convert(new Decimal("2500000000000000"))).toBe(
				"dua kuadriliun lima ratus triliun",
			);
		});

		it("should handle insurance claim amounts", () => {
			expect(Terbilang.Convert(25000000)).toBe("dua puluh lima juta");
			expect(Terbilang.Convert(100000000)).toBe("seratus juta");
			expect(Terbilang.Convert(500000000)).toBe("lima ratus juta");
			expect(Terbilang.Convert(new Decimal("2000000000"))).toBe("dua miliar");
		});

		it("should handle construction project costs", () => {
			// Building costs
			expect(Terbilang.Convert(new Decimal("15000000000"))).toBe(
				"lima belas miliar",
			);
			expect(Terbilang.Convert(new Decimal("75000000000"))).toBe(
				"tujuh puluh lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("250000000000"))).toBe(
				"dua ratus lima puluh miliar",
			);

			// Infrastructure projects
			expect(Terbilang.Convert(new Decimal("1000000000000"))).toBe(
				"satu triliun",
			);
			expect(Terbilang.Convert(new Decimal("5000000000000"))).toBe(
				"lima triliun",
			);
		});

		it("should handle commodity trading amounts", () => {
			// Palm oil, coal, etc.
			expect(Terbilang.Convert(new Decimal("125000000000"))).toBe(
				"seratus dua puluh lima miliar",
			);
			expect(Terbilang.Convert(new Decimal("367500000000"))).toBe(
				"tiga ratus enam puluh tujuh miliar lima ratus juta",
			);
			expect(Terbilang.Convert(new Decimal("890000000000"))).toBe(
				"delapan ratus sembilan puluh miliar",
			);
		});
	});

	describe("Edge Cases in Accounting", () => {
		it("should handle rounding scenarios", () => {
			// Common rounding in financial calculations
			expect(Terbilang.Convert(1234567.89, "1234567.89")).toBe(
				"satu juta dua ratus tiga puluh empat ribu lima ratus enam puluh tujuh koma delapan sembilan",
			);
			expect(Terbilang.Convert(9876543.21, "9876543.21")).toBe(
				"sembilan juta delapan ratus tujuh puluh enam ribu lima ratus empat puluh tiga koma dua satu",
			);
		});

		it("should handle very small amounts (petty cash)", () => {
			expect(Terbilang.Convert(500)).toBe("lima ratus");
			expect(Terbilang.Convert(1500)).toBe("seribu lima ratus");
			expect(Terbilang.Convert(25000)).toBe("dua puluh lima ribu");
			expect(Terbilang.Convert(75000)).toBe("tujuh puluh lima ribu");
		});

		it("should handle exact currency denominations", () => {
			// Indonesian currency denominations
			expect(Terbilang.Convert(1000)).toBe("seribu");
			expect(Terbilang.Convert(2000)).toBe("dua ribu");
			expect(Terbilang.Convert(5000)).toBe("lima ribu");
			expect(Terbilang.Convert(10000)).toBe("sepuluh ribu");
			expect(Terbilang.Convert(20000)).toBe("dua puluh ribu");
			expect(Terbilang.Convert(50000)).toBe("lima puluh ribu");
			expect(Terbilang.Convert(100000)).toBe("seratus ribu");
		});

		it("should handle financial ratios and percentages as decimals", () => {
			expect(Terbilang.Convert(0.25, "0.25")).toBe("nol koma dua lima"); // 25%
			expect(Terbilang.Convert(0.125, "0.125")).toBe("nol koma satu dua lima"); // 12.5%
			expect(Terbilang.Convert(1.05, "1.05")).toBe("satu koma nol lima"); // 105%
			expect(Terbilang.Convert(2.5, "2.50")).toBe("dua koma lima nol"); // 250%
		});
	});

	describe("Multi-Currency Scenarios", () => {
		it("should handle USD equivalent amounts", () => {
			// Common USD amounts in IDR
			expect(Terbilang.Convert(new Decimal("15000000"))).toBe(
				"lima belas juta",
			); // ~$1,000
			expect(Terbilang.Convert(new Decimal("75000000"))).toBe(
				"tujuh puluh lima juta",
			); // ~$5,000
			expect(Terbilang.Convert(new Decimal("150000000"))).toBe(
				"seratus lima puluh juta",
			); // ~$10,000
			expect(Terbilang.Convert(new Decimal("1500000000"))).toBe(
				"satu miliar lima ratus juta",
			); // ~$100,000
		});

		it("should handle EUR equivalent amounts", () => {
			// Common EUR amounts in IDR
			expect(Terbilang.Convert(new Decimal("17000000"))).toBe(
				"tujuh belas juta",
			); // ~€1,000
			expect(Terbilang.Convert(new Decimal("85000000"))).toBe(
				"delapan puluh lima juta",
			); // ~€5,000
			expect(Terbilang.Convert(new Decimal("170000000"))).toBe(
				"seratus tujuh puluh juta",
			); // ~€10,000
		});

		it("should handle JPY equivalent amounts", () => {
			// Common JPY amounts in IDR
			expect(Terbilang.Convert(new Decimal("140000"))).toBe(
				"seratus empat puluh ribu",
			); // ~¥100
			expect(Terbilang.Convert(new Decimal("1400000"))).toBe(
				"satu juta empat ratus ribu",
			); // ~¥1,000
			expect(Terbilang.Convert(new Decimal("14000000"))).toBe(
				"empat belas juta",
			); // ~¥10,000
		});
	});
});
