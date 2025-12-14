"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasetoService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const paseto_1 = require("paseto");
const env_1 = require("../../config/env");
const secretKey = (0, crypto_1.createHash)('sha256').update(env_1.env.PASETO_SECRET).digest();
let PasetoService = class PasetoService {
    async sign(payload, options) {
        const exp = new Date(Date.now() + (options?.expiresInMinutes ?? 60) * 60 * 1000);
        return paseto_1.V3.encrypt({ ...payload, exp }, secretKey);
    }
    async verify(token) {
        const { exp, ...payload } = await paseto_1.V3.decrypt(token, secretKey);
        if (new Date(exp) < new Date()) {
            throw new Error('Token expirado');
        }
        return payload;
    }
};
exports.PasetoService = PasetoService;
exports.PasetoService = PasetoService = __decorate([
    (0, common_1.Injectable)()
], PasetoService);
