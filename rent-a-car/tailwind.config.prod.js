// tailwind.config.js

module.exports = {
	mode: 'jit',
	purge: [
		// Use *.tsx if using TypeScript
		'./src/**/*.html',
	],
	darkMode: 'class', // or 'media' or 'class'
	variants: {
		// Add variants as needed
	},
	theme: {
		backdropFilter: {
			none: 'none',
			blur: 'blur(20px)',
		},
	},
	plugins: [require('tailwindcss-filters')],
	// ...
};
