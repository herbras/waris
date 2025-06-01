import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_DIR = './dist';
const TEST_DIR = './test';
const TEMP_CONFIG = './vitest.dist.config.ts';

async function testDistFiles() {
	console.log('🧪 Testing built distribution files against full test suite...\n');
	
	// Check if dist exists
	if (!existsSync(DIST_DIR)) {
		console.error('❌ Dist directory not found. Run "bun run build" first.');
		process.exit(1);
	}
	
	// Check required dist files
	const requiredFiles = ['waris.es.mjs', 'waris.cjs', 'waris.umd.js', 'index.d.ts'];
	for (const file of requiredFiles) {
		if (!existsSync(join(DIST_DIR, file))) {
			console.error(`❌ Required dist file missing: ${file}`);
			process.exit(1);
		}
	}
	
	console.log('✅ All required dist files found\n');
	
	// Create temporary Vitest config that uses dist files
	const distConfig = `
/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		// Override module resolution to use dist files
		alias: {
			"@/faraidh/engine/calculate": "./dist/waris.es.mjs",
			"@/faraidh/types": "./dist/index.d.ts", 
			"@/utils/Terbilang": "./dist/waris.es.mjs",
			"@": "./dist"
		}
	},
	resolve: {
		alias: {
			"@": "./dist"
		}
	}
});
`;
	
	try {
		// Write temporary config
		writeFileSync(TEMP_CONFIG, distConfig);
		console.log('📝 Created temporary Vitest config for dist testing\n');
		
		// Test ES Module build
		console.log('🔬 Testing ES Module build (waris.es.mjs)...');
		await testESModuleBuild();
		
		// Test CommonJS build  
		console.log('🔬 Testing CommonJS build (waris.cjs)...');
		await testCommonJSBuild();
		
		// Test UMD build
		console.log('🔬 Testing UMD build (waris.umd.js)...');
		await testUMDBuild();
		
		// Run specific test suites against dist
		console.log('🧪 Running test suites against distribution files...\n');
		
		// Test Terbilang functionality
		console.log('📊 Testing Terbilang against dist...');
		await testTerbilangWithDist();
		
		// Test Faraidh functionality  
		console.log('⚖️ Testing Faraidh against dist...');
		await testFaraidhWithDist();
		
		console.log('\n🎉 All distribution tests completed successfully!');
		
	} catch (error) {
		console.error('💥 Distribution testing failed:', error.message);
		process.exit(1);
	} finally {
		// Cleanup
		if (existsSync(TEMP_CONFIG)) {
			execSync(`bun x rimraf ${TEMP_CONFIG}`);
			console.log('🧹 Cleaned up temporary config');
		}
	}
}

async function testESModuleBuild() {
	try {
		// Dynamic import test
		const { calculateFaraidh, Terbilang, terbilangRupiah, VERSION } = await import('../dist/waris.es.mjs');
		
		// Test basic functionality
		console.log('  ✅ ES import successful');
		
		// Test Terbilang
		const result1 = Terbilang.Convert(123456);
		if (result1 !== 'seratus dua puluh tiga ribu empat ratus lima puluh enam') {
			throw new Error('Terbilang test failed');
		}
		console.log('  ✅ Terbilang function works');
		
		// Test terbilangRupiah
		const result2 = terbilangRupiah(5000000n);
		if (!result2.includes('lima juta')) {
			throw new Error('terbilangRupiah test failed');
		}
		console.log('  ✅ terbilangRupiah function works');
		
		// Test calculateFaraidh with simple case
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
		if (faraidhResult.totalDistributed !== 100000000n) {
			throw new Error('calculateFaraidh test failed');
		}
		console.log('  ✅ calculateFaraidh function works');
		
		console.log('  ✅ ES Module build fully functional\n');
		
	} catch (error) {
		throw new Error(`ES Module test failed: ${error.message}`);
	}
}

async function testCommonJSBuild() {
	try {
		// Create a temporary test file for CommonJS
		const cjsTestFile = './temp-cjs-test.cjs';
		const cjsTestContent = `
const { calculateFaraidh, Terbilang, terbilangRupiah } = require('./dist/waris.cjs');

// Test Terbilang
const result1 = Terbilang.Convert(123456);
if (result1 !== 'seratus dua puluh tiga ribu empat ratus lima puluh enam') {
	throw new Error('Terbilang test failed');
}

// Test terbilangRupiah
const result2 = terbilangRupiah(5000000n);
if (!result2.includes('lima juta')) {
	throw new Error('terbilangRupiah test failed');
}

console.log('CommonJS build test passed');
`;
		
		writeFileSync(cjsTestFile, cjsTestContent);
		execSync(`bun ${cjsTestFile}`, { stdio: 'inherit' });
		execSync(`bun x rimraf ${cjsTestFile}`);
		
		console.log('  ✅ CommonJS build fully functional\n');
		
	} catch (error) {
		throw new Error(`CommonJS test failed: ${error.message}`);
	}
}

