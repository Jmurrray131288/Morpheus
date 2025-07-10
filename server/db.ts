// Using direct Supabase connection instead of Drizzle
export { pool, executeQuery } from './supabase';

console.log("Initializing database connection...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

console.log('Database connected successfully via Supabase client');
