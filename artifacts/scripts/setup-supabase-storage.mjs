/**
 * Creates the Supabase Storage `uploads` bucket and its RLS policies
 * using the existing DATABASE_URL (postgres connection).
 *
 * Run once: DATABASE_URL=... node artifacts/scripts/setup-supabase-storage.mjs
 * Or it runs automatically during the Vercel build.
 */
import pg from "pg";

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();

  // Create the uploads bucket (public = files readable by anyone via CDN)
  await client.query(`
    INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
    VALUES ('uploads', 'uploads', true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET public = true;
  `);
  console.log("✓ uploads bucket ready");

  // Allow anon role to upload files
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
    END $$;
  `);
  console.log("✓ INSERT policy ready");

  // Allow everyone to read files (required for public CDN access via RLS)
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
    END $$;
  `);
  console.log("✓ SELECT policy ready");

  console.log("\nSupabase storage setup complete.");
} catch (err) {
  console.error("Setup failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
