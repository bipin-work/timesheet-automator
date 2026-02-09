import { Router } from "express";

import timesheetRouter from "./timesheets.mjs";
import userRouter from "./user.mjs";

const router = Router();

router.use(timesheetRouter);
router.use(userRouter);

export default router;
