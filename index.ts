import {
    
    HTMLRewriter as RawHTMLRewriter,
    
} from './dist/html_rewriter'


const encoder = new TextEncoder()
const decoder = new TextDecoder()

type ElementHandlers = {
    element?(element: any): void | Promise<void>
}


export class HTMLRewriter {
    private elementHandlers: [selector: string, handlers: any][] =
        []

    constructor(private readonly options?: any) {}

    on(selector: string, handlers: ElementHandlers): this {
        this.elementHandlers.push([selector, handlers])
        return this
    }

    async transform(res: Response) {

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

async function main() {
    
    const res1 = new Response(`<h1>hello</h1><a href="/foo">foo</a>`)
    const res2 = await new HTMLRewriter().on('h1', {
        element(element) {
            element.setInnerContent('hello world')
        }
    }).on('a', {
        element(element) {
            element.setAttribute('href', 'https://google.com')
        }
    }).transform(res1)
    console.log(await res2.text())
}
main()