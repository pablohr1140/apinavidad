# Migraciones Laravel (snapshot actualizado al 05 dic. 2025)

Listado automático de todas las migraciones vigentes ubicadas en database/migrations.
Cada sección incluye el contenido completo del archivo.

---

## 0001_01_01_000000_create_users_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->unsignedBigInteger('persona_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
```

## 0001_01_01_000001_create_cache_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};
```

## 0001_01_01_000002_create_jobs_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
```

## 2025_11_26_031605_create_permission_tables.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $teams = config('permission.teams');
        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $pivotRole = $columnNames['role_pivot_key'] ?? 'role_id';
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id';

        throw_if(empty($tableNames), Exception::class, 'Error: config/permission.php not loaded. Run [php artisan config:clear] and try again.');
        throw_if($teams && empty($columnNames['team_foreign_key'] ?? null), Exception::class, 'Error: team_foreign_key on config/permission.php not loaded. Run [php artisan config:clear] and try again.');

        Schema::create($tableNames['permissions'], static function (Blueprint $table) {
            // $table->engine('InnoDB');
            $table->bigIncrements('id'); // permission id
            $table->string('name');       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->string('guard_name'); // For MyISAM use string('guard_name', 25);
            $table->timestamps();

            $table->unique(['name', 'guard_name']);
        });

        Schema::create($tableNames['roles'], static function (Blueprint $table) use ($teams, $columnNames) {
            // $table->engine('InnoDB');
            $table->bigIncrements('id'); // role id
            if ($teams || config('permission.testing')) { // permission.testing is a fix for sqlite testing
                $table->unsignedBigInteger($columnNames['team_foreign_key'])->nullable();
                $table->index($columnNames['team_foreign_key'], 'roles_team_foreign_key_index');
            }
            $table->string('name');       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->string('guard_name'); // For MyISAM use string('guard_name', 25);
            $table->timestamps();
            if ($teams || config('permission.testing')) {
                $table->unique([$columnNames['team_foreign_key'], 'name', 'guard_name']);
            } else {
                $table->unique(['name', 'guard_name']);
            }
        });

        Schema::create($tableNames['model_has_permissions'], static function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission, $teams) {
            $table->unsignedBigInteger($pivotPermission);

            $table->string('model_type');
            $table->unsignedBigInteger($columnNames['model_morph_key']);
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

            $table->foreign($pivotPermission)
                ->references('id') // permission id
                ->on($tableNames['permissions'])
                ->onDelete('cascade');
            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_permissions_team_foreign_key_index');

                $table->primary([$columnNames['team_foreign_key'], $pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_permissions_permission_model_type_primary');
            } else {
                $table->primary([$pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_permissions_permission_model_type_primary');
            }

        });

        Schema::create($tableNames['model_has_roles'], static function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
            $table->unsignedBigInteger($pivotRole);

            $table->string('model_type');
            $table->unsignedBigInteger($columnNames['model_morph_key']);
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

            $table->foreign($pivotRole)
                ->references('id') // role id
                ->on($tableNames['roles'])
                ->onDelete('cascade');
            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_roles_team_foreign_key_index');

                $table->primary([$columnNames['team_foreign_key'], $pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            } else {
                $table->primary([$pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            }
        });

        Schema::create($tableNames['role_has_permissions'], static function (Blueprint $table) use ($tableNames, $pivotRole, $pivotPermission) {
            $table->unsignedBigInteger($pivotPermission);
            $table->unsignedBigInteger($pivotRole);

            $table->foreign($pivotPermission)
                ->references('id') // permission id
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            $table->foreign($pivotRole)
                ->references('id') // role id
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            $table->primary([$pivotPermission, $pivotRole], 'role_has_permissions_permission_id_role_id_primary');
        });

        app('cache')
            ->store(config('permission.cache.store') != 'default' ? config('permission.cache.store') : null)
            ->forget(config('permission.cache.key'));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names');

        throw_if(empty($tableNames), Exception::class, 'Error: config/permission.php not found and defaults could not be merged. Please publish the package configuration before proceeding, or drop the tables manually.');

        Schema::drop($tableNames['role_has_permissions']);
        Schema::drop($tableNames['model_has_roles']);
        Schema::drop($tableNames['model_has_permissions']);
        Schema::drop($tableNames['roles']);
        Schema::drop($tableNames['permissions']);
    }
};
```

