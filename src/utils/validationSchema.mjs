export const createTimesheetValidationSchema = {
  date: {
    isISO8601: {
      errorMessage: "Invalid date format",
    },
    toDate: true,
  },
  chargeble_hours: {
    isInt: {
      errorMessage: "Chargeble hours must be an integer",
    },
    custom: {
      options: (value) => {
        if (value > 8) {
          throw new Error("Chargeble hours cannot be gerater than 8");
        }
        return true;
      },
    },
  },
  pto: {
    isInt: {
      errorMessage: "Pto must be an integer",
    },
  },
  holiday_hour: {
    isInt: {
      errorMessage: "Holiday hours must be an integer",
    },
    custom: {
      options: (value) => {
        if (value > 8) {
          throw new Error("Chargeble hours cannot be gerater than 8");
        }
        return true;
      },
    },
  },
  deliverables: {
    isArray: {
      errorMessage: "Deliverables is an array",
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Deliverables cannot be empty");
        }
        if (
          !value.every((item) => typeof item === "string" && item.trim() !== "")
        ) {
          throw new Error("Each deliverable must be a non empty string");
        }
        return true;
      },
    },
  },
};
