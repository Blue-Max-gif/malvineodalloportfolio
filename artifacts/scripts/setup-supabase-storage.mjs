/**
 * Creates the Supabase Storage `uploads` bucket and its RLS policies
 * using the existing DATABASE_URL (postgres connection).
 *
 * Runs automatically during the Vercel build.
 */
import pg from "pg";

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set — skipping storage setup");
  process.exit(0);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();

  await client.query(`
    INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
    VALUES ('uploads', 'uploads', true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET public = true
  `);
  console.log("✓ uploads bucket ready");

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects'
          AND policyname = 'uploads_anon_insert'
      ) THEN
        CREATE POLICY "uploads_anon_insert" ON storage.objects
          FOR INSERT TO anon WITH CHECK (bucket_id = 'uploads');
      END IF;
    END $$
  `);
  console.log("✓ INSERT policy ready");

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects'
          AND policyname = 'uploads_public_select'
      ) THEN
        CREATE POLICY "uploads_public_select" ON storage.objects
          FOR SELECT TO public USING (bucket_id = 'uploads');
      END IF;
    END $$
  `);
  console.log("✓ SELECT policy ready");

  console.log("\nSupabase storage setup complete.");
} catch (err) {
  console.error("Storage setup failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
