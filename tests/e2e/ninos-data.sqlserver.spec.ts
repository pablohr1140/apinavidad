import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import sql from 'mssql';

const runDbTests = String(process.env.RUN_DB_TESTS ?? '').toLowerCase() === 'true';
const describeIf = runDbTests ? describe : describe.skip;

const dbConfig: sql.config = {
  user: process.env.DB_USER ?? 'sa',
  password: process.env.DB_PASSWORD ?? 'VeryStrongPwd123!',
  server: process.env.DB_HOST ?? 'localhost',
  database: process.env.DB_NAME ?? 'BD_NAVIDAD',
  port: Number(process.env.DB_PORT ?? 1433),
  options: { encrypt: false, trustServerCertificate: true }
};

describeIf('SQL Server datos ninos (solo chilenos)', () => {
  let pool: sql.ConnectionPool;

  beforeAll(async () => {
    pool = await new sql.ConnectionPool(dbConfig).connect();
  });

  afterAll(async () => {
    await pool?.close();
  });

  it('total de ninos coincide con fuente filtrada', async () => {
    const totalNinos = await pool.request().query<{ c: number }>(
      'SELECT COUNT(*) AS c FROM dbo.ninos'
    );

    const totalFuente = await pool.request().query<{ c: number }>(
      `SELECT COUNT(*) AS c
       FROM dbo.A_NINOS
       WHERE idNacionalidad = 1
         AND dni LIKE '%-%'
         AND TRY_CONVERT(BIGINT, PARSENAME(REPLACE(dni, '-', '.'), 2)) IS NOT NULL
         AND LEN(PARSENAME(REPLACE(dni, '-', '.'), 2)) BETWEEN 7 AND 8
         AND UPPER(PARSENAME(REPLACE(dni, '-', '.'), 1)) LIKE '[0-9K]'`
    );

    expect(totalNinos.recordset[0].c).toBe(totalFuente.recordset[0].c);
  });

  it('no hay RUT mal formados', async () => {
    const res = await pool.request().query<{ c: number }>(
      `SELECT COUNT(*) AS c
       FROM dbo.ninos
       WHERE run IS NULL
          OR dv IS NULL
          OR LEN(run) NOT BETWEEN 7 AND 8
          OR dv NOT LIKE '[0-9K]'`
    );
    expect(res.recordset[0].c).toBe(0);
  });

  it('todos tienen periodo_id resuelto', async () => {
    const res = await pool.request().query<{ c: number }>(
      'SELECT COUNT(*) AS c FROM dbo.ninos WHERE periodo_id IS NULL'
    );
    expect(res.recordset[0].c).toBe(0);
  });

  it('organizacion_id existe cuando no es NULL', async () => {
    const res = await pool.request().query<{ c: number }>(
      `SELECT COUNT(*) AS c
       FROM dbo.ninos n
       LEFT JOIN dbo.organizaciones o ON o.id = n.organizacion_id
       WHERE n.organizacion_id IS NOT NULL AND o.id IS NULL`
    );
    expect(res.recordset[0].c).toBe(0);
  });

  it('no hay RUN duplicados', async () => {
    const res = await pool.request().query<{ run: string }>(
      `SELECT TOP 1 run
       FROM dbo.ninos
       WHERE run IS NOT NULL
       GROUP BY run
       HAVING COUNT(*) > 1`
    );
    expect(res.recordset.length).toBe(0);
  });
});
