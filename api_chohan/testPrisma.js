// testPrisma.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Querying all roles from the database
    const roles = await prisma.role.findMany();
    console.log(roles); // This will print all the roles from your database
  } catch (error) {
    console.error("Error querying the database:", error);
  } finally {
    // Always disconnect Prisma when done
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error("Error:", e);
  });
