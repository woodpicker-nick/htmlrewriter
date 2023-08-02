import init, { HTMLRewriter as RawHTMLRewriter } from '../dist/html_rewriter.js'

import { DocumentHandlers, ElementHandlers } from './types'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

// console.log(wasm)

export function HTMLRewriterWrapper(initPromise: Promise<any>) {
    return class HTMLRewriter {
        initPromise: Promise<void> = initPromise

        constructor(private options: any = {}) {}

        private elementHandlers: [
            selector: string,
            handlers: ElementHandlers,
        ][] = []
        private documentHandlers: DocumentHandlers[] = []

        on(selector: string, handlers: ElementHandlers): this {
            this.elementHandlers.push([selector, handlers])
            return this
        }

        onDocument(handlers: DocumentHandlers): this {
            this.documentHandlers.push(handlers)
            return this
        }

        async transform(res: Response) {
            await this.initPromise
            let output = ''
            const rewriter = new RawHTMLRewriter((chunk: any) => {
                output += decoder.decode(chunk)
            }, this.options)
            for (const [selector, handlers] of this.elementHandlers) {
                rewriter.on(selector, handlers)
            }
            for (const handlers of this.documentHandlers) {
                rewriter.onDocument(handlers)
            }

            try {
                await rewriter.write(encoder.encode(await res.text()))
                await rewriter.end()
                return new Response(output, res)
            } finally {
                rewriter.free()
            }
        }
    }
}
