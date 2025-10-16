import { Router } from "express";
import { createTimesheetValidationSchema } from "../utils/validationSchema.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { Timesheet } from "../mongoose/schemas/timesheet.mjs";
import ExcelJs from "exceljs";

const router = Router();

router.get("/api/timesheet/:day/:month/:year", async (req, res) => {
  const {
    params: { day, month, year },
  } = req;
  const startDate = new Date(`${year}-${month}-${day}`);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);

  try {
    const result = await Timesheet.find({
      date: { $gte: startDate, $lte: endDate },
    });
    if (result.length > 0) {
      console.log("res", result[0]);

      return res.send(result).status(200);
    } else {
      return res.send("No timesheet found!").status(404);
    }
  } catch (err) {
    return res.send("Something went wrong!").status(404);
  }
});

router.get("/api/timesheet/:month/:year", async (req, res) => {
  console.log("also reaches here");
  const {
    params: { month, year },
  } = req;

  const formattedMonth = month.padStart(2, "0");

  const startDate = new Date(`${year}-${formattedMonth}-01T00:00:00.000Z`);
  const endDate = new Date(
    new Date(startDate).setMonth(startDate.getMonth() + 1) - 1
  );
  try {
    const result = await Timesheet.find({
      date: { $gte: startDate, $lte: endDate },
    });
    if (result.length > 0) {
      return res.send(result).status(200);
    } else {
      return res.send("No timesheet found for the given month").status(404);
    }

    // res.send(result).status(200);
  } catch (err) {
    return res.send("Something went wrong!").status(400);
  }
});

router.get("/api/timesheet-export/:month/:year", async (req, res) => {
  const {
    params: { month, year },
  } = req;

  const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
  const endDate = new Date(
    new Date(startDate).setMonth(startDate.getMonth() + 1) - 1
  );
  try {
    const result = await Timesheet.find({
      date: { $gte: startDate, $lte: endDate },
    });
    if (result.length > 0) {
      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet("Timesheet");
      worksheet.columns = [
        { header: "Date", key: "date", width: 25 },
        { header: "Chargeble Hours", key: "chargeble_hours", width: 25 },
        { header: "PTO", key: "pto", width: 25 },
        { header: "Holiday Hours", key: "holiday_hour", width: 25 },
        { header: "Deliverables", key: "deliverables", width: 100 },
      ];
      result.forEach((t) => {
        worksheet.addRow({
          date: t.date,
          chargeble_hours: t.chargeble_hours,
          pto: t.pto,
          holiday_hour: t.holiday_hour,
          deliverables: t.deliverables,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=timesheets.xlsx"
      );
      return res.send(buffer);
    } else {
      return res.sendStatus(200);
    }
  } catch (err) {
    return res.send("Something went wrong!").status(400);
  }
});

router.post(
  "/api/timesheet",
  checkSchema(createTimesheetValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    const data = matchedData(req);

    const newTimesheet = new Timesheet(data);
    try {
      const savedTimesheet = await newTimesheet.save();
      return res.status(201).send(savedTimesheet);
    } catch (err) {
      return res.sendStatus(404);
    }
  }
);

router.delete("/api/timesheet/:day/:month/:year", async (req, res) => {
  const {
    params: { day, month, year },
  } = req;

  const startDate = new Date(`${year}-${month}-${day}`);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);
  try {
    const result = await Timesheet.deleteOne({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (result.deletedCount > 0) {
      return res.send("Timesheet deleted").status(200);
    } else {
      return res.send("Couldnt find timesheet!").status(404);
    }
  } catch (err) {
    return res.send("Something went wrong!").status(400);
  }
});

export default router;
