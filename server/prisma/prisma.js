import sqlite3 from 'sqlite3';

sqlite3.verbose();
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
	log: ['query', 'info', 'warn', 'error'],
});
export default prisma;
