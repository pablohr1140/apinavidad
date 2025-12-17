"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimit = exports.RATE_LIMIT_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.RATE_LIMIT_METADATA_KEY = 'rateLimit';
const RateLimit = (prefix, limit, ttlSeconds) => (0, common_1.SetMetadata)(exports.RATE_LIMIT_METADATA_KEY, { prefix, limit, ttlSeconds });
exports.RateLimit = RateLimit;
