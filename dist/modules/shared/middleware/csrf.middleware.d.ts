import type { Request, Response, NextFunction } from 'express';
export declare const csrfProtection: import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare function attachCsrfToken(req: Request, res: Response, next: NextFunction): void;
