import Decimal from "decimal.js";

export class Terbilang {
	private static words: string[] = [
		"",
		"satu",
		"dua",
		"tiga",
		"empat",
		"lima",
		"enam",
		"tujuh",
		"delapan",
		"sembilan",
		"sepuluh",
		"sebelas",
	];

	/**
	 * Convert BigInt to Indonesian words
	 * @param input BigInt to convert
	 * @returns Indonesian word representation
	 */
	static ConvertBigInt(input: bigint): string {
		if (input < 0n) {
			return `minus ${Terbilang.ConvertBigInt(-input)}`;
		}

		// Convert BigInt to Decimal for existing logic
		const decimal = new Decimal(input.toString());
		return Terbilang.Convert(decimal);
	}

	static Convert(input: Decimal | number, originalStr?: string): string {
		// Use duck typing instead of instanceof to work with bundled versions
		const isDecimalInstance = 
			typeof input === "object" && 
			input !== null &&
			typeof input.isZero === "function" &&
			typeof input.isNegative === "function";
			
		if (typeof input !== "number" && !isDecimalInstance) {
			throw new TypeError("Input must be a number or Decimal instance");
		}

		const value: Decimal =
			typeof input === "number" ? new Decimal(input) : input as Decimal;
		if (value.isZero()) return "nol";

		const isNegative = value.isNegative();
		const absValue = value.abs();
		const integerPart: Decimal = absValue.floor();
		const fractionalPart: Decimal = absValue.minus(integerPart);

		let result: string;
		if (integerPart.isZero()) {
			result = "nol";
		} else {
			result = Terbilang._convertInteger(integerPart);
		}

		if (!fractionalPart.isZero()) {
			// If originalStr provided (for preserving trailing zeros), use it
			let fracString = "";
			if (originalStr) {
				const parts = originalStr.split(".");
				fracString = parts.length > 1 ? parts[1] : "";
			} else {
				const parts = fractionalPart.toString().split(".");
				fracString = parts.length > 1 ? parts[1] : "";
			}

			const fracWords = Array.from(fracString).map((d) => {
				const idx = Number.parseInt(d, 10);
				return Terbilang.words[idx] || "nol";
			});
			result += ` koma ${fracWords.join(" ")}`;
		}

		if (isNegative) {
			result = `minus ${result}`;
		}
		return result.trim().replace(/\s+/g, " ");
	}

