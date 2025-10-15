import { Router } from "express";

import timesheetRouter from "./timesheets.mjs";

const router = Router();

router.use(timesheetRouter);

export default router;
