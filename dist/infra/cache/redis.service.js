"use strict";
/**
 * # redis.service
 * Propósito: Infra redis.service
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../../config/env");
let RedisService = RedisService_1 = class RedisService {
    logger = new common_1.Logger(RedisService_1.name);
    client;
    constructor() {
        if (env_1.env.REDIS_URL || env_1.env.REDIS_HOST) {
            this.client = env_1.env.REDIS_URL
                ? new ioredis_1.default(env_1.env.REDIS_URL)
                : new ioredis_1.default({
                    host: env_1.env.REDIS_HOST,
                    port: env_1.env.REDIS_PORT ?? 6379,
                    password: env_1.env.REDIS_PASSWORD || undefined
                });
            this.client.on('error', (error) => {
                this.logger.warn(`Redis error: ${error.message}`);
            });
        }
        else {
            this.client = null;
            this.logger.log('Redis no configurado; se continuará sin cache distribuido.');
        }
    }
    get isEnabled() {
        return Boolean(this.client);
    }
    async get(key) {
        if (!this.client) {
            return null;
        }
        try {
            return await this.client.get(key);
        }
        catch (error) {
            this.logger.warn(`Redis get falló para ${key}: ${error.message}`);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.client) {
            return;
        }
        try {
            if (ttlSeconds) {
                await this.client.set(key, value, 'EX', ttlSeconds);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (error) {
            this.logger.warn(`Redis set falló para ${key}: ${error.message}`);
        }
    }
    async del(key) {
        if (!this.client) {
            return;
        }
        try {
            await this.client.del(key);
        }
        catch (error) {
            this.logger.warn(`Redis del falló para ${key}: ${error.message}`);
        }
    }
    async incr(key, ttlSeconds) {
        if (!this.client) {
            return this.fallbackIncr(key, ttlSeconds);
        }
        try {
            const value = await this.client.incr(key);
            if (value === 1) {
                await this.client.expire(key, ttlSeconds);
            }
            return value;
        }
        catch (error) {
            this.logger.warn(`Redis incr falló para ${key}: ${error.message}`);
            return this.fallbackIncr(key, ttlSeconds);
        }
    }
    // Fallback in-memory counter when Redis is disabled or falla.
    fallbackCounters = new Map();
    fallbackIncr(key, ttlSeconds) {
        const now = Date.now();
        const existing = this.fallbackCounters.get(key);
        if (!existing || existing.expiresAt < now) {
            const entry = { count: 1, expiresAt: now + ttlSeconds * 1000 };
            this.fallbackCounters.set(key, entry);
            return 1;
        }
        existing.count += 1;
        return existing.count;
    }
    async onModuleDestroy() {
        await this.client?.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
