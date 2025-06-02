import { defaultConfig } from "../config/default";
import type {
	CalculationInput,
	CalculationResult,
	Fraction,
	HeirCounts,
	HeirResult,
} from "../types";
import {
	addFractions,
	calculateAslMasalah,
	fractionsToSiham,
	isEligibleForRadd,
	multiplyFractionBase,
	reduceFraction,
	sumShares,
	validateCalculationInput,
} from "./utils";

/**
 * Main faraidh calculation function
 * Implements proper fiqh order: utang → wasiat → determine heirs → fard → check awl/radd → asabah → dhuwu
 */
export function calculateFaraidh(input: CalculationInput): CalculationResult {
	// Validate input
	const validationErrors = validateCalculationInput(input);
	if (validationErrors.length > 0) {
		throw new Error(`Validation error: ${validationErrors[0].message}`);
	}

	const {
		totalAssets,
		utang,
		wasiatFraction,
		heirs,
		madzhab = "syafii",
	} = input;

	// 1. Calculate net estate after debts and bequests
	const afterDebt = totalAssets - utang;
	const wasiat = multiplyFractionBase(afterDebt, wasiatFraction);
	const netEstate = afterDebt - wasiat;

	// 2. Apply hajb (blocking) rules to determine eligible heirs
	const eligibleHeirs = applyHajbRules(heirs, madzhab);
	const ibtalApplied = getBlockedHeirs(heirs, eligibleHeirs);

	// 3. Check for special cases
	const hasDescendant =
		heirs.anakLaki +
			heirs.anakPerempuan +
			heirs.cucuLakiDariAnakLaki +
			heirs.cucuPerempuanDariAnakLaki >
		0;
	const hasSpouse = heirs.suami === 1 || heirs.istri > 0;
	const isGharrawain = hasSpouse && heirs.ibu === 1 && heirs.ayah === 1 && !hasDescendant;

	// 4. Calculate fard shares (ashab al-furud)
	const fardCalculation = calculateFardShares(
		eligibleHeirs,
		netEstate,
		madzhab,
	);

	// 5. Determine if Awl or Radd is needed
	const totalFardFraction = fardCalculation.fractions.reduce(
		(sum, frac) => addFractions(sum, frac),
		{ num: 0n, den: 1n },
	);

	let awlApplied = false;
	let awlRatio: Fraction | undefined;
	let raddApplied = false;
	let finalFardResults = fardCalculation.results;
	let residualAmount = netEstate - sumShares(finalFardResults);

	// 6. Apply Awl if total fard > 1
	if (totalFardFraction.num > totalFardFraction.den) {
		awlApplied = true;
		awlRatio = { num: totalFardFraction.den, den: totalFardFraction.num };
		finalFardResults = applyAwl(
			fardCalculation.results,
			fardCalculation.fractions,
			netEstate,
		);
		residualAmount = 0n; // No residual after Awl
	}

	// 7. Calculate asabah shares (if no Awl and there's residual)
	let asabahResults: HeirResult[] = [];
	if (!awlApplied && residualAmount > 0n) {
		asabahResults = calculateAsabahShares(eligibleHeirs, residualAmount);
		residualAmount -= sumShares(asabahResults);
	}

	// 8. Apply Radd if there's still residual and no asabah
	let raddResults: HeirResult[] = [];
	if (!awlApplied && residualAmount > 0n && asabahResults.length === 0) {
		const raddEligible = finalFardResults.filter((hr) =>
			isEligibleForRadd(hr.type, madzhab),
		);

		// Special case: if only maternal siblings exist, they don't get radd
		// They get their fixed share and the rest goes to dhuwu al-arham or state
		const onlyMaternalSiblings =
			finalFardResults.length > 0 &&
			finalFardResults.every(
				(hr) =>
					hr.type === "saudaraLakiSeibu" || hr.type === "saudaraPerempuanSeibu",
			);

		if (raddEligible.length > 0 && !onlyMaternalSiblings) {
			raddApplied = true;
			raddResults = applyRadd(
				raddEligible,
				residualAmount,
				fardCalculation.fractions,
			);

			// Update original fard results with radd amounts
			finalFardResults = finalFardResults.map((hr) => {
				const raddResult = raddResults.find((rr) => rr.type === hr.type);
				if (raddResult) {
					const newTotalShare = hr.totalShare + raddResult.totalShare;
					return {
						...hr,
						totalShare: newTotalShare,
						individualShare:
							hr.count > 1 ? newTotalShare / BigInt(hr.count) : newTotalShare,
						portion: addFractions(hr.portion, raddResult.portion),
					};
				}
				return hr;
			});

			residualAmount = 0n;
		} else if (finalFardResults.length > 0 && !onlyMaternalSiblings) {
			// Check if there are radd-eligible heirs among fard results
			const raddEligibleFromFard = finalFardResults.filter((hr) =>
				isEligibleForRadd(hr.type, madzhab),
			);
			
			if (raddEligibleFromFard.length > 0) {
				// Apply radd only to eligible heirs (e.g., daughters but not spouse)
				raddApplied = true;
				raddResults = applyRadd(
					raddEligibleFromFard,
					residualAmount,
					fardCalculation.fractions,
				);

				finalFardResults = finalFardResults.map((hr) => {
					const raddResult = raddResults.find((rr) => rr.type === hr.type);
					if (raddResult) {
						const newTotalShare = hr.totalShare + raddResult.totalShare;
						return {
							...hr,
							totalShare: newTotalShare,
							individualShare:
								hr.count > 1 ? newTotalShare / BigInt(hr.count) : newTotalShare,
							portion: addFractions(hr.portion, raddResult.portion),
						};
					}
					return hr;
				});

				residualAmount = 0n;
			}
			// If no radd-eligible heirs among fard, residue goes to dhuwu or state
		}
	}

	// 9. Handle Dhawu al-Arham if still residual and no other heirs
	let dhuwuResults: HeirResult[] = [];
	if (residualAmount > 0n && asabahResults.length === 0 && !raddApplied) {
		dhuwuResults = calculateDhuwuShares(eligibleHeirs, residualAmount);
		residualAmount -= sumShares(dhuwuResults);
	}

	// 10. Calculate final summary
	const allResults = [...finalFardResults, ...asabahResults, ...dhuwuResults];
	const totalDistributed = utang + wasiat + sumShares(allResults);

	const aslMasalah = awlApplied
		? totalFardFraction.num
		: calculateAslMasalah(fardCalculation.fractions);

	return {
		utang,
		wasiat,
		netEstate,
		fardResults: finalFardResults,
		asabahResults,
		raddResults: raddApplied ? raddResults : undefined,
		dhuwuResults: dhuwuResults.length > 0 ? dhuwuResults : undefined,
		awlApplied,
		awlRatio,
		ibtalApplied,
		raddApplied,
		isGharrawain,
		totalDistributed,
		calculationSummary: {
			aslMasalah,
			totalSiham: awlApplied
				? totalFardFraction.num
				: fractionsToSiham(fardCalculation.fractions, aslMasalah).reduce(
						(a, b) => a + b,
						0n,
					),
			distributionMethod: awlApplied
				? "awl"
				: raddApplied
					? "radd"
					: dhuwuResults.length > 0
						? "dhuwu"
						: "normal",
		},
	};
}

