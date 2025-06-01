/// <reference types="vitest" />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
			include: ["src/**/*"],
			exclude: ["test/**/*", "**/*.test.*", "**/__tests__/**/*"],
			pathsToAliases: true,
			staticImport: true,
			clearPureImport: true,
			outDir: "dist",
			copyDtsFiles: false,

			afterBuild: (emittedFiles) => {
				console.log(`📝 Generated ${emittedFiles.size} declaration files`);

				const requiredFiles = [
					'index.d.ts',
					'faraidh/types.d.ts',
					'utils/Terbilang.d.ts'
				];

				for (const file of requiredFiles) {
					if (!emittedFiles.has(file)) {
						console.warn(`⚠️  Missing: ${file}`);
					} else {
						console.log(`✅ Found: ${file}`);
					}
				}
			},
		}),
	],

	build: {
		lib: {
			entry: "./src/index.ts",
			name: "Waris",
			formats: ["es", "cjs", "umd"],
			fileName: (format) => {
				switch (format) {
					case "es":
						return "waris.es.mjs";
					case "cjs":
						return "waris.cjs";
					case "umd":
						return "waris.umd.js";
					default:
						return `waris.${format}.js`;
				}
			},
		},
		rollupOptions: {
			external: () => false,
			output: {
				globals: {},
				exports: "named",
			},
		},
		minify: true,
		sourcemap: true,
		target: "es2020",
		reportCompressedSize: true,
	},

	resolve: {
		alias: {
			"@": "./src",
		},
	},

	test: {
		globals: true,
		environment: "node",
	},
});
