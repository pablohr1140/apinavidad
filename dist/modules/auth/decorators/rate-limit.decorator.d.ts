export declare const RATE_LIMIT_METADATA_KEY = "rateLimit";
export interface RateLimitConfig {
    prefix: string;
    limit: number;
    ttlSeconds: number;
}
export declare const RateLimit: (prefix: string, limit: number, ttlSeconds: number) => import("@nestjs/common").CustomDecorator<string>;
