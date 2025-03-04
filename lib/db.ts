import { PrismaClient } from "@prisma/client";

// Declare a global variable to store the Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single Prisma client instance or use the existing global instance
export const db = globalThis.prisma || new PrismaClient();

// In non-production environments, store the Prisma client on the global object
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