/**
 * Apply hajb (blocking) rules to determine eligible heirs
 */
function applyHajbRules(heirs: HeirCounts, _madzhab: string): HeirCounts {
	const eligible = { ...heirs };
	const rules = defaultConfig.ibtalRules;

	// Apply blocking rules
	for (const [blocker, blocked] of Object.entries(rules)) {
		if (heirs[blocker as keyof HeirCounts] > 0) {
			for (const blockedHeir of blocked) {
				if (blockedHeir in eligible) {
					eligible[blockedHeir as keyof HeirCounts] = 0;
				}
			}
		}
	}

	return eligible;
}

/**
 * Get list of heirs that were blocked
 */
function getBlockedHeirs(original: HeirCounts, eligible: HeirCounts): string[] {
	const blocked: string[] = [];

	for (const [heirType, count] of Object.entries(original)) {
		if (count > 0 && eligible[heirType as keyof HeirCounts] === 0) {
			blocked.push(heirType);
		}
	}

	return blocked;
}

/**
 * Calculate fard (fixed) shares for ashab al-furud
 * Special handling for Gharrawain/Umariyatain cases
 */
function calculateFardShares(
	heirs: HeirCounts,
	netEstate: bigint,
	madzhab: string,
): { results: HeirResult[]; fractions: Fraction[] } {
	const results: HeirResult[] = [];
	const fractions: Fraction[] = [];

	// Helper function to add fard result
	function addFardResult(type: string, count: number, fraction: Fraction) {
		if (count > 0) {
			const totalShare = multiplyFractionBase(netEstate, fraction);
			const individualShare =
				count > 1 ? totalShare / BigInt(count) : totalShare;

			results.push({
				type,
				count,
				totalShare,
				individualShare,
				portion: fraction,
				category: "fard",
			});
			fractions.push(fraction);
		}
	}

	// Check for Gharrawain/Umariyatain case
	// Conditions: (spouse + mother + father) and no children
	const hasDescendant =
		heirs.anakLaki +
			heirs.anakPerempuan +
			heirs.cucuLakiDariAnakLaki +
			heirs.cucuPerempuanDariAnakLaki >
		0;
	const hasSpouse = heirs.suami === 1 || heirs.istri > 0;
	const isGharrawainCase = hasSpouse && heirs.ibu === 1 && heirs.ayah === 1 && !hasDescendant;

	// SPOUSE (suami/istri) - calculated first in Gharrawain case
	if (heirs.istri > 0) {
		const hasChild = hasDescendant;
		const fraction = hasChild
			? reduceFraction({ num: 1n, den: 8n })
			: reduceFraction({ num: 1n, den: 4n });
		addFardResult("istri", heirs.istri, fraction);
	}

	if (heirs.suami === 1) {
		const hasChild = hasDescendant;
		const fraction = hasChild
			? reduceFraction({ num: 1n, den: 4n })
			: reduceFraction({ num: 1n, den: 2n });
		addFardResult("suami", 1, fraction);
	}

	// GHARRAWAIN/UMARIYATAIN SPECIAL CASE
	if (isGharrawainCase) {
		// Get spouse's share first
		const spouseResult = results[0]; // spouse is added first above
		const remainderAfterSpouse = netEstate - spouseResult.totalShare;
		
		// Mother gets 1/3 of remainder (not 1/3 of total)
		const motherShare = remainderAfterSpouse / 3n;
		const motherFraction = reduceFraction({ 
			num: motherShare, 
			den: netEstate 
		});
		
		results.push({
			type: "ibu",
			count: 1,
			totalShare: motherShare,
			individualShare: motherShare,
			portion: motherFraction,
			category: "fard",
		});
		fractions.push(motherFraction);

		// Father gets remainder as asabah (will be handled in asabah section)
		// Don't add father to fard results in Gharrawain case
	} else {
		// MOTHER (ibu) - standard calculation
		if (heirs.ibu === 1) {
			const hasSibling =
				heirs.saudaraLakiKandung +
					heirs.saudaraPerempuanKandung +
					heirs.saudaraLakiSeayah +
					heirs.saudaraPerempuanSeayah +
					heirs.saudaraLakiSeibu +
					heirs.saudaraPerempuanSeibu >
				0;

			let fraction: Fraction;
			if (madzhab === "syafii") {
				fraction =
					hasDescendant || hasSibling
						? reduceFraction({ num: 1n, den: 6n })
						: reduceFraction({ num: 1n, den: 3n });
			} else {
				// Other madhabs may have different rules
				fraction = reduceFraction({ num: 1n, den: 6n });
			}
			addFardResult("ibu", 1, fraction);
		}

		// FATHER (ayah) - only gets fard if there are children (not in Gharrawain)
		if (heirs.ayah === 1) {
			const hasChild = hasDescendant;

			if (hasChild) {
				const fraction = reduceFraction({ num: 1n, den: 6n });
				addFardResult("ayah", 1, fraction);
			}
			// If no children, father becomes asabah (gets residual)
		}
	}

	// DAUGHTERS (anak perempuan) - only if no sons
	if (heirs.anakPerempuan > 0 && heirs.anakLaki === 0) {
		const fraction =
			heirs.anakPerempuan === 1
				? reduceFraction({ num: 1n, den: 2n })
				: reduceFraction({ num: 2n, den: 3n });
		addFardResult("anakPerempuan", heirs.anakPerempuan, fraction);
	}

	// GRANDDAUGHTERS (cucu perempuan dari anak laki) - if no children and no grandsons
	if (
		heirs.cucuPerempuanDariAnakLaki > 0 &&
		heirs.anakLaki === 0 &&
		heirs.anakPerempuan === 0 &&
		heirs.cucuLakiDariAnakLaki === 0
	) {
		const fraction =
			heirs.cucuPerempuanDariAnakLaki === 1
				? reduceFraction({ num: 1n, den: 2n })
				: reduceFraction({ num: 2n, den: 3n });
		addFardResult(
			"cucuPerempuanDariAnakLaki",
			heirs.cucuPerempuanDariAnakLaki,
			fraction,
		);
	}

	// GRANDPARENTS
	if (heirs.kakekAyah === 1 && heirs.ayah === 0) {
		// Grandfather gets 1/6 if there are children, otherwise becomes asabah
		const hasChild = hasDescendant;

		if (hasChild) {
			const fraction = reduceFraction({ num: 1n, den: 6n });
			addFardResult("kakekAyah", 1, fraction);
		}
	}

	if (heirs.nenekAyah === 1 && heirs.ibu === 0) {
		const fraction = reduceFraction({ num: 1n, den: 6n });
		addFardResult("nenekAyah", 1, fraction);
	}

	if (heirs.nenekIbu === 1 && heirs.ibu === 0) {
		const fraction = reduceFraction({ num: 1n, den: 6n });
		addFardResult("nenekIbu", 1, fraction);
	}

	// FULL SISTERS (saudara perempuan kandung) - if no children, parents, or brothers
	if (
		heirs.saudaraPerempuanKandung > 0 &&
		heirs.anakLaki === 0 &&
		heirs.anakPerempuan === 0 &&
		heirs.ayah === 0 &&
		heirs.saudaraLakiKandung === 0
	) {
		const fraction =
			heirs.saudaraPerempuanKandung === 1
				? reduceFraction({ num: 1n, den: 2n })
				: reduceFraction({ num: 2n, den: 3n });
		addFardResult(
			"saudaraPerempuanKandung",
			heirs.saudaraPerempuanKandung,
			fraction,
		);
	}

	// PATERNAL HALF SISTERS (saudara perempuan seayah)
	if (
		heirs.saudaraPerempuanSeayah > 0 &&
		heirs.anakLaki === 0 &&
		heirs.anakPerempuan === 0 &&
		heirs.ayah === 0 &&
		heirs.saudaraLakiKandung === 0 &&
		heirs.saudaraPerempuanKandung === 0 &&
		heirs.saudaraLakiSeayah === 0
	) {
		const fraction =
			heirs.saudaraPerempuanSeayah === 1
				? reduceFraction({ num: 1n, den: 2n })
				: reduceFraction({ num: 2n, den: 3n });
		addFardResult(
			"saudaraPerempuanSeayah",
			heirs.saudaraPerempuanSeayah,
			fraction,
		);
	}

	// MATERNAL SIBLINGS (saudara seibu) - fixed 1/6 for one, 1/3 for multiple
	const totalMaternalSiblings =
		heirs.saudaraLakiSeibu + heirs.saudaraPerempuanSeibu;
	if (totalMaternalSiblings > 0) {
		const fraction =
			totalMaternalSiblings === 1
				? reduceFraction({ num: 1n, den: 6n })
				: reduceFraction({ num: 1n, den: 3n });

		if (heirs.saudaraLakiSeibu > 0) {
			// In maternal siblings, male and female get equal shares
			const perPerson =
				multiplyFractionBase(netEstate, fraction) /
				BigInt(totalMaternalSiblings);
			const totalForMales = perPerson * BigInt(heirs.saudaraLakiSeibu);

			results.push({
				type: "saudaraLakiSeibu",
				count: heirs.saudaraLakiSeibu,
				totalShare: totalForMales,
				individualShare: perPerson,
				portion: reduceFraction({
					num: fraction.num * BigInt(heirs.saudaraLakiSeibu),
					den: fraction.den * BigInt(totalMaternalSiblings),
				}),
				category: "fard",
			});
		}

		if (heirs.saudaraPerempuanSeibu > 0) {
			const perPerson =
				multiplyFractionBase(netEstate, fraction) /
				BigInt(totalMaternalSiblings);
			const totalForFemales = perPerson * BigInt(heirs.saudaraPerempuanSeibu);

			results.push({
				type: "saudaraPerempuanSeibu",
				count: heirs.saudaraPerempuanSeibu,
				totalShare: totalForFemales,
				individualShare: perPerson,
				portion: reduceFraction({
					num: fraction.num * BigInt(heirs.saudaraPerempuanSeibu),
					den: fraction.den * BigInt(totalMaternalSiblings),
				}),
				category: "fard",
			});
		}

		fractions.push(fraction);
	}

	return { results, fractions };
}

