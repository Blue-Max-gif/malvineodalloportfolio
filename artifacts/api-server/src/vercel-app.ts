import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

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
