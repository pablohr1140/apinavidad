const { PrismaClient } = require('@prisma/client');
(async () => {
  const client = new PrismaClient();
  try {
    console.log(Object.keys(client));
    console.log('has organizaciones?', typeof client.organizaciones);
  } finally {
    await client.$disconnect();
  }
})();