/**
 * Apply Awl (proportional reduction) when total fard shares exceed 1
 */
function applyAwl(
	fardResults: HeirResult[],
	fractions: Fraction[],
	netEstate: bigint,
): HeirResult[] {
	const aslMasalah = calculateAslMasalah(fractions);
	const sihamArray = fractionsToSiham(fractions, aslMasalah);
	const totalSiham = sihamArray.reduce((a, b) => a + b, 0n);

	// Track total distributed to ensure exact match
	let totalDistributed = 0n;
	const results = fardResults.map((result, index) => {
		const originalSiham = sihamArray[index];
		const newFraction = reduceFraction({ num: originalSiham, den: totalSiham });
		let newTotalShare = multiplyFractionBase(netEstate, newFraction);

		// Adjust for the last heir to ensure exact total
		if (index === fardResults.length - 1) {
			newTotalShare = netEstate - totalDistributed;
		} else {
			totalDistributed += newTotalShare;
		}

		const newIndividualShare =
			result.count > 1 ? newTotalShare / BigInt(result.count) : newTotalShare;

		return {
			...result,
			totalShare: newTotalShare,
			individualShare: newIndividualShare,
			portion: newFraction,
		};
	});

	return results;
}

/**
 * Calculate asabah (residual) shares with 2:1 male:female ratio where applicable
 */