## 2025_11_26_032123_create_tipo_documentos_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tipo_documentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo', 10)->unique();
            $table->string('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipo_documentos');
    }
};
```

## 2025_11_26_032129_create_nacionalidades_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nacionalidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('iso', 3)->nullable();
            $table->string('gentilicio')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique('nombre');
            $table->unique('iso');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nacionalidades');
    }
};
```

## 2025_11_26_032132_create_etnias_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('etnias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo', 10)->nullable();
            $table->string('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique('nombre');
            $table->unique('codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etnias');
    }
};
```

## 2025_11_26_032136_create_discapacidades_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discapacidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('categoria')->nullable();
            $table->string('codigo', 20)->nullable();
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique('nombre');
            $table->unique('codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discapacidades');
    }
};
```

## 2025_11_26_032140_create_providencias_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('providencias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo', 10)->nullable();
            $table->string('region')->nullable();
            $table->string('comuna')->nullable();
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique('nombre');
            $table->unique('codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providencias');
    }
};
```

## 2025_11_26_032144_create_periodos_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('periodos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('estado_periodo')->default('borrador');
            $table->boolean('es_activo')->default(false);
            $table->text('descripcion')->nullable();
            $table->timestamps();

            $table->unique('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periodos');
    }
};
```

## 2025_11_26_032148_create_personas_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('run', 12)->nullable()->unique();
            $table->string('documento', 32)->nullable();
            $table->string('dv', 2)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('sexo', 1)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->string('direccion')->nullable();
            $table->foreignId('providencia_id')->nullable()->constrained('providencias')->nullOnDelete();
            $table->boolean('es_representante')->default(false);
            $table->timestamps();

            $table->index(['nombres', 'apellidos']);
            $table->unique('documento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
```

## 2025_11_26_032151_create_organizaciones_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organizaciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('sigla')->nullable();
            $table->string('rut', 12)->nullable()->unique();
            $table->string('tipo')->default('otro');
            $table->string('direccion')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email')->nullable();
            $table->foreignId('providencia_id')->nullable()->constrained('providencias')->nullOnDelete();
            $table->string('estado')->default('borrador');
            $table->timestamps();

            $table->unique('nombre');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizaciones');
    }
};
```

## 2025_11_26_032155_create_organizacion_periodo_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organizacion_periodo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizacion_id')->constrained('organizaciones')->cascadeOnDelete();
            $table->foreignId('periodo_id')->constrained('periodos')->cascadeOnDelete();
            $table->string('estado')->default('pendiente');
            $table->date('fecha_asignacion')->nullable();
            $table->date('fecha_cierre')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['organizacion_id', 'periodo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizacion_periodo');
    }
};
```

## 2025_11_26_032158_create_ninos_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ninos', function (Blueprint $table) {
            $table->id();
            $table->string('nombres');
            $table->string('apellidos')->nullable();
            $table->string('run', 12)->nullable()->unique();
            $table->string('dv', 2)->nullable();
            $table->string('documento', 32)->nullable()->unique();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('sexo', 1)->nullable();
            $table->foreignId('organizacion_id')->nullable()->constrained('organizaciones')->nullOnDelete();
            $table->foreignId('periodo_id')->constrained('periodos');
            $table->foreignId('providencia_id')->nullable()->constrained('providencias')->nullOnDelete();
            $table->unsignedTinyInteger('edad')->nullable()->check('edad <= 10');
            $table->boolean('tiene_discapacidad')->default(false);
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_retiro')->nullable();
            $table->string('estado')->default('registrado');
            $table->timestamps();

            $table->index(['estado', 'periodo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ninos');
    }
};
```

