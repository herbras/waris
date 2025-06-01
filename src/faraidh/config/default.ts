import type { FaraidhConfig } from "../types";

export const defaultConfig: FaraidhConfig = {
	locale: "id-ID",
	madzhab: "syafii",
	currency: "IDR",
	raddForSpouse: false, // In Syafii madzhab, spouse usually doesn't get radd
	ibtalRules: {
		// Hajb (blocking) rules for Syafii madzhab
		anakLaki: ["cucuLakiDariAnakLaki", "cucuPerempuanDariAnakLaki"], // Children block grandchildren
		anakPerempuan: ["cucuLakiDariAnakLaki", "cucuPerempuanDariAnakLaki"],
		ayah: [
			"kakekAyah",
			"saudaraLakiKandung",
			"saudaraPerempuanKandung",
			"saudaraLakiSeayah",
			"saudaraPerempuanSeayah",
			"pamanKandung",
			"pamanSeayah",
		], // Father blocks grandfather and siblings
		kakekAyah: [
			"saudaraLakiKandung",
			"saudaraPerempuanKandung",
			"saudaraLakiSeayah",
			"saudaraPerempuanSeayah",
		],
		saudaraLakiKandung: [
			"saudaraLakiSeayah",
			"saudaraPerempuanSeayah",
			"keponakanLakiDariSaudaraLakiKandung",
		],
		saudaraPerempuanKandung: ["saudaraLakiSeayah", "saudaraPerempuanSeayah"],
	},
};
