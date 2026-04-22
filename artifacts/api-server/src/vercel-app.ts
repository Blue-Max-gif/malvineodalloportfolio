import express, { type Express, type Request } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

// Provide a console-based req.log for routes that use it (pino not available on Vercel)
app.use((req: Request, _res, next) => {
  if (!req.log) {
    (req as Request & { log: typeof console }).log = console;
  }
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("etag");
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  next();
});

app.use("/api", router);

export default app;
