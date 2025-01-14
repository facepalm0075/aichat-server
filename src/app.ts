import express from "express";
import { queueRouter } from "./routes/queueRoute";
import cors from "cors";

const app = express();
app.use(cors());
app.use("/queue", queueRouter);

export default app;
