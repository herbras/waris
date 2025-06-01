import { Terbilang } from "@/utils/Terbilang";
import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

describe("Terbilang - Performance & Stress Tests", () => {
	describe("Bulk Processing Tests", () => {
		it("should handle processing 1000 random numbers efficiently", () => {
			const startTime = performance.now();
			const results: string[] = [];

			for (let i = 0; i < 1000; i++) {
				const randomNum = Math.floor(Math.random() * 1000000000); // Up to 1 billion
				const result = Terbilang.Convert(randomNum);
				results.push(result);
				expect(result).toBeTruthy();
				expect(typeof result).toBe("string");
			}

			const endTime = performance.now();
			const duration = endTime - startTime;

			console.log(`Processed 1000 numbers in ${duration.toFixed(2)}ms`);
			expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
			expect(results.length).toBe(1000);
		});

		it("should handle batch salary calculations", () => {
			const salaries = [
				5000000, 7500000, 10000000, 12500000, 15000000, 20000000, 25000000,
				30000000, 35000000, 40000000, 45000000, 50000000, 60000000, 75000000,
				100000000,
			];

			const startTime = performance.now();
			const results = salaries.map((salary) => ({
				amount: salary,
				text: Terbilang.Convert(salary),
			}));
			const endTime = performance.now();

			console.log(
				`Processed ${salaries.length} salaries in ${(endTime - startTime).toFixed(2)}ms`,
			);

			expect(results).toHaveLength(15);
			expect(results[0].text).toBe("lima juta");
			expect(results[14].text).toBe("seratus juta");
		});

		it("should handle large financial calculations efficiently", () => {
			const largeAmounts = [
				new Decimal("1000000000"), // 1 billion
				new Decimal("10000000000"), // 10 billion
				new Decimal("100000000000"), // 100 billion
				new Decimal("1000000000000"), // 1 trillion
				new Decimal("10000000000000"), // 10 trillion
			];

			const startTime = performance.now();
			const results = largeAmounts.map((amount) => Terbilang.Convert(amount));
			const endTime = performance.now();

			console.log(
				`Processed ${largeAmounts.length} large amounts in ${(endTime - startTime).toFixed(2)}ms`,
			);

			expect(results).toHaveLength(5);
			expect(results[0]).toBe("satu miliar");
			expect(results[4]).toBe("sepuluh triliun");
		});
	});

	describe("Memory Usage Tests", () => {
		it("should handle repeated conversions without memory leaks", () => {
			const testNumber = 123456789;
			const iterations = 10000;

			const startTime = performance.now();

			for (let i = 0; i < iterations; i++) {
				const result = Terbilang.Convert(testNumber);
				expect(result).toBe(
					"seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan",
				);
			}

			const endTime = performance.now();
			const duration = endTime - startTime;

			console.log(
				`${iterations} repeated conversions completed in ${duration.toFixed(2)}ms`,
			);
			expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
		});

		it("should handle varied decimal precision efficiently", () => {
			const precisionTests = [
				{ num: 1.1, str: "1.1" },
				{ num: 1.12, str: "1.12" },
				{ num: 1.123, str: "1.123" },
				{ num: 1.1234, str: "1.1234" },
				{ num: 1.12345, str: "1.12345" },
				{ num: 1.123456, str: "1.123456" },
				{ num: 1.1234567, str: "1.1234567" },
				{ num: 1.12345678, str: "1.12345678" },
				{ num: 1.123456789, str: "1.123456789" },
				{ num: 1.123456789, str: "1.1234567890" },
			];

			const startTime = performance.now();

			precisionTests.forEach((test) => {
				const result = Terbilang.Convert(test.num, test.str);
				expect(result).toContain("satu koma");
			});

			const endTime = performance.now();
			console.log(
				`Precision tests completed in ${(endTime - startTime).toFixed(2)}ms`,
			);
		});
	});

	describe("Extreme Value Tests", () => {
		it("should handle maximum supported values", () => {
			const maxValues = [
				new Decimal("999999999999999999999999999999999999"), // Near max supported
				new Decimal("123456789012345678901234567890123456"),
				new Decimal("987654321098765432109876543210987654"),
			];

			maxValues.forEach((value) => {
				const result = Terbilang.Convert(value);
				expect(result).toBeTruthy();
				expect(typeof result).toBe("string");
				expect(result.length).toBeGreaterThan(50); // Should be a very long string
			});
		});

		it("should handle minimum supported values", () => {
			const minValues = [
				new Decimal("-999999999999999999999999999999999999"),
				new Decimal("-123456789012345678901234567890123456"),
				new Decimal("-1"),
				new Decimal("-0.000000001"),
			];

			minValues.forEach((value) => {
				const result = Terbilang.Convert(value);
				expect(result).toBeTruthy();
				expect(result).toMatch(/^minus/);
			});
		});

		it("should handle edge decimal cases", () => {
			const edgeCases = [
				{ value: new Decimal("0.1"), str: "0.1" },
				{ value: new Decimal("0.01"), str: "0.01" },
				{ value: new Decimal("0.001"), str: "0.001" },
				{ value: new Decimal("0.0001"), str: "0.0001" },
				{ value: new Decimal("0.00001"), str: "0.00001" },
				{ value: new Decimal("9.99999"), str: "9.99999" },
				{ value: new Decimal("99.9999"), str: "99.9999" },
				{ value: new Decimal("999.999"), str: "999.999" },
			];

			edgeCases.forEach((testCase) => {
				const result = Terbilang.Convert(testCase.value, testCase.str);
				expect(result).toBeTruthy();
				expect(result).toContain("koma");
			});
		});
	});

	describe("Error Handling Performance", () => {
		it("should handle invalid inputs efficiently", () => {
			const invalidInputs = [
				"not a number",
				null,
				undefined,
				{},
				[],
				true,
				false,
				Symbol("test"),
				() => {},
			];

			const startTime = performance.now();

			invalidInputs.forEach((input) => {
				expect(() => {
					Terbilang.Convert(input as any);
				}).toThrow(TypeError);
			});

			const endTime = performance.now();
			console.log(
				`Error handling tests completed in ${(endTime - startTime).toFixed(2)}ms`,
			);
		});

		it("should handle range errors for oversized numbers", () => {
			const oversizedNumbers = [
				new Decimal(`1${"0".repeat(50)}`), // 10^50
				new Decimal(`9${"9".repeat(50)}`), // Near 10^51
			];

			oversizedNumbers.forEach((num) => {
				expect(() => {
					Terbilang.Convert(num);
				}).toThrow(RangeError);
			});
		});
	});

	describe("Real-World Scenario Stress Tests", () => {
		it("should handle concurrent bank transaction processing", () => {
			const transactions = Array.from({ length: 1000 }, (_, i) => ({
				id: i + 1,
				amount: Math.floor(Math.random() * 10000000) + 1000, // 1K to 10M
				type: i % 2 === 0 ? "credit" : "debit",
			}));

			const startTime = performance.now();

			const results = transactions.map((transaction) => ({
				...transaction,
				amountText: Terbilang.Convert(transaction.amount),
			}));

			const endTime = performance.now();
			const duration = endTime - startTime;

			console.log(
				`Processed ${transactions.length} transactions in ${duration.toFixed(2)}ms`,
			);
			expect(results).toHaveLength(1000);
			expect(duration).toBeLessThan(3000); // Should complete within 3 seconds

			// Verify some results
			results.forEach((result) => {
				expect(result.amountText).toBeTruthy();
				expect(typeof result.amountText).toBe("string");
			});
		});

		it("should handle payroll processing for large company", () => {
			// Simulate payroll for 10,000 employees
			const employees = Array.from({ length: 10000 }, (_, i) => ({
				id: i + 1,
				basicSalary: Math.floor(Math.random() * 50000000) + 5000000, // 5M to 55M
				bonus: Math.floor(Math.random() * 10000000), // 0 to 10M
				deductions: Math.floor(Math.random() * 2000000), // 0 to 2M
			}));

			const startTime = performance.now();

			const payrollResults = employees.map((emp) => {
				const netPay = emp.basicSalary + emp.bonus - emp.deductions;
				return {
					...emp,
					netPay,
					netPayText: Terbilang.Convert(netPay),
				};
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			console.log(
				`Processed payroll for ${employees.length} employees in ${duration.toFixed(2)}ms`,
			);
			expect(payrollResults).toHaveLength(10000);
			expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
		});

		it("should handle financial report generation", () => {
			// Simulate generating text for annual financial report
			const reportData = {
				revenue: new Decimal("150000000000"), // 150B
				expenses: new Decimal("120000000000"), // 120B
				netIncome: new Decimal("30000000000"), // 30B
				assets: new Decimal("500000000000"), // 500B
				liabilities: new Decimal("300000000000"), // 300B
				equity: new Decimal("200000000000"), // 200B
				cashFlow: new Decimal("45000000000"), // 45B
				investments: new Decimal("75000000000"), // 75B
				debt: new Decimal("125000000000"), // 125B
				marketCap: new Decimal("800000000000"), // 800B
			};

			const startTime = performance.now();

			const reportText = Object.entries(reportData).reduce(
				(acc, [key, value]) => {
					acc[key] = Terbilang.Convert(value);
					return acc;
				},
				{} as Record<string, string>,
			);

			const endTime = performance.now();
			const duration = endTime - startTime;

			console.log(
				`Generated financial report text in ${duration.toFixed(2)}ms`,
			);
			expect(Object.keys(reportText)).toHaveLength(10);
			expect(reportText.revenue).toBe("seratus lima puluh miliar");
			expect(reportText.netIncome).toBe("tiga puluh miliar");
		});

		it("should handle tax calculation batch processing", () => {
			// Simulate tax calculations for various income brackets
			const taxableIncomes = Array.from(
				{ length: 5000 },
				() => Math.floor(Math.random() * 1000000000) + 1000000, // 1M to 1B
			);

			const startTime = performance.now();

			const taxResults = taxableIncomes.map((income) => {
				// Simplified progressive tax calculation
				let tax = 0;
				if (income > 500000000) tax += (income - 500000000) * 0.3;
				if (income > 250000000)
					tax += Math.min(income - 250000000, 250000000) * 0.25;
				if (income > 60000000)
					tax += Math.min(income - 60000000, 190000000) * 0.15;
				if (income > 60000000) tax += Math.min(income, 60000000) * 0.05;

				return {
					income,
					tax: Math.floor(tax),
					incomeText: Terbilang.Convert(income),
					taxText: Terbilang.Convert(Math.floor(tax)),
				};
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			console.log(
				`Processed ${taxableIncomes.length} tax calculations in ${duration.toFixed(2)}ms`,
			);
			expect(taxResults).toHaveLength(5000);
			expect(duration).toBeLessThan(15000); // Should complete within 15 seconds
		});
	});

	describe("Consistency Tests", () => {
		it("should produce consistent results for the same input", () => {
			const testNumbers = [
				123456789,
				new Decimal("987654321.123"),
				-456789123,
				new Decimal("999999999999"),
			];

			testNumbers.forEach((num) => {
				const results = Array.from({ length: 100 }, () => {
					if (num instanceof Decimal) {
						return Terbilang.Convert(num, num.toString());
					}
					return Terbilang.Convert(num);
				});

				// All results should be identical
				const firstResult = results[0];
				results.forEach((result) => {
					expect(result).toBe(firstResult);
				});
			});
		});

		it("should handle concurrent access safely", () => {
			const promises = Array.from({ length: 1000 }, (_, i) => {
				return new Promise<string>((resolve) => {
					setTimeout(() => {
						const result = Terbilang.Convert(i + 1);
						resolve(result);
					}, Math.random() * 10); // Random delay up to 10ms
				});
			});

			return Promise.all(promises).then((results) => {
				expect(results).toHaveLength(1000);
				expect(results[0]).toBe("satu");
				expect(results[999]).toBe("seribu");
			});
		});
	});
});
