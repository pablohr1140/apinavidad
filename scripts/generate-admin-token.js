require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { V3 } = require('paseto');
const { createHash } = require('crypto');

async function main() {
  const prisma = new PrismaClient();

  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('DEFAULT_ADMIN_EMAIL/DEFAULT_ADMIN_PASSWORD faltan');
    }

    const user = await prisma.personas.findFirst({ where: { email }, include: { roles: true } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) {
      throw new Error('Password invalido');
    }

    const secretKey = createHash('sha256').update(process.env.PASETO_SECRET).digest();
    const accessExp = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const payload = { sub: String(user.id), email: user.email };

    const accessToken = await V3.encrypt({ ...payload, exp: accessExp }, secretKey);
    const refreshToken = await V3.encrypt({ ...payload, exp: refreshExp }, secretKey);
    const roleKeys = user.roles ? [user.roles.role_key] : [];

    console.log(
      JSON.stringify(
        {
          accessToken,
          refreshToken,
          user: { id: user.id, email: user.email, roles: roleKeys }
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
