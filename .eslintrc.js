module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
	// required to lint *.vue files
	plugins: ['vue', 'prettier'],
	// add your custom rules here
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'vue/html-indent': [
			'error',
			'tab',
			{
				alignAttributesVertically: true
			}
		],

		'vue/max-attributes-per-line': [
			0,
			{
				singleline: 4,
				multiline: {
					max: 4,
					allowFirstLine: false
				}
			}
		]
	}
}
