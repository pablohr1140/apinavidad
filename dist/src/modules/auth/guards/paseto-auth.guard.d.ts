import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PasetoService } from '@/infra/auth/PasetoService';
import { AuthorizationService } from '@/modules/auth/services/authorization.service';
export declare class PasetoAuthGuard implements CanActivate {
    private readonly pasetoService;
    private readonly authorizationService;
    private readonly reflector;
    constructor(reflector: Reflector, pasetoService: PasetoService, authorizationService: AuthorizationService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
