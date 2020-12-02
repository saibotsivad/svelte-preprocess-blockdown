# svelte-preprocess-blockdown

Preprocessor for the Svelte compiler for [Blockdown](https://github.com/saibotsivad/blockdown/) files.

## What it does

Blockdown is a Markdown-like syntax that lets you define blocks of text as other data formats. It makes it easier to embed things like [mermaid syntax](https://mermaidjs.github.io/) (a text-based graph) into your Markdown files.

This preprocessor takes Blockdown text and generates Svelte syntax from it.

Given a Blockdown file that looks like this:

```md
---
title: My file

---!svelte#init
import Widgit from './Widget.svelte'

---!md
Some *markdown* text.

---!svelte
<Widget {count} />

```

This preprocessor would output a Svelte component that looks like this:

```html
<script>
	import Widgit from './Widget.svelte'
</script>
<p>
	Some <em>markdown</em> text.
</p>
<Widget {count} />
```

## How to use

You'll need to install it the usual way:

```bash
npm install svelte-preprocess-blockdown
```

Import/require the usual way, as a named export:

```js
import { preprocessBlockdown } from 'svelte-preprocess-blockdown';
// or
const { preprocessBlockdown } = require('svelte-preprocess-blockdown');
```

For your Svelte preprocessor declaration, this exported function would be used as the `markup` function.

From the [Svelte docs](https://svelte.dev/docs#svelte_preprocess), it would look like:

```js
const svelte = require('svelte/compiler');
const { preprocessBlockdown } = require('svelte-preprocess-blockdown');

const options = { /* ... */ }

const { code } = await svelte.preprocess(source, {
	markup: preprocessBlockdown(options)
}, {
	filename: 'App.svelte'
});
```

## API

The synchronous function is called with a single `Object` (defined below as "Options") and returns a synchronous function which takes a single `Object`, expecting the property `content` which is the full string of the file, and `filename` which is the string of the filename.

## Options

All available options:

- `parsers: Object<String, Function>` - Used to define parsers corresponding to the Blockdown delimiter `name` property.

## Parsers

For every Blockdown delimiter `name` you need to define a corresponding parser.

The only exception is for the delimiter name `svelte`, which is handled internally.

Minimally, you will likely need to specify a YAML parser (for the Front Matter) and a Markdown parser. My current recommendations are [js-yaml](https://www.npmjs.com/package/js-yaml) and [remarkable](https://www.npmjs.com/package/remarkable), respectively.

Example:

```js
const { preprocessBlockdown } = require('svelte-preprocess-blockdown');
const { Remarkable } = require('remarkable');
const svelte = require('svelte/compiler');
const yaml = require('js-yaml');

const md = new Remarkable()

const options = {
	parsers: {
		yaml: yaml.safeLoad,
		md: md.render
	}
}

const { code } = await svelte.preprocess(source, {
	markup: preprocessBlockdown(options)
}, {
	filename: 'App.svelte'
});
```

## License

Published and released with love under the [Very Open License](http://veryopenlicense.com).
