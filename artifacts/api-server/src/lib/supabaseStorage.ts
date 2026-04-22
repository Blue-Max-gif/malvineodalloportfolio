import { randomUUID } from "node:crypto";

const BUCKET_NAME = "uploads";

function getConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  return { url, key };
}

async function ensureBucket(url: string, key: string): Promise<void> {
  const checkRes = await fetch(`${url}/storage/v1/bucket/${BUCKET_NAME}`, {
    headers: { Authorization: `Bearer ${key}`, apikey: key },
  });
  if (checkRes.status !== 200) {
    const createRes = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: BUCKET_NAME, name: BUCKET_NAME, public: true }),
    });
    if (!createRes.ok) {
      const body = await createRes.text();
      throw new Error(`Failed to create storage bucket: ${createRes.status} ${body}`);
    }
  }
}

export async function createSignedUploadUrl(): Promise<{
  uploadURL: string;
  publicUrl: string;
}> {
  const { url, key } = getConfig();

  await ensureBucket(url, key);

  const objectPath = randomUUID();

  const res = await fetch(
    `${url}/storage/v1/object/upload/sign/${BUCKET_NAME}/${objectPath}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ upsert: false }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create signed upload URL: ${res.status} ${body}`);
  }

  const { token } = (await res.json()) as { token: string };

  const uploadURL = `${url}/storage/v1/object/upload/sign/${BUCKET_NAME}/${objectPath}?token=${token}`;
  const publicUrl = `${url}/storage/v1/object/public/${BUCKET_NAME}/${objectPath}`;

  return { uploadURL, publicUrl };
}
