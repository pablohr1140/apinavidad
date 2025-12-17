"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = void 0;
exports.attachCsrfToken = attachCsrfToken;
const csurf_1 = __importDefault(require("csurf"));
const env_1 = require("../../../config/env");
const secureCookies = env_1.env.NODE_ENV !== 'development';
exports.csrfProtection = (0, csurf_1.default)({
    cookie: {
        httpOnly: false, // el token debe ser legible por el cliente para reenviarlo en cabeceras
        sameSite: 'lax',
        secure: secureCookies,
        path: '/'
    }
});
function attachCsrfToken(req, res, next) {
    if (typeof req.csrfToken === 'function') {
        const token = req.csrfToken();
        res.cookie('XSRF-TOKEN', token, {
            httpOnly: false,
            sameSite: 'lax',
            secure: secureCookies,
            path: '/'
        });
        res.setHeader('X-CSRF-Token', token);
    }
    next();
}
