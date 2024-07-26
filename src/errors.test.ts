import { describe, expect, it, test } from 'vitest'
import { HTMLRewriter } from 'htmlrewriter'

test(
    'errors',
    async () => {
        const abortController = new AbortController()
        const res = await fetch('https://framer.com', {
            signal: abortController.signal,
        })

        const transform = new HTMLRewriter()
            .on('a', {
                element(element) {
                    abortController.abort()
                },
            })
            .transform(res)
        expect(await transform.text().catch((e) => e)).toBeInstanceOf(Error)
    },
    1000 * 10,
)
test(
    'works',
    async () => {
        const res = await fetch('https://framer.com', {
            headers: {
                accept: 'text/html',
            },
        })

        const transform = new HTMLRewriter()
            .on('a', {
                element(element) {
                    element.remove()
                },
            })
            .transform(res)
        const text = await transform.text()
        expect(text).toContain('<meta')
        expect(text).not.toContain('<a ')
    },
    1000 * 10,
)
test(
    'works on non-html',
    async () => {
        const res = await fetch('https://json.schemastore.org/fly.json', {
            headers: {
                // accept: 'text/html',
            },
        })

        let resClone = res.clone()
        const transform = new HTMLRewriter()
            .on('a', {
                element(element) {},
            })
            .transform(res)
        const text = await transform.text()
        // console.log(text)
        expect(text).toEqual(await resClone.text())
    },
    1000 * 10,
)

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
