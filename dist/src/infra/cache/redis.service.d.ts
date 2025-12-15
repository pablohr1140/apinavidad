/**
 * # redis.service
 * Propósito: Infra redis.service
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
 */
import { OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleDestroy {
    private readonly logger;
    private readonly client;
    constructor();
    get isEnabled(): boolean;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