	private static _convertInteger(value: Decimal): string {
		if (value.isZero()) {
			return "";
		}
		if (value.lessThan(new Decimal(12))) {
			return Terbilang.words[value.toNumber()];
		}
		if (value.lessThan(new Decimal(20))) {
			const digit = value.minus(new Decimal(10)).toNumber();
			return `${Terbilang.words[digit]} belas`;
		}
		if (value.lessThan(new Decimal(100))) {
			const puluh = value.dividedToIntegerBy(new Decimal(10));
			const sisa = value.mod(new Decimal(10));
			const puluhanWord = Terbilang.words[puluh.toNumber()];
			if (sisa.isZero()) {
				return `${puluhanWord} puluh`;
			}
			return `${puluhanWord} puluh ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal(200))) {
			const sisa = value.minus(new Decimal(100));
			if (sisa.isZero()) return "seratus";
			return `seratus ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal(1000))) {
			const ratus = value.dividedToIntegerBy(new Decimal(100));
			const sisa = value.mod(new Decimal(100));
			const prefix = ratus.equals(new Decimal(1))
				? "seratus"
				: `${Terbilang.words[ratus.toNumber()]} ratus`;
			if (sisa.isZero()) return prefix;
			return `${prefix} ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal(2000))) {
			const sisa = value.minus(new Decimal(1000));
			if (sisa.isZero()) return "seribu";
			return `seribu ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000"))) {
			const ribu = value.dividedToIntegerBy(new Decimal("1000"));
			const sisa = value.mod(new Decimal("1000"));
			const prefix = Terbilang._convertInteger(ribu);
			if (sisa.isZero()) return `${prefix} ribu`;
			return `${prefix} ribu ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000"))) {
			const juta = value.dividedToIntegerBy(new Decimal("1000000"));
			const sisa = value.mod(new Decimal("1000000"));
			const prefix = Terbilang._convertInteger(juta);
			if (sisa.isZero()) return `${prefix} juta`;
			return `${prefix} juta ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000"))) {
			const miliar = value.dividedToIntegerBy(new Decimal("1000000000"));
			const sisa = value.mod(new Decimal("1000000000"));
			const prefix = Terbilang._convertInteger(miliar);
			if (sisa.isZero()) return `${prefix} miliar`;
			return `${prefix} miliar ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000"))) {
			const triliunBase = new Decimal("1000000000000");
			const numTriliun = value.dividedToIntegerBy(triliunBase);
			const sisa = value.mod(triliunBase);
			const prefix = Terbilang._convertInteger(numTriliun);
			if (sisa.isZero()) return `${prefix} triliun`;
			return `${prefix} triliun ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000000"))) {
			const kuadriliun = value.dividedToIntegerBy(
				new Decimal("1000000000000000"),
			);
			const sisa = value.mod(new Decimal("1000000000000000"));
			const prefix = Terbilang._convertInteger(kuadriliun);
			if (sisa.isZero()) return `${prefix} kuadriliun`;
			return `${prefix} kuadriliun ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000000000"))) {
			const kuantiliun = value.dividedToIntegerBy(
				new Decimal("1000000000000000000"),
			);
			const sisa = value.mod(new Decimal("1000000000000000000"));
			const prefix = Terbilang._convertInteger(kuantiliun);
			if (sisa.isZero()) return `${prefix} kuantiliun`;
			return `${prefix} kuantiliun ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000000000000"))) {
			const sekstiliun = value.dividedToIntegerBy(
				new Decimal("1000000000000000000000"),
			);
			const sisa = value.mod(new Decimal("1000000000000000000000"));
			const prefix = Terbilang._convertInteger(sekstiliun);
			if (sisa.isZero()) return `${prefix} sekstiliun`;
			return `${prefix} sekstiliun ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000000000000000"))) {
			const septiliun = value.dividedToIntegerBy(
				new Decimal("1000000000000000000000000"),
			);
			const sisa = value.mod(new Decimal("1000000000000000000000000"));
			const prefix = Terbilang._convertInteger(septiliun);
			if (sisa.isZero()) return `${prefix} septiliun`;
			return `${prefix} septiliun ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000000000000000000"))) {
			const oktiliun = value.dividedToIntegerBy(
				new Decimal("1000000000000000000000000000"),
			);
			const sisa = value.mod(new Decimal("1000000000000000000000000000"));
			const prefix = Terbilang._convertInteger(oktiliun);
			if (sisa.isZero()) return `${prefix} oktiliun`;
			return `${prefix} oktiliun ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000000000000000000000"))) {
			const noniliun = value.dividedToIntegerBy(
				new Decimal("1000000000000000000000000000000"),
			);
			const sisa = value.mod(new Decimal("1000000000000000000000000000000"));
			const prefix = Terbilang._convertInteger(noniliun);
			if (sisa.isZero()) return `${prefix} noniliun`;
			return `${prefix} noniliun ${Terbilang._convertInteger(sisa)}`;
		}
		if (value.lessThan(new Decimal("1000000000000000000000000000000000000"))) {
			const desiliun = value.dividedToIntegerBy(
				new Decimal("1000000000000000000000000000000000"),
			);
			const sisa = value.mod(new Decimal("1000000000000000000000000000000000"));
			const prefix = Terbilang._convertInteger(desiliun);
			if (sisa.isZero()) return `${prefix} desiliun`;
			return `${prefix} desiliun ${Terbilang._convertInteger(sisa)}`;
		}

		// Di atas 10^36 belum didukung
		throw new RangeError("Number is too large to convert");
	}
}
