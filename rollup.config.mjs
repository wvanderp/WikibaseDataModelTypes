import dts from 'rollup-plugin-dts';

export default [
	{
		input: 'index.d.ts',
		output: {
			file: 'dist/index.d.ts',
			format: 'es',
		},
		plugins: [
			dts({
				respectExternal: true,
			}),
		],
	},
];
