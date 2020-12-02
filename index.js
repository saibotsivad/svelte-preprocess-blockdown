const { parse: parseBlockdown } = require('@saibotsivad/blockdown')

module.exports = ({ parsers }) => ({ content, filename }) => {
	const { blocks, warnings } = parseBlockdown(content)

	if (warnings && warnings.length) {
		console.error('Found warning(s) with file:', filename)
		for (const warning of warnings) {
			console.warn(warning)
		}
	}

	const [ frontmatter, ...remaining ] = blocks

	const metadata = (parsers.frontmatter || parsers.yaml)(frontmatter.content.trim())

	const component = remaining
		.map((block, index) => {
			if (block.name === 'svelte' && block.id === 'init') {
				return [
					'<script>',
					metadata && `const metadata = ${JSON.stringify(metadata, undefined, 2)}`,
					block.content,
					'</script>'
				].join('\n')
			} else if (block.name === 'svelte') {
				return block.content
			} else if (parsers[block.name]) {
				return parsers[block.name](block.content)
			} else {
				return [
					'<pre><code>',
					block.content,
					'</code></pre>'
				].join('\n')
			}
		})
		.join('\n\n')

console.log('------------------')
console.log(component)
console.log('------------------')

	return { code: component }
}
