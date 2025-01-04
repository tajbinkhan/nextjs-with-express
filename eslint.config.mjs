import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals"),
	...compat.plugins({
		"unused-imports": unusedImports
	}),
	...compat.rules({
		"react/react-in-jsx-scope": 0,
		"react-hooks/rules-of-hooks": "error",
		"no-console": 0,
		"react/state-in-constructor": 0,
		indent: 0,
		"linebreak-style": 0,
		"react/prop-types": 0,
		"jsx-a11y/click-events-have-key-events": 0,
		"unused-imports/no-unused-imports": "warn", // Automatically remove unused imports
		"unused-imports/no-unused-vars": [
			"off",
			{
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_"
			}
		]
	})
];

export default eslintConfig;
