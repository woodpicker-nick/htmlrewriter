import { HTMLRewriter } from "./index"

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