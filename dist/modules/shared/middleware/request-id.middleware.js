"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const crypto_1 = require("crypto");
const logger_1 = require("../../../shared/logger");
const HEADER_REQUEST_ID = 'x-request-id';
function requestIdMiddleware(req, res, next) {
    const incomingId = req.headers[HEADER_REQUEST_ID];
    const requestId = incomingId && incomingId.length > 0 ? incomingId : (0, crypto_1.randomUUID)();
    req.requestId = requestId;
    req.log = logger_1.logger.child({ requestId });
    res.setHeader(HEADER_REQUEST_ID, requestId);
    next();
}
