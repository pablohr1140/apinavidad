import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_METADATA_KEY = 'rateLimit';

export interface RateLimitConfig {
  prefix: string;
  limit: number;
  ttlSeconds: number;
}

export const RateLimit = (prefix: string, limit: number, ttlSeconds: number) =>
  SetMetadata(RATE_LIMIT_METADATA_KEY, { prefix, limit, ttlSeconds } satisfies RateLimitConfig);