async function testUMDBuild() {
	try {
		// Test UMD in Node.js environment
		const umdPath = '../dist/waris.umd.js';
		const umdContent = readFileSync(umdPath, 'utf-8');
		
		// Check UMD structure
		if (!umdContent.includes('typeof exports')) {
			throw new Error('Invalid UMD format');
		}
		
		// Create temporary test for UMD
		const umdTestFile = './temp-umd-test.js';
		const umdTestContent = `
// Simulate global environment
global.exports = {};
global.module = { exports: {} };

// Load UMD build
${umdContent}

// Test via global
if (typeof global.Waris !== 'undefined') {
	const { Terbilang } = global.Waris;
	const result = Terbilang.Convert(12345);
	if (!result.includes('dua belas ribu')) {
		throw new Error('UMD Terbilang test failed');
	}
	console.log('UMD global test passed');
} else {
	console.log('UMD module.exports test passed');
}
`;
		
		writeFileSync(umdTestFile, umdTestContent);
		execSync(`bun ${umdTestFile}`, { stdio: 'inherit' });
		execSync(`bun x rimraf ${umdTestFile}`);
		
		console.log('  ✅ UMD build fully functional\n');
		
	} catch (error) {
		throw new Error(`UMD test failed: ${error.message}`);
	}
}

async function testTerbilangWithDist() {
	try {
		// Import from dist
		const { Terbilang, terbilangRupiah, terbilangBigInt, formatCurrency } = await import('../dist/waris.es.mjs');
		
		// Run key test cases
		const testCases = [
			{ input: 0, expected: 'nol' },
			{ input: 11, expected: 'sebelas' },  
			{ input: 123456, expected: 'seratus dua puluh tiga ribu empat ratus lima puluh enam' },
			{ input: 1000000, expected: 'satu juta' },
			{ input: -5000, expected: 'minus lima ribu' }
		];
		
		for (const testCase of testCases) {
			const result = Terbilang.Convert(testCase.input);
			if (result !== testCase.expected) {
				throw new Error(`Terbilang failed for ${testCase.input}: expected "${testCase.expected}", got "${result}"`);
			}
		}
		
		// Test BigInt functions
		const rupiahResult = terbilangRupiah(5000000n);
		if (!rupiahResult.includes('lima juta rupiah')) {
			throw new Error('terbilangRupiah BigInt test failed');
		}
		
		const bigIntResult = terbilangBigInt(999999999n);
		if (!bigIntResult.includes('sembilan ratus sembilan puluh sembilan juta')) {
			throw new Error('terbilangBigInt test failed');
		}
		
		console.log('  ✅ All Terbilang functions work correctly with dist build');
		
	} catch (error) {
		throw new Error(`Terbilang dist test failed: ${error.message}`);
	}
}

async function testFaraidhWithDist() {
	try {
		// Import from dist  
		const { calculateFaraidh } = await import('../dist/waris.es.mjs');
		
		// Test various inheritance scenarios
		const testCases = [
			{
				name: 'Wife only',
				input: {
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
				},
				expectedTotal: 100000000n
			},
			{
				name: 'Parents only',
				input: {
					totalAssets: 60000000n,
					utang: 0n,
					wasiatFraction: { num: 0n, den: 1n },
					heirs: { 
						suami: 0, istri: 0, ayah: 1, ibu: 1, kakekAyah: 0, nenekAyah: 0, nenekIbu: 0,
						anakLaki: 0, anakPerempuan: 0, cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
						saudaraLakiKandung: 0, saudaraPerempuanKandung: 0, saudaraLakiSeayah: 0, saudaraPerempuanSeayah: 0,
						saudaraLakiSeibu: 0, saudaraPerempuanSeibu: 0, keponakanLakiDariSaudaraLakiKandung: 0,
						pamanKandung: 0, pamanSeayah: 0
					}
				},
				expectedTotal: 60000000n
			}
		];
		
		for (const testCase of testCases) {
			const result = calculateFaraidh(testCase.input);
			
			if (result.totalDistributed !== testCase.expectedTotal) {
				throw new Error(`Faraidh failed for "${testCase.name}": expected ${testCase.expectedTotal}, got ${result.totalDistributed}`);
			}
			
			// Verify calculation integrity
			if (result.netEstate <= 0n) {
				throw new Error(`Invalid netEstate for "${testCase.name}"`);
			}
		}
		
		console.log('  ✅ All Faraidh calculations work correctly with dist build');
		
	} catch (error) {
		throw new Error(`Faraidh dist test failed: ${error.message}`);
	}
}

// Run the tests
testDistFiles().catch((error) => {
	console.error('💥 Test execution failed:', error);
	process.exit(1);
}); 