## 2025_11_26_032202_create_logs_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('personas')->nullOnDelete();
            $table->string('accion');
            $table->text('mensaje')->nullable();
            $table->morphs('loggable');
            $table->json('payload')->nullable();
            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index('accion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};
```

## 2025_11_26_032208_create_discapacidad_persona_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discapacidad_nino', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nino_id')->constrained('ninos')->cascadeOnDelete();
            $table->foreignId('discapacidad_id')->constrained('discapacidades')->cascadeOnDelete();
            $table->unsignedTinyInteger('prioridad')->nullable();
            $table->unsignedTinyInteger('porcentaje')->nullable();
            $table->timestamps();

            $table->unique(['nino_id', 'discapacidad_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discapacidad_nino');
    }
};
```

## 2025_11_26_034845_create_organizacion_persona_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organizacion_persona', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizacion_id')->constrained('organizaciones')->cascadeOnDelete();
            $table->foreignId('persona_id')->constrained('personas')->cascadeOnDelete();
            $table->boolean('es_principal')->default(false);
            $table->boolean('es_reserva')->default(false);
            $table->boolean('activo')->default(true);
            $table->date('fecha_asignacion')->nullable();
            $table->date('fecha_desactivacion')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['organizacion_id', 'persona_id']);
            $table->index(['organizacion_id', 'es_principal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizacion_persona');
    }
};
```

## 2025_11_28_020611_add_porcentaje_to_discapacidad_persona_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('discapacidad_nino')) {
            return;
        }

        Schema::table('discapacidad_nino', function (Blueprint $table) {
            if (! Schema::hasColumn('discapacidad_nino', 'prioridad')) {
                $table->unsignedTinyInteger('prioridad')
                    ->nullable()
                    ->comment('Prioridad 1-6 para ordenar despliegues')
                    ->after('discapacidad_id');
            }

            if (! Schema::hasColumn('discapacidad_nino', 'porcentaje')) {
                $table->unsignedTinyInteger('porcentaje')
                    ->nullable()
                    ->comment('Porcentaje de discapacidad reportado (0-100)')
                    ->after('prioridad');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('discapacidad_nino')) {
            return;
        }

        Schema::table('discapacidad_nino', function (Blueprint $table) {
            $drops = [];

            foreach (['prioridad', 'porcentaje'] as $column) {
                if (Schema::hasColumn('discapacidad_nino', $column)) {
                    $drops[] = $column;
                }
            }

            if (! empty($drops)) {
                $table->dropColumn($drops);
            }
        });
    }
};
```

