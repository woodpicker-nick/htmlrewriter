Cloudflare `HTMLRewriter` packaged to work with

-   Node.js
-   Next.js (appending `?module` to wasm imports)
-   browser (fetching the wasm file at runtime)
-   Bun & Cloudflare (simply using the global `HTMLRewriter` object)

## Install

```
npm i @xmorse/htmlrewriter
```

## Usage

```ts
import { HTMLRewriter } from '@xmorse/htmlrewriter'

const rewriter = new HTMLRewriter()

rewriter.on('a', {
    element(element) {
        element.setAttribute('href', 'https://www.baidu.com')
    },
})
const res = await rewriter.transform(
    new Response('<a href="https://www.google.com">google</a>'),
)
console.log(await res.text())
```
