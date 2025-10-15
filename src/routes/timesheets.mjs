import { Router } from "express";
import { createTimesheetValidationSchema } from "../utils/validationSchema.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { Timesheet } from "../mongoose/schemas/timesheet.mjs";
import ExcelJs from "exceljs";

const router = Router();

router.get("/api/timesheet/:month/:year", async (req, res) => {
  const {
    params: { month, year },
  } = req;

  console.log("Getting all timesheet", month, year);
  const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
  const endDate = new Date(
    new Date(startDate).setMonth(startDate.getMonth() + 1) - 1
  );
  try {
    const result = await Timesheet.find({
      date: { $gte: startDate, $lte: endDate },
    });
    if (result.length > 0) {
      console.log("processing xls");
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
      res.send(buffer);
    } else {
      res.sendStatus(200);
    }

    // res.send(result).status(200);
  } catch (err) {
    console.log("error", err);
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

    console.log("data", data);
    const newTimesheet = new Timesheet(data);
    try {
      const savedTimesheet = await newTimesheet.save();
      return res.status(201).send(savedTimesheet);
    } catch (err) {
      return res.sendStatus(404);
    }
  }
);

export default router;
