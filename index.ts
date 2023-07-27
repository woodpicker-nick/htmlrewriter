import init, { HTMLRewriter as RawHTMLRewriter } from './dist/html_rewriter'
// @ts-ignore
import wasm from './dist/html_rewriter_bg.wasm?module'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

type ElementHandlers = {
    element?(element: any): void | Promise<void>
}

let p = init(wasm)
export class HTMLRewriter {
    private elementHandlers: [selector: string, handlers: any][] = []

    constructor(private readonly options?: any) {}

    on(selector: string, handlers: ElementHandlers): this {
        this.elementHandlers.push([selector, handlers])
        return this
    }

    async transform(res: Response) {
        await p
        let output = ''
        const rewriter = new RawHTMLRewriter((chunk: any) => {
            output += decoder.decode(chunk)
        }, this.options)
        for (const [selector, handlers] of this.elementHandlers) {
            rewriter.on(selector, handlers)
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