function calculateAsabahShares(
	heirs: HeirCounts,
	residualAmount: bigint,
): HeirResult[] {
	const results: HeirResult[] = [];

	// Determine asabah heirs and their portions
	let totalAsabahShares = 0n;
	const asabahHeirs: Array<{
		type: string;
		count: number;
		shareRatio: bigint;
	}> = [];

	// FATHER becomes asabah if no children OR in Gharrawain case
	const hasChildren =
		heirs.anakLaki +
			heirs.anakPerempuan +
			heirs.cucuLakiDariAnakLaki +
			heirs.cucuPerempuanDariAnakLaki >
		0;

	// Check for Gharrawain case
	const hasSpouse = heirs.suami === 1 || heirs.istri > 0;
	const isGharrawainCase = hasSpouse && heirs.ibu === 1 && heirs.ayah === 1 && !hasChildren;

	if (heirs.ayah === 1 && (!hasChildren || isGharrawainCase)) {
		asabahHeirs.push({ type: "ayah", count: 1, shareRatio: 1n });
		totalAsabahShares += 1n;
	}

	// SONS always asabah (each gets 2 shares in 2:1 ratio)
	if (heirs.anakLaki > 0) {
		const ratio = BigInt(heirs.anakLaki * 2); // Each son gets 2 shares
		asabahHeirs.push({
			type: "anakLaki",
			count: heirs.anakLaki,
			shareRatio: ratio,
		});
		totalAsabahShares += ratio;
	}

	// DAUGHTERS become asabah with sons (2:1 ratio, each daughter gets 1 share)
	if (heirs.anakPerempuan > 0 && heirs.anakLaki > 0) {
		const ratio = BigInt(heirs.anakPerempuan); // Each daughter gets 1 share vs 2 for son
		asabahHeirs.push({
			type: "anakPerempuan",
			count: heirs.anakPerempuan,
			shareRatio: ratio,
		});
		totalAsabahShares += ratio;
	}

	// GRANDSONS from sons
	if (heirs.cucuLakiDariAnakLaki > 0 && heirs.anakLaki === 0) {
		const ratio = BigInt(heirs.cucuLakiDariAnakLaki * 2);
		asabahHeirs.push({
			type: "cucuLakiDariAnakLaki",
			count: heirs.cucuLakiDariAnakLaki,
			shareRatio: ratio,
		});
		totalAsabahShares += ratio;
	}

	// GRANDFATHER becomes asabah if no father and no children
	if (heirs.kakekAyah === 1 && heirs.ayah === 0 && !hasChildren) {
		asabahHeirs.push({ type: "kakekAyah", count: 1, shareRatio: 1n });
		totalAsabahShares += 1n;
	}

	// FULL BROTHERS
	if (
		heirs.saudaraLakiKandung > 0 &&
		heirs.ayah === 0 &&
		heirs.kakekAyah === 0 &&
		!hasChildren
	) {
		const ratio = BigInt(heirs.saudaraLakiKandung * 2);
		asabahHeirs.push({
			type: "saudaraLakiKandung",
			count: heirs.saudaraLakiKandung,
			shareRatio: ratio,
		});
		totalAsabahShares += ratio;
	}

	// FULL SISTERS become asabah with full brothers
	if (heirs.saudaraPerempuanKandung > 0 && heirs.saudaraLakiKandung > 0) {
		const ratio = BigInt(heirs.saudaraPerempuanKandung);
		asabahHeirs.push({
			type: "saudaraPerempuanKandung",
			count: heirs.saudaraPerempuanKandung,
			shareRatio: ratio,
		});
		totalAsabahShares += ratio;
	}

	// Calculate actual shares with exact distribution
	if (totalAsabahShares > 0n) {
		let totalDistributed = 0n;

		asabahHeirs.forEach((heir, index) => {
			let totalShare: bigint;

			// For the last heir, give exact remainder to avoid rounding errors
			if (index === asabahHeirs.length - 1) {
				totalShare = residualAmount - totalDistributed;
			} else {
				totalShare = (residualAmount * heir.shareRatio) / totalAsabahShares;
				totalDistributed += totalShare;
			}

			const individualShare =
				heir.count > 1 ? totalShare / BigInt(heir.count) : totalShare;

			results.push({
				type: heir.type,
				count: heir.count,
				totalShare,
				individualShare,
				portion: reduceFraction({
					num: heir.shareRatio,
					den: totalAsabahShares,
				}),
				category: "asabah",
			});
		});
	}

	return results;
}

