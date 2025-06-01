import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = './dist';
const TEST_DIR = './test';
const TEMP_TEST_DIR = './temp-test-dist';

async function runComprehensiveDistTests() {
	console.log('🧪 Running COMPREHENSIVE test suite against distribution files...\n');
	
	// Check if dist exists
	if (!existsSync(DIST_DIR)) {
		console.error('❌ Dist directory not found. Run "bun run build" first.');
		process.exit(1);
	}
	
	try {
		// Create temporary test directory
		await createTempTestFiles();
		
		// Run all tests against dist
		console.log('🚀 Running all 118 tests against dist files...\n');
		
		const startTime = performance.now();
		
		// Run test suite with timeout - test specific files
		const testFiles = [
			`${TEMP_TEST_DIR}/faraidh/faraidh.basic.test.ts`,
			`${TEMP_TEST_DIR}/faraidh/faraidh.advanced.test.ts`,
			`${TEMP_TEST_DIR}/terbilang/Terbilang.test.ts`,
			`${TEMP_TEST_DIR}/terbilang/Terbilang.accounting.test.ts`,
			`${TEMP_TEST_DIR}/terbilang/Terbilang.performance.test.ts`
		].filter(file => existsSync(file)).join(' ');
		
		execSync(`bun test ${testFiles} --timeout 30000`, { 
			stdio: 'inherit',
			cwd: process.cwd()
		});
		
		const endTime = performance.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);
		
		console.log(`\n🎉 All tests passed against distribution files in ${duration}s!`);
		console.log('✅ Your built library is fully functional and ready for release!');
		
	} catch (error) {
		console.error('💥 Distribution tests failed:', error.message);
		process.exit(1);
	} finally {
		// Cleanup
		try {
			if (existsSync(TEMP_TEST_DIR)) {
				execSync(`bun x rimraf ${TEMP_TEST_DIR}`);
				console.log('🧹 Cleaned up temporary test files');
			}
		} catch (cleanupError) {
			console.warn('⚠️ Failed to cleanup temp files:', cleanupError.message);
		}
	}
}

async function createTempTestFiles() {
	console.log('📁 Creating temporary test files with dist imports...');
	
	// Create temp directory
	if (existsSync(TEMP_TEST_DIR)) {
		execSync(`bun x rimraf ${TEMP_TEST_DIR}`);
	}
	mkdirSync(TEMP_TEST_DIR, { recursive: true });
	
	// Copy dist files to temp directory for easier import
	const tempDistDir = join(TEMP_TEST_DIR, 'dist');
	mkdirSync(tempDistDir, { recursive: true });
	
	// Copy main dist files
	const distFiles = ['waris.es.mjs', 'waris.cjs', 'waris.umd.js', 'index.d.ts'];
	for (const file of distFiles) {
		const sourcePath = join(DIST_DIR, file);
		const destPath = join(tempDistDir, file);
		if (existsSync(sourcePath)) {
			copyFileSync(sourcePath, destPath);
		}
	}
	
	console.log('📁 Copied dist files to temp directory');
	
	// Copy and modify test files
	const testFiles = [
		'faraidh/faraidh.basic.test.ts',
		'faraidh/faraidh.advanced.test.ts',
		'terbilang/Terbilang.test.ts',
		'terbilang/Terbilang.accounting.test.ts',
		'terbilang/Terbilang.performance.test.ts'
	];
	
	for (const testFile of testFiles) {
		const sourcePath = join(TEST_DIR, testFile);
		const destPath = join(TEMP_TEST_DIR, testFile);
		
		if (!existsSync(sourcePath)) {
			console.warn(`⚠️ Test file not found: ${sourcePath}`);
			continue;
		}
		
		// Create destination directory
		mkdirSync(dirname(destPath), { recursive: true });
		
		// Read original test file
		let content = readFileSync(sourcePath, 'utf-8');
		
		// Replace import paths to use dist files (relative from test file to temp dist)
		const depth = testFile.split('/').length; // faraidh/file.test.ts = 2 levels
		const relativePrefix = '../'.repeat(depth);
		
		content = content.replace(
			/import\s+\{([^}]+)\}\s+from\s+["']@\/faraidh\/engine\/calculate["'];?/g,
			`import { $1 } from "${relativePrefix}dist/waris.es.mjs";`
		);
		
		content = content.replace(
			/import\s+type\s+\{([^}]+)\}\s+from\s+["']@\/faraidh\/types["'];?/g,
			'// Removed type import for dist testing - using runtime types'
		);
		
		content = content.replace(
			/import\s+\{([^}]+)\}\s+from\s+["']@\/utils\/Terbilang["'];?/g,
			`import { $1 } from "${relativePrefix}dist/waris.es.mjs";`
		);
		
		// Handle mixed imports
		content = content.replace(
			/import\s+\{([^}]+)\}\s+from\s+["']@\/faraidh\/types["'];?\s*\n/g,
			''
		);
		
		// Add type definitions at the top if needed for faraidh tests
		if (testFile.includes('faraidh')) {
			const typeDefinitions = `
// Type definitions for dist testing
interface CalculationInput {
	totalAssets: bigint;
	utang: bigint;
	wasiatFraction: { num: bigint; den: bigint };
	heirs: HeirCounts;
}

interface HeirCounts {
	suami: number;
	istri: number;
	ayah: number;
	ibu: number;
	kakekAyah: number;
	nenekAyah: number;
	nenekIbu: number;
	anakLaki: number;
	anakPerempuan: number;
	cucuLakiDariAnakLaki: number;
	cucuPerempuanDariAnakLaki: number;
	saudaraLakiKandung: number;
	saudaraPerempuanKandung: number;
	saudaraLakiSeayah: number;
	saudaraPerempuanSeayah: number;
	saudaraLakiSeibu: number;
	saudaraPerempuanSeibu: number;
	keponakanLakiDariSaudaraLakiKandung: number;
	pamanKandung: number;
	pamanSeayah: number;
}

`;
			content = typeDefinitions + content;
		}
		
		// Add Decimal import for Terbilang tests
		if (testFile.includes('terbilang')) {
			// Add Decimal import at the top
			content = `import Decimal from "decimal.js";\n` + content;
		}
		
		// Write modified test file
		writeFileSync(destPath, content);
		console.log(`  ✅ Modified: ${testFile}`);
	}
	
	console.log('📝 All test files prepared for dist testing\n');
}

// Run the comprehensive tests
runComprehensiveDistTests().catch((error) => {
	console.error('💥 Comprehensive test execution failed:', error);
	process.exit(1);
}); 