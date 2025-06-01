import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const DIST_DIR = './dist';
const REQUIRED_FILES = [
	// Main library files
	'waris.es.mjs',
	'waris.cjs', 
	'waris.umd.js',
	
	// Declaration files
	'index.d.ts',
	'faraidh/types.d.ts',
	'faraidh/engine/calculate.d.ts',
	'utils/Terbilang.d.ts',
	
	// Source maps
	'waris.es.mjs.map',
	'waris.cjs.map',
	'waris.umd.js.map'
];

const EXPECTED_EXPORTS = [
	'calculateFaraidh',
	'Terbilang', 
	'terbilangRupiah',
	'terbilangBigInt',
	'formatCurrency',
	'VERSION',
	'LIBRARY_NAME'
];

async function testBuild() {
	console.log('🧪 Running build validation tests...\n');
	
	let passed = 0;
	let failed = 0;
	
	// Test 1: Check if dist directory exists
	if (!existsSync(DIST_DIR)) {
		console.error('❌ Dist directory does not exist');
		process.exit(1);
	}
	console.log('✅ Dist directory exists');
	passed++;
	
	// Test 2: Check required files exist
	console.log('\n📁 Checking required files...');
	for (const file of REQUIRED_FILES) {
		const filePath = join(DIST_DIR, file);
		if (existsSync(filePath)) {
			const stats = statSync(filePath);
			const size = (stats.size / 1024).toFixed(2);
			console.log(`✅ ${file} (${size} KB)`);
			passed++;
		} else {
			console.error(`❌ Missing: ${file}`);
			failed++;
		}
	}
	
	// Test 3: Validate main declaration file
	console.log('\n📋 Validating index.d.ts...');
	const indexDtsPath = join(DIST_DIR, 'index.d.ts');
	if (existsSync(indexDtsPath)) {
		const content = readFileSync(indexDtsPath, 'utf-8');
		
		for (const expectedExport of EXPECTED_EXPORTS) {
			if (content.includes(expectedExport)) {
				console.log(`✅ Export found: ${expectedExport}`);
				passed++;
			} else {
				console.error(`❌ Missing export: ${expectedExport}`);
				failed++;
			}
		}
		
		// Check for common issues
		if (content.includes('@/')) {
			console.error('❌ Unresolved path alias "@/" found in declarations');
			failed++;
		} else {
			console.log('✅ Path aliases properly resolved');
			passed++;
		}
		
		if (content.includes('import(')) {
			console.error('❌ Dynamic imports found in declarations');
			failed++;
		} else {
			console.log('✅ No dynamic imports (good for tree-shaking)');
			passed++;
		}
	} else {
		console.error('❌ index.d.ts not found');
		failed++;
	}
	
	// Test 4: Validate UMD global
	console.log('\n🌐 Validating UMD build...');
	const umdPath = join(DIST_DIR, 'waris.umd.js');
	if (existsSync(umdPath)) {
		const umdContent = readFileSync(umdPath, 'utf-8');
		
		if (umdContent.includes('typeof exports=="object"') || umdContent.includes('typeof exports === "object"')) {
			console.log('✅ UMD format detected');
			passed++;
		} else {
			console.error('❌ Invalid UMD format');
			failed++;
		}
		
		if (umdContent.includes('Waris')) {
			console.log('✅ Global "Waris" variable found');
			passed++;
		} else {
			console.error('❌ Missing global "Waris" variable');
			failed++;
		}
	}
	
	// Test 5: Check TypeScript types compatibility
	console.log('\n🔷 Validating TypeScript compatibility...');
	const typesPath = join(DIST_DIR, 'faraidh/types.d.ts');
	if (existsSync(typesPath)) {
		const typesContent = readFileSync(typesPath, 'utf-8');
		
		const requiredTypes = ['CalculationInput', 'CalculationResult', 'HeirCounts', 'Fraction'];
		for (const type of requiredTypes) {
			if (typesContent.includes(type)) {
				console.log(`✅ Type found: ${type}`);
				passed++;
			} else {
				console.error(`❌ Missing type: ${type}`);
				failed++;
			}
		}
	}
	
	// Summary
	console.log('\n📊 Test Summary:');
	console.log(`✅ Passed: ${passed}`);
	console.log(`❌ Failed: ${failed}`);
	console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
	
	if (failed === 0) {
		console.log('\n🎉 All build validation tests passed!');
		console.log('📦 Library is ready for distribution');
		process.exit(0);
	} else {
		console.log('\n💥 Some tests failed. Please fix before distributing.');
		process.exit(1);
	}
}

// Dynamic import test untuk ES modules
async function testESModuleImport() {
	console.log('\n🔄 Testing ES module import...');
	try {
		const module = await import('./dist/waris.es.mjs');
		
		if (module.calculateFaraidh && typeof module.calculateFaraidh === 'function') {
			console.log('✅ calculateFaraidh function imported successfully');
			return true;
		} else {
			console.error('❌ calculateFaraidh function not found or invalid');
			return false;
		}
	} catch (error) {
		console.error('❌ Failed to import ES module:', error.message);
		return false;
	}
}

// Run tests
testBuild().then(() => {
	return testESModuleImport();
}).catch((error) => {
	console.error('💥 Build validation failed:', error);
	process.exit(1);
}); 