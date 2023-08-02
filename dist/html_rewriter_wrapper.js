import { HTMLRewriter as RawHTMLRewriter } from '../dist/html_rewriter.js';
const encoder = new TextEncoder();
const decoder = new TextDecoder();
// console.log(wasm)
export function HTMLRewriterWrapper(initPromise) {
    return class HTMLRewriter {
        constructor(options = {}) {
            this.options = options;
            this.initPromise = initPromise;
            this.elementHandlers = [];
            this.documentHandlers = [];
        }
        on(selector, handlers) {
            this.elementHandlers.push([selector, handlers]);
            return this;
        }
        onDocument(handlers) {
            this.documentHandlers.push(handlers);
            return this;
        }
        transform(response) {
            const body = response.body;
            // HTMLRewriter doesn't run the end handler if the body is null, so it's
            // pointless to setup the transform stream.
            if (body === null)
                return new Response(body, response);
            if (response instanceof Response) {
                // Make sure we validate chunks are BufferSources and convert them to
                // Uint8Arrays as required by the Rust glue code.
                response = new Response(response.body, response);
            }
            let rewriter;
            const transformStream = new TransformStream({
                start: async (controller) => {
                    // Create a rewriter instance for this transformation that writes its
                    // output to the transformed response's stream. Note that each
                    // BaseHTMLRewriter can only be used once.
                    await this.initPromise;
                    rewriter = new RawHTMLRewriter((chunk) => {
                        // enqueue will throw on empty chunks
                        if (chunk.length !== 0)
                            controller.enqueue(chunk);
                    }, { enableEsiTags: false });
                    // Add all registered handlers
                    for (const [selector, handlers] of this
                        .elementHandlers) {
                        rewriter.on(selector, handlers);
                    }
                    for (const handlers of this.documentHandlers) {
                        rewriter.onDocument(handlers);
                    }
                },
                // The finally() below will ensure the rewriter is always freed.
                // chunk is guaranteed to be a Uint8Array as we're using the
                // @miniflare/core Response class, which transforms to a byte stream.
                transform: (chunk) => rewriter.write(chunk),
                flush: () => rewriter.end(),
            });
            const promise = body.pipeTo(transformStream.writable);
            promise.catch(() => { }).finally(() => rewriter === null || rewriter === void 0 ? void 0 : rewriter.free());
            // Return a response with the transformed body, copying over headers, etc
            const res = new Response(transformStream.readable, response);
            // If Content-Length is set, it's probably going to be wrong, since we're
            // rewriting content, so remove it
            res.headers.delete('Content-Length');
            return res;
        }
    };
}
//# sourceMappingURL=html_rewriter_wrapper.js.map