## 2025_11_29_000001_separate_ninos_from_personas.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();
        $supportsShowIndex = $driver !== 'sqlite';
        $canDropPersonaColumn = $driver !== 'sqlite';
        $hasPersonaColumn = Schema::hasColumn('ninos', 'persona_id');

        if (! Schema::hasTable('discapacidad_nino')) {
            Schema::create('discapacidad_nino', function (Blueprint $table) {
                $table->id();
                $table->foreignId('nino_id')->constrained('ninos')->cascadeOnDelete();
                $table->foreignId('discapacidad_id')->constrained('discapacidades')->cascadeOnDelete();
                $table->unsignedTinyInteger('prioridad')->nullable();
                $table->unsignedTinyInteger('porcentaje')->nullable();
                $table->timestamps();
                $table->unique(['nino_id', 'discapacidad_id']);
            });
        }

        if (! $hasPersonaColumn) {
            return;
        }

        $columnDefinitions = [
            'nombres' => function (Blueprint $table) {
                $table->string('nombres')->default('')->after('id');
            },
            'apellidos' => function (Blueprint $table) {
                $table->string('apellidos')->nullable()->after('nombres');
            },
            'run' => function (Blueprint $table) {
                $table->string('run', 12)->nullable()->unique()->after('apellidos');
            },
            'dv' => function (Blueprint $table) {
                $table->string('dv', 2)->nullable()->after('run');
            },
            'documento' => function (Blueprint $table) {
                $table->string('documento', 32)->nullable()->after('dv');
            },
            'fecha_nacimiento' => function (Blueprint $table) {
                $table->date('fecha_nacimiento')->nullable()->after('documento');
            },
            'sexo' => function (Blueprint $table) {
                $table->string('sexo', 1)->nullable()->after('fecha_nacimiento');
            },
        ];

        foreach ($columnDefinitions as $column => $callback) {
            if (! Schema::hasColumn('ninos', $column)) {
                Schema::table('ninos', $callback);
            }
        }

        DB::transaction(function () {
            DB::table('ninos')->orderBy('id')->chunk(200, function ($ninos) {
                $personaIds = $ninos->pluck('persona_id')->filter()->unique()->all();
                if (empty($personaIds)) {
                    return;
                }

                $personas = DB::table('personas')
                    ->whereIn('id', $personaIds)
                    ->get()
                    ->keyBy('id');

                foreach ($ninos as $nino) {
                    $persona = $personas->get($nino->persona_id);
                    if (! $persona) {
                        continue;
                    }

                    DB::table('ninos')
                        ->where('id', $nino->id)
                        ->update([
                            'nombres' => $persona->nombres ?? '',
                            'apellidos' => $persona->apellidos,
                            'run' => $persona->run,
                            'dv' => $persona->dv,
                            'documento' => $persona->documento,
                            'fecha_nacimiento' => $persona->fecha_nacimiento,
                            'sexo' => $persona->sexo,
                        ]);
                }
            });

            if (Schema::hasTable('discapacidad_persona')) {
                DB::table('discapacidad_persona as dp')
                    ->join('ninos', 'ninos.persona_id', '=', 'dp.persona_id')
                    ->select([
                        'ninos.id as nino_id',
                        'dp.discapacidad_id',
                        'dp.prioridad',
                        'dp.porcentaje',
                    ])
                    ->orderBy('dp.id')
                    ->chunk(500, function ($rows) {
                        $now = now();
                        $batch = [];

                        foreach ($rows as $row) {
                            $batch[] = [
                                'nino_id' => $row->nino_id,
                                'discapacidad_id' => $row->discapacidad_id,
                                'prioridad' => $row->prioridad,
                                'porcentaje' => $row->porcentaje,
                                'created_at' => $now,
                                'updated_at' => $now,
                            ];
                        }

                        if (! empty($batch)) {
                            DB::table('discapacidad_nino')->insert($batch);
                        }
                    });
            }

            if (Schema::hasTable('personas')) {
                $personaIds = DB::table('ninos')->whereNotNull('persona_id')->pluck('persona_id')->filter()->unique()->all();
                if (! empty($personaIds)) {
                    DB::table('personas')->whereIn('id', $personaIds)->delete();
                }
            }
        });

        if ($canDropPersonaColumn && Schema::hasColumn('ninos', 'persona_id')) {
            $personaIndexExists = $supportsShowIndex
                ? collect(DB::select("SHOW INDEX FROM ninos WHERE Key_name = 'ninos_persona_id_unique'"))->isNotEmpty()
                : false;

            Schema::table('ninos', function (Blueprint $table) use ($personaIndexExists) {
                $table->dropForeign(['persona_id']);

                if ($personaIndexExists) {
                    $table->dropUnique('ninos_persona_id_unique');
                }

                $table->dropColumn('persona_id');
            });
        }
    }

    public function down(): void
    {
        $supportsShowIndex = DB::connection()->getDriverName() !== 'sqlite';

        if (! Schema::hasColumn('ninos', 'persona_id')) {
            Schema::table('ninos', function (Blueprint $table) {
                $table->foreignId('persona_id')->nullable()->after('id')->constrained('personas')->nullOnDelete();
                $table->unique('persona_id');
            });
        }

        Schema::dropIfExists('discapacidad_nino');

        $columnsToDrop = ['nombres', 'apellidos', 'run', 'dv', 'documento', 'fecha_nacimiento', 'sexo'];
        $existingColumns = collect($columnsToDrop)
            ->filter(fn ($column) => Schema::hasColumn('ninos', $column))
            ->values()
            ->all();

        if (! empty($existingColumns)) {
            $runIndexExists = $supportsShowIndex
                ? collect(DB::select("SHOW INDEX FROM ninos WHERE Key_name = 'ninos_run_unique'"))->isNotEmpty()
                : false;

            Schema::table('ninos', function (Blueprint $table) use ($existingColumns, $runIndexExists) {
                if ($runIndexExists) {
                    $table->dropUnique('ninos_run_unique');
                }

                $table->dropColumn($existingColumns);
            });
        }
    }
};
```

## 2025_12_05_010000_rename_organizacion_user_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('organizacion_user')) {
            return;
        }

        Schema::create('organizacion_persona_tmp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizacion_id')->constrained('organizaciones')->cascadeOnDelete();
            $table->foreignId('persona_id')->constrained('personas')->cascadeOnDelete();
            $table->boolean('es_principal')->default(false);
            $table->boolean('es_reserva')->default(false);
            $table->boolean('activo')->default(true);
            $table->date('fecha_asignacion')->nullable();
            $table->date('fecha_desactivacion')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['organizacion_id', 'persona_id']);
            $table->index(['organizacion_id', 'es_principal']);
        });

        DB::table('organizacion_user')->orderBy('id')->chunk(500, function ($rows) {
            $payload = [];
            $now = now();

            foreach ($rows as $row) {
                $payload[] = [
                    'id' => $row->id,
                    'organizacion_id' => $row->organizacion_id,
                    'persona_id' => $row->user_id,
                    'es_principal' => (bool) $row->es_principal,
                    'es_reserva' => (bool) $row->es_reserva,
                    'activo' => (bool) $row->activo,
                    'fecha_asignacion' => $row->fecha_asignacion,
                    'fecha_desactivacion' => $row->fecha_desactivacion,
                    'observaciones' => $row->observaciones,
                    'created_at' => $row->created_at ?? $now,
                    'updated_at' => $row->updated_at ?? $now,
                ];
            }

            if (! empty($payload)) {
                DB::table('organizacion_persona_tmp')->insert($payload);
            }
        });

        Schema::drop('organizacion_user');
        Schema::rename('organizacion_persona_tmp', 'organizacion_persona');
    }

    public function down(): void
    {
        if (! Schema::hasTable('organizacion_persona')) {
            return;
        }

        Schema::create('organizacion_user_tmp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizacion_id')->constrained('organizaciones')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('personas')->cascadeOnDelete();
            $table->boolean('es_principal')->default(false);
            $table->boolean('es_reserva')->default(false);
            $table->boolean('activo')->default(true);
            $table->date('fecha_asignacion')->nullable();
            $table->date('fecha_desactivacion')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['organizacion_id', 'user_id']);
            $table->index(['organizacion_id', 'es_principal']);
        });

        DB::table('organizacion_persona')->orderBy('id')->chunk(500, function ($rows) {
            $payload = [];
            $now = now();

            foreach ($rows as $row) {
                $payload[] = [
                    'id' => $row->id,
                    'organizacion_id' => $row->organizacion_id,
                    'user_id' => $row->persona_id,
                    'es_principal' => (bool) $row->es_principal,
                    'es_reserva' => (bool) $row->es_reserva,
                    'activo' => (bool) $row->activo,
                    'fecha_asignacion' => $row->fecha_asignacion,
                    'fecha_desactivacion' => $row->fecha_desactivacion,
                    'observaciones' => $row->observaciones,
                    'created_at' => $row->created_at ?? $now,
                    'updated_at' => $row->updated_at ?? $now,
                ];
            }

            if (! empty($payload)) {
                DB::table('organizacion_user_tmp')->insert($payload);
            }
        });

        Schema::drop('organizacion_persona');
        Schema::rename('organizacion_user_tmp', 'organizacion_user');
    }
};
```

