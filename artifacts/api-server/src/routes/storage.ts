import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import express from "express";
import { uploadFile } from "../lib/supabaseStorage";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";

const router: IRouter = Router();

/**
 * POST /storage/upload
 *
 * Upload a file to Supabase Storage.
 * Send the raw file bytes as the request body with the correct Content-Type header.
 * Returns { url } — the public CDN URL for the uploaded file.
 */
router.post(
  "/storage/upload",
  express.raw({ type: "*/*", limit: "10mb" }),
  async (req: Request, res: Response) => {
    const contentType = (req.headers["content-type"] || "application/octet-stream")
      .split(";")[0]
      .trim();
    const buffer = req.body as Buffer;

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      res.status(400).json({ error: "No file data received" });
      return;
    }

    try {
      const url = await uploadFile(buffer, contentType);
      res.json({ url });
    } catch (error) {
      console.error("File upload failed:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

/**
 * GET /storage/objects/* and /storage/public-objects/*
 *
 * Legacy proxy routes for files stored in Replit Object Storage.
 * New uploads use Supabase CDN URLs directly — these routes exist
 * only for backward compatibility with any old file paths.
 */
const objectStorageService = new ObjectStorageService();

router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    const response = await objectStorageService.downloadObject(file);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
