import init from './dist/html_rewriter.js'
import fs from 'fs'
import path from 'path'
import url from 'url'

import { HTMLRewriterWrapper } from './dist/html_rewriter_wrapper.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const bytes = fs.readFileSync(
    path.join(__dirname, 'dist/html_rewriter_bg.wasm'),
)

const wasm = new WebAssembly.Module(bytes)

export const HTMLRewriter = HTMLRewriterWrapper(init(wasm))
