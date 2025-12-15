# Regla de jerarquía para eliminar roles

- Usa `AuthorizationService.assertCanDeleteRole(actorRoleKey, targetRoleKey)` antes de borrar un rol.
- La validación compara `rank`; si el objetivo tiene un `rank` mayor o igual al actor, lanza `ForbiddenException`.
- Ejemplo (servicio/controlador de roles):

```ts
// Servicio listo para usar: RoleAdminService.deleteRole
await this.roleAdminService.deleteRole(actorRoleKey, targetRoleKey);
// Internamente valida jerarquía (rank), borra el rol y limpia caché.
```

- Si el rol no existe, simplemente no hace nada; si el target tiene mayor/igual rank lanza Forbidden.
- Mantén los `rank` en `roles` coherentes para que la jerarquía funcione.
