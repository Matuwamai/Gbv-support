import { PrismaClient } from "@prisma/client";

// A single shared client so the app doesn't open a new connection pool
// for every controller module.
const prisma = new PrismaClient();

export default prisma;
