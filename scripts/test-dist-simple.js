import { existsSync } from 'fs';

const DIST_DIR = './dist';

async function testDistSimple() {
	console.log('🧪 Simple test of distribution files...\n');
	
	// Check if dist exists
	if (!existsSync(DIST_DIR)) {
		console.error('❌ Dist directory not found. Run "bun run build" first.');
		process.exit(1);
	}
	
	try {
		// Test ES Module import
		console.log('🔬 Testing ES Module import...');
		const { calculateFaraidh, Terbilang, terbilangRupiah, formatCurrency, VERSION } = await import('../dist/waris.es.mjs');
		
		console.log('  ✅ ES Module import successful');
		console.log(`  📦 Library version: ${VERSION}`);
		
		// Test Terbilang basic functionality
		console.log('  🔢 Testing Terbilang...');
		const result1 = Terbilang.Convert(123456);
		console.log(`    Input: 123456 → Output: "${result1}"`);
		if (result1 !== 'seratus dua puluh tiga ribu empat ratus lima puluh enam') {
			throw new Error('Terbilang test failed');
		}
		console.log('  ✅ Terbilang working correctly');
		
		// Test terbilangRupiah  
		console.log('  💰 Testing terbilangRupiah...');
		const result2 = terbilangRupiah(5000000n);
		console.log(`    Input: 5000000n → Output: "${result2}"`);
		if (!result2.toLowerCase().includes('lima juta')) {
			throw new Error('terbilangRupiah test failed');
		}
		console.log('  ✅ terbilangRupiah working correctly');
		
		// Test calculateFaraidh
		console.log('  ⚖️ Testing calculateFaraidh...');
		const input = {
			totalAssets: 100000000n,
			utang: 0n,
			wasiatFraction: { num: 0n, den: 1n },
			heirs: { 
				suami: 0, istri: 1, ayah: 0, ibu: 0, kakekAyah: 0, nenekAyah: 0, nenekIbu: 0,
				anakLaki: 0, anakPerempuan: 0, cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
				saudaraLakiKandung: 0, saudaraPerempuanKandung: 0, saudaraLakiSeayah: 0, saudaraPerempuanSeayah: 0,
				saudaraLakiSeibu: 0, saudaraPerempuanSeibu: 0, keponakanLakiDariSaudaraLakiKandung: 0,
				pamanKandung: 0, pamanSeayah: 0
			}
		};
		
		const faraidhResult = calculateFaraidh(input);
		console.log(`    Input: Wife only with 100M assets`);
		console.log(`    Output: Total distributed = ${faraidhResult.totalDistributed}n`);
		
		if (faraidhResult.totalDistributed !== 100000000n) {
			throw new Error('calculateFaraidh test failed');
		}
		console.log('  ✅ calculateFaraidh working correctly');
		
		// Summary
		console.log('\n🎉 All core functionality working!');
		console.log('✅ ES Module exports are functional');
		console.log('✅ Terbilang converts numbers to Indonesian words'); 
		console.log('✅ terbilangRupiah handles BigInt currency amounts');
		console.log('✅ calculateFaraidh performs Islamic inheritance calculations');
		console.log('✅ Distribution build is ready for production!');
		
	} catch (error) {
		console.error('💥 Distribution test failed:', error.message);
		process.exit(1);
	}
}

// Run the test
testDistSimple().catch((error) => {
	console.error('💥 Test execution failed:', error);
	process.exit(1);
}); 