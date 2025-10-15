import mongoose from "mongoose";

const TimsheetSchema = new mongoose.Schema({
  date: {
    type: mongoose.Schema.Types.Date,
    required: true,
    unique: true,
  },
  chargeble_hours: {
    type: mongoose.Schema.Types.Int32,
    required: true,
  },
  pto: {
    type: mongoose.Schema.Types.Int32,
    required: false,
  },
  holiday_hour: {
    type: mongoose.Schema.Types.Int32,
    required: false,
  },
  deliverables: {
    type: mongoose.Schema.Types.Array,
    required: true,
  },
});

export const Timesheet = mongoose.model("Timesheet", TimsheetSchema);
