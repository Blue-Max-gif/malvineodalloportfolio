import { randomUUID } from "node:crypto";

const BUCKET_NAME = "uploads";

function getConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
  }
  return { url, key };
}

/**
 * Upload a file buffer to Supabase Storage and return its public CDN URL.
 * The `uploads` bucket must already exist and have an INSERT policy for `anon` role.
 * Run `node scripts/setup-supabase-storage.mjs` once to create the bucket and policies.
 */
export async function uploadFile(
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const { url, key } = getConfig();
  const objectPath = randomUUID();

  const res = await fetch(`${url}/storage/v1/object/${BUCKET_NAME}/${objectPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase upload failed: ${res.status} ${body}`);
  }

  return `${url}/storage/v1/object/public/${BUCKET_NAME}/${objectPath}`;
}
