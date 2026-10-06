module.exports = {
	root: true,
	extends: [
		'wikimedia/typescript',
	],
	ignorePatterns: [
		'dist/',
		'dist-tmp/',
		'node_modules/',
	],
	rules: {
		'comma-dangle': 'off',
	},
};