/**
 * Apply Radd (return residue to eligible fard heirs)
 */
function applyRadd(
	eligibleHeirs: HeirResult[],
	residualAmount: bigint,
	_originalFractions: Fraction[],
): HeirResult[] {
	const totalEligibleSiham = eligibleHeirs.reduce((sum, heir) => {
		return sum + heir.portion.num;
	}, 0n);

	let totalDistributed = 0n;
	
	return eligibleHeirs.map((heir, index) => {
		let raddShare: bigint;
		
		if (index === eligibleHeirs.length - 1) {
			raddShare = residualAmount - totalDistributed;
		} else {
			raddShare = (residualAmount * heir.portion.num) / totalEligibleSiham;
			totalDistributed += raddShare;
		}
		
		const individualRaddShare =
			heir.count > 1 ? raddShare / BigInt(heir.count) : raddShare;

		return {
			type: heir.type,
			count: heir.count,
			totalShare: raddShare,
			individualShare: individualRaddShare,
			portion: reduceFraction({
				num: heir.portion.num,
				den: totalEligibleSiham,
			}),
			category: "radd" as const,
		};
	});
}

/**
 * Calculate shares for Dhawu al-Arham (distant relatives)
 */
function calculateDhuwuShares(
	_heirs: HeirCounts,
	_residualAmount: bigint,
): HeirResult[] {
	const results: HeirResult[] = [];

	// For now, implement basic dhuwu distribution
	// This would need more complex logic for actual dhuwu al-arham rules

	return results;
}
