const sql = require('mssql');

async function main() {
  const pool = await sql.connect({
    server: 'localhost',
    port: 1433,
    user: 'testeo',
    password: '1122',
    database: 'BD_NAVIDAD',
    options: { encrypt: false, trustServerCertificate: true }
  });

  const catalog = await pool.request().query(`SELECT idEtnia AS id, nombre FROM dbo.A_ETNIAS`);
  console.log('A_ETNIAS sample:', catalog.recordset.slice(0, 50));

  await pool.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
