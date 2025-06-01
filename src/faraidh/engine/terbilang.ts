import { Terbilang } from "@/utils/Terbilang";

/**
 * Convert BigInt to Indonesian words using existing Terbilang class
 * @param amount BigInt amount (in Rupiah)
 * @returns Indonesian text representation
 */
export function terbilangBigInt(amount: bigint): string {
	return Terbilang.ConvertBigInt(amount);
}

/**
 * Convert currency amount to Indonesian words with "rupiah"
 * @param amount BigInt amount in Rupiah
 * @returns Formatted text like "lima juta rupiah"
 */
export function terbilangRupiah(amount: bigint): string {
	if (amount === 0n) {
		return "nol rupiah";
	}

	const baseText = terbilangBigInt(amount);
	return `${baseText} rupiah`;
}

/**
 * Convert inheritance fraction to readable text
 * @param num Numerator
 * @param den Denominator
 * @returns Text like "satu per dua" for 1/2
 */
export function terbilangFraction(num: bigint, den: bigint): string {
	if (den === 0n) {
		throw new Error("Denominator cannot be zero");
	}

	if (num === 0n) {
		return "nol";
	}

	if (den === 1n) {
		return terbilangBigInt(num);
	}

	const numText = terbilangBigInt(num);
	const denText = terbilangBigInt(den);

	return `${numText} per ${denText}`;
}

/**
 * Convert inheritance share description to Indonesian
 * @param heirType Type of heir (e.g., 'istri', 'anakLaki')
 * @param count Number of heirs in this category
 * @returns Descriptive text like "satu orang istri" or "dua orang anak laki-laki"
 */
export function terbilangHeirDescription(
	heirType: string,
	count: number,
): string {
	const countText = terbilangBigInt(BigInt(count));

	const heirDescriptions: Record<string, { singular: string; plural: string }> =
		{
			suami: { singular: "suami", plural: "suami" },
			istri: { singular: "istri", plural: "istri" },
			ayah: { singular: "ayah", plural: "ayah" },
			ibu: { singular: "ibu", plural: "ibu" },
			kakekAyah: {
				singular: "kakek dari pihak ayah",
				plural: "kakek dari pihak ayah",
			},
			nenekAyah: {
				singular: "nenek dari pihak ayah",
				plural: "nenek dari pihak ayah",
			},
			nenekIbu: {
				singular: "nenek dari pihak ibu",
				plural: "nenek dari pihak ibu",
			},
			anakLaki: { singular: "anak laki-laki", plural: "anak laki-laki" },
			anakPerempuan: { singular: "anak perempuan", plural: "anak perempuan" },
			cucuLakiDariAnakLaki: {
				singular: "cucu laki-laki dari anak laki-laki",
				plural: "cucu laki-laki dari anak laki-laki",
			},
			cucuPerempuanDariAnakLaki: {
				singular: "cucu perempuan dari anak laki-laki",
				plural: "cucu perempuan dari anak laki-laki",
			},
			saudaraLakiKandung: {
				singular: "saudara laki-laki kandung",
				plural: "saudara laki-laki kandung",
			},
			saudaraPerempuanKandung: {
				singular: "saudara perempuan kandung",
				plural: "saudara perempuan kandung",
			},
			saudaraLakiSeayah: {
				singular: "saudara laki-laki seayah",
				plural: "saudara laki-laki seayah",
			},
			saudaraPerempuanSeayah: {
				singular: "saudara perempuan seayah",
				plural: "saudara perempuan seayah",
			},
			saudaraLakiSeibu: {
				singular: "saudara laki-laki seibu",
				plural: "saudara laki-laki seibu",
			},
			saudaraPerempuanSeibu: {
				singular: "saudara perempuan seibu",
				plural: "saudara perempuan seibu",
			},
			keponakanLakiDariSaudaraLakiKandung: {
				singular: "keponakan laki-laki dari saudara laki-laki kandung",
				plural: "keponakan laki-laki dari saudara laki-laki kandung",
			},
			pamanKandung: { singular: "paman kandung", plural: "paman kandung" },
			pamanSeayah: { singular: "paman seayah", plural: "paman seayah" },
		};

	const description = heirDescriptions[heirType];
	if (!description) {
		return `${countText} orang ${heirType}`;
	}

	const heirText = count === 1 ? description.singular : description.plural;

	if (count === 1) {
		return `satu orang ${heirText}`;
	}
	return `${countText} orang ${heirText}`;
}
