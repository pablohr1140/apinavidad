-- Seed de providencias básicas
-- Ejecuta en SQL Server contra la BD BD_NAVIDAD
-- Ejemplo: sqlcmd -S localhost,1433 -U sa -P "<PASS>" -d BD_NAVIDAD -i scripts/providencias_seed.sql

SET NOCOUNT ON;

INSERT INTO providencias (nombre, codigo)
VALUES
('Providencia Centro', 'PV01'),
('Providencia Norte', 'PV02'),
('Providencia Sur', 'PV03'),
('Providencia Oriente', 'PV04'),
('Providencia Poniente', 'PV05');
