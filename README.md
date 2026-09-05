# WikibaseDataModelTypes

Typescript definitions for the Wikibase DataModel expressed as flat JS objects,
as returned and accepted by Wikibase APIs like wbgetentities or wbeditentity.

## Installation

```sh
npm install @wvanderp/wikibase-datamodel-types
# or
pnpm add @wvanderp/wikibase-datamodel-types
```

## Usage

```ts
import type {
  Item,
  Statement,
  LabelLanguages,
} from "@wvanderp/wikibase-datamodel-types";
```

## Scope

- It supports all the features of wikidata items and properties
- It has partial support for commons structured data
- Additional information returned by the Wikimedia API is not modelled

This is a declaration-only package. Use `import type`; it does not provide
runtime JavaScript exports.

## Maintainers

See the
[publishing guide](https://github.com/wvanderp/WikibaseDataModelTypes/blob/master/PUBLISHING.md)
for the release checklist, npm authentication setup, and the one-time
first-publish procedure.
