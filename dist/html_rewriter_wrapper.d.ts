import { DocumentHandlers, ElementHandlers } from './types';
export declare function HTMLRewriterWrapper(initPromise: Promise<any>): {
    new (options?: any): {
        initPromise: Promise<void>;
        elementHandlers: [selector: string, handlers: ElementHandlers][];
        documentHandlers: DocumentHandlers[];
        on(selector: string, handlers: ElementHandlers): this;
        onDocument(handlers: DocumentHandlers): this;
        transform(response: Response): Response;
    };
};
