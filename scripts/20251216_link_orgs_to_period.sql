-- Asocia todas las organizaciones al periodo indicado si no existe relación previa
-- Ajusta @PeriodoId al periodo destino (ej: 2025 reintegrado)
-- Ejecuta en BD_NAVIDAD

DECLARE @PeriodoId INT = 1; -- cambiar

SET NOCOUNT ON;

;WITH orgs AS (
  SELECT id FROM organizaciones
)
INSERT INTO organizacion_periodo (organizacion_id, periodo_id, estado, fecha_asignacion, observaciones)
SELECT o.id, @PeriodoId, 'pendiente', CAST(GETDATE() AS date), 'Asociado masivamente'
FROM orgs o
WHERE NOT EXISTS (
  SELECT 1 FROM organizacion_periodo op WHERE op.organizacion_id = o.id AND op.periodo_id = @PeriodoId
);
